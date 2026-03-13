import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseArgv } from "../lib/cli.mjs";
import {
  DEFAULT_ENV_FILE_PATH,
  EXAMPLE_ENV_FILE_PATH,
} from "../lib/config.mjs";
import { registerEpisodesNoun } from "../lib/nouns/episodes.mjs";
import { registerShowsNoun } from "../lib/nouns/shows.mjs";
import { registerSubscribersNoun } from "../lib/nouns/subscribers.mjs";
import { registerUserNoun } from "../lib/nouns/user.mjs";
import { registerWebhooksNoun } from "../lib/nouns/webhooks.mjs";
import { createRegistry } from "../lib/registry.mjs";
import { createDefaultSchemaBundle } from "../lib/schema-cache.mjs";

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const skillFilePath = path.join(skillDir, "SKILL.md");
const setupFilePath = path.join(skillDir, "references/setup.md");
const commandModelFilePath = path.join(skillDir, "references/command-model.md");
const workflowsFilePath = path.join(skillDir, "references/workflows.md");
const safetyFilePath = path.join(skillDir, "references/safety.md");

function buildRegistry() {
  const registry = createRegistry({
    schemaBundle: createDefaultSchemaBundle("2026-03-11T00:00:00.000Z"),
  });

  for (const registrar of [
    registerUserNoun,
    registerShowsNoun,
    registerEpisodesNoun,
    registerSubscribersNoun,
    registerWebhooksNoun,
  ]) {
    registrar(registry);
  }

  return registry;
}

function extractCommands(content) {
  return [...new Set(content.match(/node scripts\/transistor-fm\.mjs [^\n`]+/gu) || [])];
}

function splitCommand(command) {
  return (command.match(/"[^"]*"|'[^']*'|\S+/gu) || []).map((token) =>
    token.replace(/^['"]|['"]$/gu, "")
  );
}

async function readDocs() {
  const [skillDoc, setupDoc, commandModelDoc, workflowsDoc, safetyDoc] =
    await Promise.all([
      fs.readFile(skillFilePath, "utf8"),
      fs.readFile(setupFilePath, "utf8"),
      fs.readFile(commandModelFilePath, "utf8"),
      fs.readFile(workflowsFilePath, "utf8"),
      fs.readFile(safetyFilePath, "utf8"),
    ]);

  return {
    skillDoc,
    setupDoc,
    commandModelDoc,
    workflowsDoc,
    safetyDoc,
  };
}

test("documented resources exist in the runtime registry", async () => {
  const { skillDoc, commandModelDoc } = await readDocs();
  const registry = buildRegistry();
  const expectedNouns = [
    "user",
    "shows",
    "episodes",
    "subscribers",
    "webhooks",
  ];

  for (const nounName of expectedNouns) {
    assert.match(skillDoc + commandModelDoc, new RegExp("`" + nounName + "`", "u"));
    assert.equal(registry.hasNoun(nounName), true, `${nounName} should exist in the registry`);
  }
});

test("documented Transistor CLI examples parse to known nouns and actions", async () => {
  const { skillDoc, setupDoc, commandModelDoc, workflowsDoc, safetyDoc } = await readDocs();
  const registry = buildRegistry();
  const docs = [skillDoc, setupDoc, commandModelDoc, workflowsDoc, safetyDoc].join("\n");
  const commands = extractCommands(docs);

  assert.ok(commands.length > 0, "expected skill docs to contain Transistor CLI commands");

  for (const command of commands) {
    if (command.includes("<") || command.includes("[")) {
      continue;
    }

    const tokens = splitCommand(command);
    assert.deepEqual(tokens.slice(0, 2), ["node", "scripts/transistor-fm.mjs"]);

    const { positionals } = parseArgv(tokens.slice(2));
    assert.ok(positionals.length > 0, `expected positionals in ${command}`);

    if (positionals[0] === "help") {
      continue;
    }

    const noun = registry.getNoun(positionals[0]);
    assert.ok(noun, `unknown noun in docs: ${command}`);

    if (positionals[1] && positionals[1] !== "help") {
      assert.ok(noun.actions[positionals[1]], `unknown action in docs: ${command}`);
    }
  }
});

test("setup docs reference the actual env paths", async () => {
  const { setupDoc } = await readDocs();
  const envPath = path.relative(skillDir, DEFAULT_ENV_FILE_PATH);
  const exampleEnvPath = path.relative(skillDir, EXAMPLE_ENV_FILE_PATH);

  assert.match(setupDoc, new RegExp(envPath.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  assert.match(setupDoc, new RegExp(exampleEnvPath.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  assert.match(setupDoc, /TRANSISTOR_API_KEY/u);
});
