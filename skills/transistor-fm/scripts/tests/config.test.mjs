import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  loadConfig,
  parseEnvFile,
} from "../lib/config.mjs";

async function withTempDir(run) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "transistor-config-"));
  try {
    await run(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

test("parseEnvFile ignores comments and blank lines", () => {
  const values = parseEnvFile([
    "# comment",
    "",
    "TRANSISTOR_API_KEY=test-key",
  ].join("\n"));

  assert.deepEqual(values, {
    TRANSISTOR_API_KEY: "test-key",
  });
});

test("loadConfig reads API settings from the env file", async () => {
  await withTempDir(async (tempDir) => {
    const envFilePath = path.join(tempDir, ".env");
    await fs.writeFile(
      envFilePath,
      [
        "TRANSISTOR_API_KEY=test-key",
        "TRANSISTOR_API_BASE_URL=https://example.test/v1",
      ].join("\n"),
      "utf8"
    );

    const config = await loadConfig({
      env: {},
      envFilePath,
    });

    assert.equal(config.apiKey, "test-key");
    assert.equal(config.apiBaseUrl, "https://example.test/v1");
    assert.equal(config.envFilePath, envFilePath);
  });
});

test("process env overrides file values", async () => {
  await withTempDir(async (tempDir) => {
    const envFilePath = path.join(tempDir, ".env");
    await fs.writeFile(
      envFilePath,
      "TRANSISTOR_API_KEY=file-key\n",
      "utf8"
    );

    const config = await loadConfig({
      env: {
        TRANSISTOR_API_KEY: "override-key",
      },
      envFilePath,
    });

    assert.equal(config.apiKey, "override-key");
  });
});

test("malformed env lines are rejected", async () => {
  await withTempDir(async (tempDir) => {
    const envFilePath = path.join(tempDir, ".env");
    await fs.writeFile(envFilePath, "TRANSISTOR_API_KEY\n", "utf8");

    await assert.rejects(
      () =>
        loadConfig({
          env: {},
          envFilePath,
        }),
      /Malformed \.env line 1/u
    );
  });
});
