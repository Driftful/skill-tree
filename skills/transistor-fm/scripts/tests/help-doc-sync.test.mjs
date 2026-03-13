import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

import { parseArgv } from "../lib/cli.mjs";
import { registerEpisodesNoun } from "../lib/nouns/episodes.mjs";
import { registerShowsNoun } from "../lib/nouns/shows.mjs";
import { registerSubscribersNoun } from "../lib/nouns/subscribers.mjs";
import { registerUserNoun } from "../lib/nouns/user.mjs";
import { registerWebhooksNoun } from "../lib/nouns/webhooks.mjs";
import { createRegistry } from "../lib/registry.mjs";
import { createDefaultSchemaBundle } from "../lib/schema-cache.mjs";

const execFile = promisify(execFileCallback);
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scriptPath = path.join(skillDir, "scripts", "transistor-fm.mjs");
const skillFilePath = path.join(skillDir, "SKILL.md");
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

async function runCommand(args) {
  return execFile(process.execPath, [scriptPath, ...args], {
    cwd: skillDir,
  });
}

function actionFlagNames(action) {
  const entries = [
    ...(action.flags || []),
    ...(action.selectorFlags || []),
    ...(action.filterFlags || []),
    ...(action.writableFields || []),
  ];

  return new Set(
    entries.map((entry) =>
      String(typeof entry === "string" ? entry : entry.name || "")
        .replace(/^-+/u, "")
        .split(/\s+/u)[0]
    )
  );
}

test("global help lists the resources surfaced by the skill entrypoint", async () => {
  const skillDoc = await fs.readFile(skillFilePath, "utf8");
  const result = await runCommand(["help"]);
  const documentedNouns = [
    "user",
    "shows",
    "episodes",
    "subscribers",
    "webhooks",
  ];

  assert.match(skillDoc, /node scripts\/transistor-fm\.mjs help/u);
  for (const nounName of documentedNouns) {
    assert.match(result.stdout, new RegExp(`^\\s*${nounName}\\b`, "mu"));
  }
});

test("workflow examples map to real CLI actions", async () => {
  const workflowsDoc = await fs.readFile(workflowsFilePath, "utf8");
  const commands = extractCommands(workflowsDoc);
  const registry = buildRegistry();

  assert.ok(commands.length > 0, "expected workflow docs to contain Transistor CLI commands");

  for (const command of commands) {
    const tokens = splitCommand(command);
    assert.deepEqual(tokens.slice(0, 2), ["node", "scripts/transistor-fm.mjs"]);

    const args = tokens.slice(2);
    const { positionals, rawFlags } = parseArgv(args);
    if (positionals[0] === "help") {
      const result = await runCommand(args);
      assert.equal(result.stderr, "", `expected help stderr to stay empty for ${command}`);
      assert.match(result.stdout, /Usage:/u, `expected help usage for ${command}`);
      continue;
    }

    const noun = registry.getNoun(positionals[0]);
    assert.ok(noun, `expected known noun for ${command}`);
    const action = noun.actions[positionals[1]];
    assert.ok(action, `expected known action for ${command}`);

    const allowedFlags = actionFlagNames(action);
    for (const [flagName] of rawFlags) {
      assert.ok(allowedFlags.has(flagName), `unexpected flag --${flagName} in ${command}`);
    }

    const actionHelpArgs =
      args.length >= 2 ? [args[0], args[1], "--help"] : args;
    const result = await runCommand(actionHelpArgs);

    assert.equal(result.stderr, "", `expected help stderr to stay empty for ${command}`);
    assert.match(result.stdout, /Usage:/u, `expected help usage for ${command}`);
  }
});

test("safety docs cover destructive and operational caveats", async () => {
  const safetyDoc = await fs.readFile(safetyFilePath, "utf8");

  assert.match(safetyDoc, /subscribers delete --show-id/u);
  assert.match(safetyDoc, /subscribers delete --id/u);
  assert.match(safetyDoc, /--dry-run/u);
  assert.match(safetyDoc, /webhooks delete --id/u);
  assert.match(safetyDoc, /no separate get-one-webhook endpoint/u);
  assert.match(safetyDoc, /episodes upload/u);
});
