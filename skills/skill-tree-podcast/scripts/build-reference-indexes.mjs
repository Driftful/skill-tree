#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const skillRoot = path.resolve(scriptDir, "..");
const referencesRoot = path.join(skillRoot, "references");
const parserScript = path.join(skillRoot, "scripts", "parse-markdown-json.py");

const generationRules = {
  folderIndexName: "index.md",
  entityIndexSuffix: ".index.md",
  propertyNamespaceAllowlist: {
    directory: new Set(["kind"]),
  },
  entityUsageCollectionAllowlist: new Set(["directory", "speakers"]),
  shouldGeneratePropertyNamespace({ collection, property, valueCount }) {
    return (
      valueCount > 0 &&
      this.propertyNamespaceAllowlist[collection]?.has(property) === true
    );
  },
  shouldGenerateEntityUsagePage({ collection, inboundReferenceCount }) {
    return (
      inboundReferenceCount > 0 &&
      this.entityUsageCollectionAllowlist.has(collection)
    );
  },
};

const frontmatterRelationshipRules = [
  {
    sourceCollection: "episodes",
    property: "hosts",
    targetCollection: "speakers",
    type: "speaker-appearance",
    relationLabel: "host",
  },
  {
    sourceCollection: "episodes",
    property: "guests",
    targetCollection: "speakers",
    type: "speaker-appearance",
    relationLabel: "guest",
  },
];

const mode = process.argv.includes("--check") ? "check" : "write";

function keyFor(collection, slug) {
  return `${collection}/${slug}`;
}

function compareText(a, b) {
  return a.replace(/\r\n/g, "\n") === b.replace(/\r\n/g, "\n");
}

function toDisplayCollectionName(collection) {
  return collection
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toTitle(value) {
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toPathSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function getRecordDisplayTitle(record) {
  if (record.collection === "episodes") {
    const episodeNumber = record.metadata.number;
    const episodeTitle = record.metadata.title || toTitle(record.slug);
    if (typeof episodeNumber === "number") {
      return `${String(episodeNumber).padStart(3, "0")}: ${episodeTitle}`;
    }
    return episodeTitle;
  }

  return (
    record.metadata.name ||
    record.metadata.title ||
    toTitle(record.slug)
  );
}

function getRecordSummary(record) {
  const summary =
    record.metadata.summary ||
    record.metadata.bio ||
    firstParagraph(record.markdown);
  return summary ? collapseWhitespace(summary) : "";
}

function collapseWhitespace(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function firstParagraph(markdown) {
  return String(markdown)
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk && !chunk.startsWith("#"));
}

function compareStrings(a, b) {
  return a.localeCompare(b, "en", { sensitivity: "base" });
}

function compareRecords(a, b) {
  if (a.collection === "episodes" && b.collection === "episodes") {
    const aNumber =
      typeof a.metadata.number === "number"
        ? a.metadata.number
        : Number.POSITIVE_INFINITY;
    const bNumber =
      typeof b.metadata.number === "number"
        ? b.metadata.number
        : Number.POSITIVE_INFINITY;
    if (aNumber !== bNumber) return aNumber - bNumber;
  }
  const byTitle = compareStrings(getRecordDisplayTitle(a), getRecordDisplayTitle(b));
  if (byTitle !== 0) return byTitle;
  return compareStrings(a.slug, b.slug);
}

function relativeLink(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  const relative = path.relative(fromDir, toFile).replaceAll(path.sep, "/");
  return relative.startsWith(".") ? relative : `./${relative}`;
}

function formatCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

async function parseMarkdownFile(filePath) {
  try {
    const { stdout, stderr } = await execFileAsync("uv", [
      "run",
      "--script",
      parserScript,
      filePath,
    ]);
    if (stderr.trim()) {
      process.stderr.write(stderr);
    }
    return JSON.parse(stdout);
  } catch (error) {
    const details = error.stderr?.trim() || error.message;
    throw new Error(`Failed to parse ${filePath}: ${details}`);
  }
}

async function discoverSourceCollections() {
  const entries = await fs.readdir(referencesRoot, { withFileTypes: true });
  const collections = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const collection = entry.name;
    const collectionDir = path.join(referencesRoot, collection);
    const files = (await fs.readdir(collectionDir, { withFileTypes: true }))
      .filter(
        (child) =>
          child.isFile() &&
          child.name.endsWith(".md") &&
          child.name !== generationRules.folderIndexName &&
          !child.name.endsWith(generationRules.entityIndexSuffix),
      )
      .map((child) => path.join(collectionDir, child.name))
      .sort(compareStrings);

    collections.push({ collection, collectionDir, files });
  }

  collections.sort((a, b) => compareStrings(a.collection, b.collection));
  return collections;
}

async function loadGraph() {
  const discoveredCollections = await discoverSourceCollections();
  const records = [];
  const recordsByKey = new Map();
  const warnings = [];

  for (const { collection, files } of discoveredCollections) {
    for (const filePath of files) {
      const slug = path.basename(filePath, ".md");
      const parsed = await parseMarkdownFile(filePath);
      const metadata = parsed.frontmatter || {};

      if (collection !== "transcripts" && Object.keys(metadata).length === 0) {
        throw new Error(`Missing YAML frontmatter in ${filePath}`);
      }

      const record = {
        collection,
        slug,
        filePath,
        metadata,
        markdown: parsed.markdown || "",
        html: parsed.html || "",
      };

      records.push(record);
      recordsByKey.set(keyFor(collection, slug), record);
    }
  }

  const edges = [];
  const unresolvedLinks = [];
  const missingFrontmatterLinks = [];

  for (const record of records) {
    const sourceKey = keyFor(record.collection, record.slug);

    for (const rule of frontmatterRelationshipRules) {
      if (record.collection !== rule.sourceCollection) continue;
      for (const targetSlug of ensureArray(record.metadata[rule.property])) {
        const targetKey = keyFor(rule.targetCollection, targetSlug);
        const targetRecord = recordsByKey.get(targetKey);
        if (!targetRecord) {
          warnings.push(
            `Missing ${rule.targetCollection.slice(0, -1)} slug "${targetSlug}" referenced by ${record.collection}/${record.slug}`,
          );
          continue;
        }
        edges.push({
          type: rule.type,
          sourceKey,
          targetKey,
          relationLabel: rule.relationLabel,
          contextKey: sourceKey,
        });
      }
    }

    for (const href of extractLocalReferenceLinks(record.markdown)) {
      const resolvedPath = path.resolve(path.dirname(record.filePath), href);
      if (!resolvedPath.startsWith(referencesRoot)) continue;
      const relativePath = path.relative(referencesRoot, resolvedPath);
      const segments = relativePath.split(path.sep);
      if (segments.length < 2) {
        missingFrontmatterLinks.push(
          `${record.collection}/${record.slug} links to a non-collection path: ${href}`,
        );
        continue;
      }

      const targetCollection = segments[0];
      const targetFileName = segments.at(-1);
      if (
        !targetFileName.endsWith(".md") ||
        targetFileName === generationRules.folderIndexName ||
        targetFileName.endsWith(generationRules.entityIndexSuffix)
      ) {
        continue;
      }

      const targetSlug = path.basename(targetFileName, ".md");
      const targetKey = keyFor(targetCollection, targetSlug);
      if (!recordsByKey.has(targetKey)) {
        unresolvedLinks.push(
          `${record.collection}/${record.slug} -> ${href} (resolved to ${targetCollection}/${targetSlug})`,
        );
        continue;
      }

      edges.push({
        type: "local-link",
        sourceKey,
        targetKey,
        relationLabel: "linked",
        contextKey:
          record.collection === "transcripts" &&
          recordsByKey.has(keyFor("episodes", record.slug))
            ? keyFor("episodes", record.slug)
            : sourceKey,
      });
    }
  }

  warnings.push(...missingFrontmatterLinks);

  const inboundByTarget = new Map();
  for (const edge of edges) {
    const bucket = inboundByTarget.get(edge.targetKey) || [];
    bucket.push(edge);
    inboundByTarget.set(edge.targetKey, bucket);
  }

  return {
    records,
    recordsByKey,
    inboundByTarget,
    warnings,
    unresolvedLinks,
    collections: discoveredCollections.map(({ collection }) => collection),
  };
}

function extractLocalReferenceLinks(markdown) {
  const links = [];
  const pattern = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)\s]+\.md)\)/g;
  for (const match of String(markdown).matchAll(pattern)) {
    links.push(match[1]);
  }
  return links;
}

function buildPropertyBuckets(records) {
  const bucketMap = new Map();

  for (const record of records) {
    const allowlist = generationRules.propertyNamespaceAllowlist[record.collection];
    if (!allowlist) continue;

    for (const property of allowlist) {
      const rawValues = ensureArray(record.metadata[property]);
      const normalizedValues =
        rawValues.length > 0
          ? rawValues.map((value) => ({
              rawValue: String(value),
              slug: toPathSlug(value),
            }))
          : [{ rawValue: "unknown", slug: "unknown" }];

      const propertyKey = `${record.collection}:${property}`;
      const propertyBucket = bucketMap.get(propertyKey) || {
        collection: record.collection,
        property,
        values: new Map(),
      };

      for (const value of normalizedValues) {
        const valueBucket = propertyBucket.values.get(value.slug) || {
          valueSlug: value.slug,
          valueLabel: value.rawValue,
          records: [],
        };
        valueBucket.records.push(record);
        propertyBucket.values.set(value.slug, valueBucket);
      }

      bucketMap.set(propertyKey, propertyBucket);
    }
  }

  return [...bucketMap.values()]
    .filter((bucket) =>
      generationRules.shouldGeneratePropertyNamespace({
        collection: bucket.collection,
        property: bucket.property,
        valueCount: bucket.values.size,
      }),
    )
    .sort((a, b) => {
      const byCollection = compareStrings(a.collection, b.collection);
      if (byCollection !== 0) return byCollection;
      return compareStrings(a.property, b.property);
    });
}

function groupRecordsByCollection(records) {
  const grouped = new Map();
  for (const record of records) {
    const bucket = grouped.get(record.collection) || [];
    bucket.push(record);
    grouped.set(record.collection, bucket);
  }
  for (const bucket of grouped.values()) {
    bucket.sort(compareRecords);
  }
  return grouped;
}

function planOutputs(graph) {
  const collectionRecords = groupRecordsByCollection(graph.records);
  const propertyBuckets = buildPropertyBuckets(graph.records);
  const propertyBucketsByCollection = new Map();
  for (const bucket of propertyBuckets) {
    const collectionBucket = propertyBucketsByCollection.get(bucket.collection) || [];
    collectionBucket.push(bucket);
    propertyBucketsByCollection.set(bucket.collection, collectionBucket);
  }

  const outputs = new Map();

  for (const collection of graph.collections) {
    const collectionDir = path.join(referencesRoot, collection);
    const records = collectionRecords.get(collection) || [];
    const propertyNamespaces = propertyBucketsByCollection.get(collection) || [];
    const outputPath = path.join(collectionDir, generationRules.folderIndexName);
    outputs.set(
      outputPath,
      renderCollectionHub({
        collection,
        records,
        propertyNamespaces,
        outputPath,
      }),
    );
  }

  for (const bucket of propertyBuckets) {
    const namespaceDir = path.join(referencesRoot, bucket.collection, bucket.property);
    const namespaceIndexPath = path.join(
      namespaceDir,
      generationRules.folderIndexName,
    );
    outputs.set(
      namespaceIndexPath,
      renderPropertyNamespaceIndex({
        bucket,
        outputPath: namespaceIndexPath,
      }),
    );

    for (const valueBucket of [...bucket.values.values()].sort((a, b) =>
      compareStrings(a.valueLabel, b.valueLabel),
    )) {
      valueBucket.records.sort(compareRecords);
      const valueOutputPath = path.join(
        namespaceDir,
        `${valueBucket.valueSlug}${generationRules.entityIndexSuffix}`,
      );
      outputs.set(
        valueOutputPath,
        renderPropertyValuePage({
          bucket,
          valueBucket,
          outputPath: valueOutputPath,
        }),
      );
    }
  }

  for (const record of graph.records.sort(compareRecords)) {
    const inboundEdges = graph.inboundByTarget.get(keyFor(record.collection, record.slug)) || [];
    if (
      !generationRules.shouldGenerateEntityUsagePage({
        collection: record.collection,
        inboundReferenceCount: inboundEdges.length,
      })
    ) {
      continue;
    }

    const outputPath = path.join(
      referencesRoot,
      record.collection,
      `${record.slug}${generationRules.entityIndexSuffix}`,
    );
    outputs.set(
      outputPath,
      renderEntityUsagePage({
        record,
        inboundEdges,
        recordsByKey: graph.recordsByKey,
        outputPath,
      }),
    );
  }

  return outputs;
}

function renderCollectionHub({ collection, records, propertyNamespaces, outputPath }) {
  const lines = [
    `# ${toDisplayCollectionName(collection)}`,
    "",
    `Generated hub for ${formatCount(records.length, "reference")} in \`${collection}/\`.`,
    "",
  ];

  if (records.length > 0) {
    lines.push("## Records", "");
    for (const record of records) {
      const summary = getRecordSummary(record);
      const suffix = summary ? ` - ${summary}` : "";
      lines.push(
        `- [${getRecordDisplayTitle(record)}](${relativeLink(
          outputPath,
          record.filePath,
        )})${suffix}`,
      );
    }
    lines.push("");
  }

  if (propertyNamespaces.length > 0) {
    lines.push("## Property Indexes", "");
    for (const bucket of propertyNamespaces) {
      lines.push(
        `- [${bucket.property}](${relativeLink(
          outputPath,
          path.join(referencesRoot, collection, bucket.property, generationRules.folderIndexName),
        )}) - ${formatCount(bucket.values.size, "value")}`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderPropertyNamespaceIndex({ bucket, outputPath }) {
  const valueBuckets = [...bucket.values.values()].sort((a, b) =>
    compareStrings(a.valueLabel, b.valueLabel),
  );

  const lines = [
    `# ${toDisplayCollectionName(bucket.collection)} by ${bucket.property}`,
    "",
    `Generated namespace for ${formatCount(
      valueBuckets.length,
      "value",
    )} under \`${bucket.collection}/${bucket.property}/\`.`,
    "",
    `- [Back to ${bucket.collection}](../index.md)`,
    "",
    "## Values",
    "",
  ];

  for (const valueBucket of valueBuckets) {
    lines.push(
      `- [${valueBucket.valueLabel}](${relativeLink(
        outputPath,
        path.join(
          referencesRoot,
          bucket.collection,
          bucket.property,
          `${valueBucket.valueSlug}${generationRules.entityIndexSuffix}`,
        ),
      )}) - ${formatCount(valueBucket.records.length, "entry", "entries")}`,
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderPropertyValuePage({ bucket, valueBucket, outputPath }) {
  const lines = [
    `# ${toDisplayCollectionName(bucket.collection)}: ${valueBucket.valueLabel}`,
    "",
    `Generated lens for ${formatCount(valueBucket.records.length, "entry", "entries")} with \`${bucket.property}: ${valueBucket.valueLabel}\`.`,
    "",
    `- [Back to ${bucket.property} index](./index.md)`,
    `- [Back to ${bucket.collection}](../index.md)`,
    "",
    "## Entries",
    "",
  ];

  for (const record of valueBucket.records) {
    const summary = getRecordSummary(record);
    const suffix = summary ? ` - ${summary}` : "";
    lines.push(
      `- [${getRecordDisplayTitle(record)}](${relativeLink(
        outputPath,
        record.filePath,
      )})${suffix}`,
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderEntityUsagePage({ record, inboundEdges, recordsByKey, outputPath }) {
  const groupedContexts = new Map();

  for (const edge of inboundEdges) {
    const contextKey = edge.contextKey;
    const bucket = groupedContexts.get(contextKey) || { contextKey, reasons: new Set() };
    bucket.reasons.add(edge.relationLabel);
    groupedContexts.set(contextKey, bucket);
  }

  const contexts = [...groupedContexts.values()]
    .map((entry) => ({
      ...entry,
      record: recordsByKey.get(entry.contextKey),
    }))
    .filter((entry) => entry.record)
    .sort((a, b) => compareRecords(a.record, b.record));

  const lines = [
    `# ${getRecordDisplayTitle(record)} Usage`,
    "",
    `Generated usage page for [${getRecordDisplayTitle(record)}](${relativeLink(
      outputPath,
      record.filePath,
    )}).`,
    "",
  ];

  const relatedPropertyLinks = [];
  const allowlist = generationRules.propertyNamespaceAllowlist[record.collection];
  if (allowlist) {
    for (const property of allowlist) {
      const values = ensureArray(record.metadata[property]);
      const normalizedValues =
        values.length > 0 ? values : ["unknown"];
      for (const value of normalizedValues) {
        relatedPropertyLinks.push(
          `- [${property}: ${value}](${relativeLink(
            outputPath,
            path.join(
              referencesRoot,
              record.collection,
              property,
              `${toPathSlug(value)}${generationRules.entityIndexSuffix}`,
            ),
          )})`,
        );
      }
    }
  }

  lines.push(`- [Back to ${record.collection}](./index.md)`);
  if (relatedPropertyLinks.length > 0) {
    lines.push(...relatedPropertyLinks);
  }
  lines.push("", "## Appears In", "");

  for (const context of contexts) {
    const reasonSummary = [...context.reasons].sort(compareStrings).join(", ");
    lines.push(
      `- [${getRecordDisplayTitle(context.record)}](${relativeLink(
        outputPath,
        context.record.filePath,
      )}) - ${reasonSummary}`,
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

async function listExistingGeneratedFiles() {
  const generatedFiles = [];

  async function walk(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (
        entry.name === generationRules.folderIndexName ||
        entry.name.endsWith(generationRules.entityIndexSuffix)
      ) {
        generatedFiles.push(fullPath);
      }
    }
  }

  await walk(referencesRoot);
  return generatedFiles.sort(compareStrings);
}

async function applyOutputs(outputs) {
  for (const [outputPath, content] of outputs) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, "utf8");
  }

  const existingGeneratedFiles = await listExistingGeneratedFiles();
  const planned = new Set(outputs.keys());
  for (const filePath of existingGeneratedFiles) {
    if (!planned.has(filePath)) {
      await fs.rm(filePath);
    }
  }
}

async function checkOutputs(outputs, warnings, unresolvedLinks) {
  const stale = [];
  const missing = [];
  const extra = [];

  for (const [outputPath, content] of outputs) {
    try {
      const existing = await fs.readFile(outputPath, "utf8");
      if (!compareText(existing, content)) {
        stale.push(path.relative(skillRoot, outputPath));
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        missing.push(path.relative(skillRoot, outputPath));
      } else {
        throw error;
      }
    }
  }

  const existingGeneratedFiles = await listExistingGeneratedFiles();
  const planned = new Set(outputs.keys());
  for (const filePath of existingGeneratedFiles) {
    if (!planned.has(filePath)) {
      extra.push(path.relative(skillRoot, filePath));
    }
  }

  if (warnings.length > 0) {
    process.stderr.write(`Warnings:\n- ${warnings.join("\n- ")}\n`);
  }
  if (unresolvedLinks.length > 0) {
    process.stderr.write(`Unresolved local links:\n- ${unresolvedLinks.join("\n- ")}\n`);
  }

  if (missing.length === 0 && stale.length === 0 && extra.length === 0) {
    process.stdout.write(
      `Reference indexes are up to date (${outputs.size} generated file(s)).\n`,
    );
  } else {
    if (missing.length > 0) {
      process.stderr.write(`Missing generated files:\n- ${missing.join("\n- ")}\n`);
    }
    if (stale.length > 0) {
      process.stderr.write(`Stale generated files:\n- ${stale.join("\n- ")}\n`);
    }
    if (extra.length > 0) {
      process.stderr.write(`Unexpected generated files:\n- ${extra.join("\n- ")}\n`);
    }
  }

  if (
    warnings.length > 0 ||
    unresolvedLinks.length > 0 ||
    missing.length > 0 ||
    stale.length > 0 ||
    extra.length > 0
  ) {
    process.exitCode = 1;
  }
}

async function main() {
  const graph = await loadGraph();
  const outputs = planOutputs(graph);

  if (mode === "check") {
    await checkOutputs(outputs, graph.warnings, graph.unresolvedLinks);
    return;
  }

  await applyOutputs(outputs);

  if (graph.warnings.length > 0) {
    process.stderr.write(`Warnings:\n- ${graph.warnings.join("\n- ")}\n`);
  }
  if (graph.unresolvedLinks.length > 0) {
    process.stderr.write(
      `Unresolved local links were skipped:\n- ${graph.unresolvedLinks.join("\n- ")}\n`,
    );
  }

  process.stdout.write(
    `Generated ${outputs.size} reference index file(s) under skills/skill-tree-podcast/references/\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
