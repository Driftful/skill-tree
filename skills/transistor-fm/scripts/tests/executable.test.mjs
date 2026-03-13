import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scriptPath = path.join(skillDir, "scripts", "transistor-fm.mjs");

async function withTempDir(run) {
  const rootTempDir = path.join(skillDir, ".scratch");
  await fs.mkdir(rootTempDir, { recursive: true });
  const tempDir = await fs.mkdtemp(path.join(rootTempDir, "transistor-executable-"));
  try {
    await run(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

test("mocked API failures print to stderr and exit non-zero at the wrapper boundary", async () => {
  await withTempDir(async (tempDir) => {
    const preloadPath = path.join(tempDir, "mock-fetch.mjs");
    await fs.writeFile(
      preloadPath,
      [
        "globalThis.fetch = async function mockFetch() {",
        "  return {",
        "    ok: false,",
        "    status: 429,",
        "    async text() {",
        '      return JSON.stringify({ errors: [{ detail: "Transistor API rate limit exceeded." }] });',
        "    },",
        "  };",
        "};",
        "",
      ].join("\n"),
      "utf8"
    );

    await assert.rejects(
      () =>
      execFile(process.execPath, [scriptPath, "user", "get"], {
          cwd: skillDir,
          env: {
            ...process.env,
            TRANSISTOR_API_KEY: "test-key",
            TRANSISTOR_API_BASE_URL: "https://api.transistor.fm/v1",
            NODE_OPTIONS: [process.env.NODE_OPTIONS, `--import=${preloadPath}`]
              .filter(Boolean)
              .join(" "),
          },
        }),
      (error) => {
        assert.equal(error.code, 1);
        assert.equal(error.stdout, "");
        assert.match(
          error.stderr,
          /^Transistor API rate limit exceeded\. Wait a few seconds and retry\.\nUse `node scripts\/transistor-fm\.mjs user get --help` to see documentation\.\n$/u
        );
        return true;
      }
    );
  });
});
