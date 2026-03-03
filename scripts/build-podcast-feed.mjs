#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const episodesDir = path.resolve("skills/skill-tree-podcast/assets/data/episodes");
const outputDir = path.resolve("skills/skill-tree-podcast/site");
const outputFile = path.join(outputDir, "feed.xml");

const FEED = {
  title: "Skill Tree Podcast",
  description:
    "A podcast exploring documentation, tools, and context for agentic workflows.",
  link: "https://github.com/Driftful/skill-tree/tree/main/skills/skill-tree-podcast",
  language: "en-us",
  image:
    "https://raw.githubusercontent.com/Driftful/skill-tree/main/skills/skill-tree-podcast/assets/podcast-cover.jpg",
};

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function parseFrontmatter(content, filePath) {
  if (!content.startsWith("---\n")) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`);
  }

  const endIndex = content.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    throw new Error(`Unclosed YAML frontmatter in ${filePath}`);
  }

  const frontmatter = content.slice(4, endIndex).trim();
  const body = content.slice(endIndex + 5).trim();
  const data = {};

  for (const rawLine of frontmatter.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  data.description = data.description || body;
  return data;
}

function requiredFields(data, filePath) {
  const required = ["title", "description", "date", "audio_url"];
  const missing = required.filter((key) => !data[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter in ${filePath}: ${missing.join(", ")}`
    );
  }
}

function toPubDate(dateString, filePath) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${dateString}" in ${filePath}`);
  }
  return date.toUTCString();
}

async function loadEpisodes() {
  const entries = await fs.readdir(episodesDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(episodesDir, entry.name));

  if (files.length === 0) {
    return [];
  }

  const episodes = [];
  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf8");
    const data = parseFrontmatter(content, filePath);
    requiredFields(data, filePath);
    const parsedDate = new Date(data.date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date "${data.date}" in ${filePath}`);
    }
    episodes.push({ ...data, filePath, parsedDate });
  }

  episodes.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());
  return episodes;
}

function buildItem(episode) {
  const title = xmlEscape(episode.title);
  const description = xmlEscape(episode.description);
  const audioUrl = xmlEscape(episode.audio_url);
  const guid = xmlEscape(episode.guid || episode.audio_url);
  const pubDate = xmlEscape(toPubDate(episode.date, episode.filePath));
  const episodeNumber = episode.episode ? `<itunes:episode>${xmlEscape(episode.episode)}</itunes:episode>` : "";
  const author = episode.author ? `<itunes:author>${xmlEscape(episode.author)}</itunes:author>` : "";
  const duration = episode.duration ? `<itunes:duration>${xmlEscape(episode.duration)}</itunes:duration>` : "";
  const explicit = `<itunes:explicit>${xmlEscape(episode.explicit || "false")}</itunes:explicit>`;
  const image = episode.image
    ? `<itunes:image href="${xmlEscape(episode.image)}" />`
    : "";

  return [
    "    <item>",
    `      <title>${title}</title>`,
    `      <description>${description}</description>`,
    `      <enclosure url="${audioUrl}" type="audio/mpeg" />`,
    `      <guid isPermaLink="false">${guid}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    `      ${explicit}`,
    episodeNumber ? `      ${episodeNumber}` : "",
    author ? `      ${author}` : "",
    duration ? `      ${duration}` : "",
    image ? `      ${image}` : "",
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildRss(episodes) {
  const now = new Date().toUTCString();
  const itemsXml = episodes.map((episode) => buildItem(episode)).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">',
    "  <channel>",
    `    <title>${xmlEscape(FEED.title)}</title>`,
    `    <link>${xmlEscape(FEED.link)}</link>`,
    `    <description>${xmlEscape(FEED.description)}</description>`,
    `    <language>${xmlEscape(FEED.language)}</language>`,
    `    <lastBuildDate>${xmlEscape(now)}</lastBuildDate>`,
    `    <itunes:author>${xmlEscape("Driftful")}</itunes:author>`,
    `    <itunes:summary>${xmlEscape(FEED.description)}</itunes:summary>`,
    "    <itunes:explicit>false</itunes:explicit>",
    `    <itunes:image href="${xmlEscape(FEED.image)}" />`,
    itemsXml,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

async function main() {
  const episodes = await loadEpisodes();
  const xml = buildRss(episodes);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, xml, "utf8");
  process.stdout.write(
    `Generated ${outputFile} with ${episodes.length} episode(s)\n`
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
