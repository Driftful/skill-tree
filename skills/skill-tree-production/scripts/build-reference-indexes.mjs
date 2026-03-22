#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const hostSkillRoot = path.resolve(scriptDir, "..");
let cliArguments;
try {
  cliArguments = parseCliArguments(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}

const targetDirectory = cliArguments.targetDirectory;
const referencesRoot = targetDirectory;
const parserScript = path.join(hostSkillRoot, "scripts", "parse-markdown-json.py");

const generationRules = {
  folderIndexName: "index.md",
  entityIndexSuffix: ".index.md",
};

const mode = cliArguments.mode;

function usageMessage() {
  return "Usage: node scripts/build-reference-indexes.mjs [--check] <target-directory>";
}

function parseCliArguments(argv) {
  const positional = [];
  let mode = "write";

  for (const arg of argv) {
    if (arg === "--check") {
      mode = "check";
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown argument: ${arg}\n${usageMessage()}`);
    }

    positional.push(arg);
  }

  if (positional.length !== 1) {
    throw new Error(usageMessage());
  }

  return {
    mode,
    targetDirectory: path.resolve(process.cwd(), positional[0]),
  };
}

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

function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function formatYamlScalar(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value == null) return "null";
  return JSON.stringify(String(value));
}

function formatYamlLines(value, indent = 0) {
  const spaces = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return [`${spaces}[]`];

    const lines = [];
    for (const item of value) {
      if (Array.isArray(item) || isPlainObject(item)) {
        lines.push(`${spaces}-`);
        lines.push(...formatYamlLines(item, indent + 2));
      } else {
        lines.push(`${spaces}- ${formatYamlScalar(item)}`);
      }
    }
    return lines;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return [`${spaces}{}`];

    const lines = [];
    for (const [key, child] of entries) {
      if (Array.isArray(child) || isPlainObject(child)) {
        lines.push(`${spaces}${key}:`);
        lines.push(...formatYamlLines(child, indent + 2));
      } else {
        lines.push(`${spaces}${key}: ${formatYamlScalar(child)}`);
      }
    }
    return lines;
  }

  return [`${spaces}${formatYamlScalar(value)}`];
}

function formatFrontmatter(frontmatter) {
  if (!isPlainObject(frontmatter) || Object.keys(frontmatter).length === 0) {
    return "";
  }

  return `---\n${formatYamlLines(frontmatter).join("\n")}\n---\n\n`;
}

function emptyCollectionConfig(frontmatter = {}) {
  return {
    frontmatter,
    displayTitle: null,
    propertyIndexes: [],
    relationshipRules: [],
    generateUsagePages: false,
    usageContextCollection: null,
  };
}

function normalizeStringList(value) {
  const values = [];
  const seen = new Set();

  for (const item of ensureArray(value)) {
    const normalized = String(item).trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    values.push(normalized);
  }

  return values;
}

function normalizeRelationshipRules({ collection, frontmatter, warnings }) {
  const rules = [];

  for (const entry of ensureArray(frontmatter.relationships)) {
    if (!isPlainObject(entry)) {
      warnings.push(
        `Ignored invalid relationship config on ${collection}/index.md: expected an object entry`,
      );
      continue;
    }

    const property =
      typeof entry.property === "string" ? entry.property.trim() : "";
    const targetCollection =
      typeof entry.target_collection === "string"
        ? entry.target_collection.trim()
        : "";
    if (!property || !targetCollection) {
      warnings.push(
        `Ignored invalid relationship config on ${collection}/index.md: expected "property" and "target_collection"`,
      );
      continue;
    }

    const type =
      typeof entry.type === "string" && entry.type.trim()
        ? entry.type.trim()
        : "frontmatter-relationship";
    const relationLabel =
      typeof entry.relation_label === "string" && entry.relation_label.trim()
        ? entry.relation_label.trim()
        : property;

    rules.push({
      sourceCollection: collection,
      property,
      targetCollection,
      type,
      relationLabel,
    });
  }

  return rules;
}

function normalizeGenerateUsagePages({ collection, frontmatter, warnings }) {
  const value = frontmatter.generate_usage_pages;
  if (value == null) return false;
  if (typeof value === "boolean") return value;

  warnings.push(
    `Ignored invalid generate_usage_pages config on ${collection}/index.md: expected a boolean`,
  );
  return false;
}

function normalizeDisplayTitle({ collection, frontmatter, warnings }) {
  const value = frontmatter.display_title;
  if (value == null) return null;
  if (typeof value === "string" && value.trim()) return value.trim();

  warnings.push(
    `Ignored invalid display_title config on ${collection}/index.md: expected a non-empty string`,
  );
  return null;
}

function normalizeUsageContextCollection({ collection, frontmatter, warnings }) {
  const value = frontmatter.usage_context_collection;
  if (value == null) return null;
  if (typeof value === "string" && value.trim()) return value.trim();

  warnings.push(
    `Ignored invalid usage_context_collection config on ${collection}/index.md: expected a non-empty string`,
  );
  return null;
}

function normalizeCollectionConfig({ collection, frontmatter, warnings }) {
  const normalizedFrontmatter = isPlainObject(frontmatter) ? frontmatter : {};

  return {
    frontmatter: normalizedFrontmatter,
    displayTitle: normalizeDisplayTitle({
      collection,
      frontmatter: normalizedFrontmatter,
      warnings,
    }),
    propertyIndexes: normalizeStringList(normalizedFrontmatter.property_indexes),
    relationshipRules: normalizeRelationshipRules({
      collection,
      frontmatter: normalizedFrontmatter,
      warnings,
    }),
    generateUsagePages: normalizeGenerateUsagePages({
      collection,
      frontmatter: normalizedFrontmatter,
      warnings,
    }),
    usageContextCollection: normalizeUsageContextCollection({
      collection,
      frontmatter: normalizedFrontmatter,
      warnings,
    }),
  };
}

function resolveUsageContextKey({
  record,
  sourceKey,
  recordsByKey,
  collectionConfig,
}) {
  const contextCollection = collectionConfig.usageContextCollection;
  if (!contextCollection) return sourceKey;

  const contextKey = keyFor(contextCollection, record.slug);
  return recordsByKey.has(contextKey) ? contextKey : sourceKey;
}

function formatDisplayTitleValue(value) {
  if (Array.isArray(value)) {
    return collapseWhitespace(value.join(", "));
  }

  if (isPlainObject(value)) {
    return collapseWhitespace(JSON.stringify(value));
  }

  return collapseWhitespace(value);
}

function applyDisplayTitleFormatter(value, formatter) {
  if (!formatter) return formatDisplayTitleValue(value);

  const [name, argument] = formatter.split(":");
  if (name === "pad") {
    const width = Number.parseInt(argument, 10);
    if (Number.isInteger(width) && width > 0) {
      return String(value).padStart(width, "0");
    }
  }

  return formatDisplayTitleValue(value);
}

function renderDisplayTitleTemplate(template, metadata) {
  let usedPlaceholder = false;
  const rendered = template.replace(
    /\$\{([a-zA-Z0-9_]+)(?:\|([^}]+))?\}|\$([a-zA-Z0-9_]+)/g,
    (_, bracketedKey, formatter, plainKey) => {
      usedPlaceholder = true;
      const key = bracketedKey || plainKey;
      const value = metadata[key];
      if (value == null) return "";
      return applyDisplayTitleFormatter(value, formatter);
    },
  );

  if (!usedPlaceholder) return "";
  return collapseWhitespace(rendered);
}

function getRecordDisplayTitle(record) {
  const configuredTitle = record.collectionConfig?.displayTitle;
  if (configuredTitle) {
    if (configuredTitle.includes("$")) {
      const renderedTitle = renderDisplayTitleTemplate(
        configuredTitle,
        record.metadata,
      );
      if (renderedTitle) return renderedTitle;
    } else {
      const configuredValue = record.metadata[configuredTitle];
      if (configuredValue != null) {
        const normalizedValue = formatDisplayTitleValue(configuredValue);
        if (normalizedValue) return normalizedValue;
      }
    }
  }

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

async function assertTargetDirectory() {
  try {
    const stat = await fs.stat(targetDirectory);
    if (!stat.isDirectory()) {
      throw new Error(`${targetDirectory} is not a directory`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Target directory not found: ${targetDirectory}`);
    }
    throw error;
  }
}

async function discoverSourceCollections() {
  const entries = await fs.readdir(referencesRoot, { withFileTypes: true });
  const collections = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const collection = entry.name;
    const collectionDir = path.join(referencesRoot, collection);
    const indexFilePath = path.join(collectionDir, generationRules.folderIndexName);
    let indexFrontmatter = {};
    let hasIndexFile = false;
    try {
      await fs.access(indexFilePath);
      hasIndexFile = true;
      const parsedIndex = await parseMarkdownFile(indexFilePath);
      indexFrontmatter = parsedIndex.frontmatter || {};
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
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

    collections.push({
      collection,
      collectionDir,
      files,
      indexFilePath,
      indexFrontmatter,
      hasIndexFile,
    });
  }

  collections.sort((a, b) => compareStrings(a.collection, b.collection));
  return collections;
}

async function loadGraph() {
  const discoveredCollections = await discoverSourceCollections();
  const records = [];
  const recordsByKey = new Map();
  const warnings = [];
  const collectionConfigs = new Map();
  const relationshipRules = [];

  for (const { collection, indexFrontmatter, hasIndexFile } of discoveredCollections) {
    const config = hasIndexFile
      ? normalizeCollectionConfig({
          collection,
          frontmatter: indexFrontmatter,
          warnings,
        })
      : emptyCollectionConfig();
    collectionConfigs.set(collection, config);
    relationshipRules.push(...config.relationshipRules);
  }

  for (const { collection, files } of discoveredCollections) {
    for (const filePath of files) {
      const slug = path.basename(filePath, ".md");
      const parsed = await parseMarkdownFile(filePath);
      const metadata = parsed.frontmatter || {};
      const collectionConfig =
        collectionConfigs.get(collection) || emptyCollectionConfig();

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
        collectionConfig,
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
    for (const rule of relationshipRules) {
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
        contextKey: resolveUsageContextKey({
          record,
          sourceKey,
          recordsByKey,
            collectionConfig: record.collectionConfig,
        }),
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
    collections: discoveredCollections,
    collectionConfigs,
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

function buildPropertyBuckets(records, collectionConfigs) {
  const bucketMap = new Map();

  for (const record of records) {
    const propertyIndexes =
      collectionConfigs.get(record.collection)?.propertyIndexes || [];
    if (propertyIndexes.length === 0) continue;

    for (const property of propertyIndexes) {
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

  return [...bucketMap.values()].sort((a, b) => {
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
  const propertyBuckets = buildPropertyBuckets(graph.records, graph.collectionConfigs);
  const propertyBucketsByCollection = new Map();
  for (const bucket of propertyBuckets) {
    const collectionBucket = propertyBucketsByCollection.get(bucket.collection) || [];
    collectionBucket.push(bucket);
    propertyBucketsByCollection.set(bucket.collection, collectionBucket);
  }

  const outputs = new Map();

  for (const { collection, collectionDir, hasIndexFile } of graph.collections) {
    if (!hasIndexFile) continue;
    const records = collectionRecords.get(collection) || [];
    const propertyNamespaces = propertyBucketsByCollection.get(collection) || [];
    const collectionConfig =
      graph.collectionConfigs.get(collection) || emptyCollectionConfig();
    const outputPath = path.join(collectionDir, generationRules.folderIndexName);
    outputs.set(
      outputPath,
      renderCollectionHub({
        collection,
        records,
        propertyNamespaces,
        frontmatter: collectionConfig.frontmatter,
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
    const collectionConfig =
      graph.collectionConfigs.get(record.collection) || emptyCollectionConfig();
    if (!collectionConfig.generateUsagePages || inboundEdges.length === 0) {
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
        collectionConfig,
        recordsByKey: graph.recordsByKey,
        outputPath,
      }),
    );
  }

  return outputs;
}

function renderCollectionHub({
  collection,
  records,
  propertyNamespaces,
  frontmatter,
  outputPath,
}) {
  const lines = [
    `# ${toDisplayCollectionName(collection)}`,
    "",
    `This collection contains ${formatCount(records.length, "reference")} in \`${collection}/\`.`,
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

  return `${formatFrontmatter(frontmatter)}${lines.join("\n").trim()}\n`;
}

function renderPropertyNamespaceIndex({ bucket, outputPath }) {
  const valueBuckets = [...bucket.values.values()].sort((a, b) =>
    compareStrings(a.valueLabel, b.valueLabel),
  );

  const lines = [
    `# ${toDisplayCollectionName(bucket.collection)} by ${bucket.property}`,
    "",
    `This index groups \`${bucket.collection}\` references by \`${bucket.property}\` across ${formatCount(
      valueBuckets.length,
      "value",
    )}.`,
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
    `This page lists ${formatCount(valueBucket.records.length, "entry", "entries")} with \`${bucket.property}: ${valueBucket.valueLabel}\`.`,
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

function renderEntityUsagePage({
  record,
  inboundEdges,
  collectionConfig,
  recordsByKey,
  outputPath,
}) {
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
    `This page shows where [${getRecordDisplayTitle(record)}](${relativeLink(
      outputPath,
      record.filePath,
    )}) appears.`,
    "",
  ];

  const relatedPropertyLinks = [];
  if (collectionConfig.propertyIndexes.length > 0) {
    for (const property of collectionConfig.propertyIndexes) {
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
        stale.push(path.relative(targetDirectory, outputPath));
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        missing.push(path.relative(targetDirectory, outputPath));
      } else {
        throw error;
      }
    }
  }

  const existingGeneratedFiles = await listExistingGeneratedFiles();
  const planned = new Set(outputs.keys());
  for (const filePath of existingGeneratedFiles) {
    if (!planned.has(filePath)) {
      extra.push(path.relative(targetDirectory, filePath));
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
  await assertTargetDirectory();
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
    `Generated ${outputs.size} reference index file(s) under ${path.relative(
      process.cwd(),
      referencesRoot,
    ) || "."}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
