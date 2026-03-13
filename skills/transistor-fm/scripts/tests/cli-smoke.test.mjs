import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scriptPath = path.join(skillDir, "scripts", "transistor-fm.mjs");

test("help path works without any schema bootstrap", async () => {
  const result = await execFile(process.execPath, [scriptPath, "help"], {
    cwd: skillDir,
    env: process.env,
  });

  assert.match(result.stdout, /Resources:/u);
  assert.match(result.stdout, /episodes/u);
  assert.doesNotMatch(result.stdout, /Bootstrap mode:/u);
  assert.equal(result.stderr, "");
});

test("removed schema resource fails with guided help", async () => {
  await assert.rejects(
    () =>
      execFile(process.execPath, [scriptPath, "schema", "refresh"], {
        cwd: skillDir,
        env: process.env,
      }),
    /Unknown resource "schema"/u
  );
});
