import test from "node:test";
import assert from "node:assert/strict";

import { runCli } from "../lib/cli.mjs";
import { createDefaultSchemaBundle } from "../lib/schema-cache.mjs";

function createIo() {
  const stdout = [];
  const stderr = [];

  return {
    stdout: {
      write(value) {
        stdout.push(String(value));
      },
    },
    stderr: {
      write(value) {
        stderr.push(String(value));
      },
    },
    output() {
      return {
        stdout: stdout.join(""),
        stderr: stderr.join(""),
      };
    },
  };
}

function createOptions(overrides = {}) {
  return {
    loadSchemaBundleImpl: async () => ({
      bundle: createDefaultSchemaBundle("2026-03-11T00:00:00.000Z"),
      warnings: [],
    }),
    ...overrides,
  };
}

test("user help renders read-only guidance", async () => {
  const io = createIo();
  const exitCode = await runCli(["user", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /Inspect the authenticated Transistor user/u);
  assert.match(stdout, /Actions:/u);
  assert.match(
    stdout,
    /get\s*\n\s*Retrieve details of the user account that is authenticating to the API\./u
  );
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Examples:/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.equal(stderr, "");
});

test("user get --help renders action-scoped help", async () => {
  const io = createIo();
  const exitCode = await runCli(["user", "get", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs user get \[flags\]/u);
  assert.match(stdout, /Retrieve details of the user account that is authenticating to the API\./u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /name - Full name/u);
  assert.match(stdout, /time_zone - Current time zone/u);
  assert.match(stdout, /updated_at - Timestamp of last update/u);
  assert.doesNotMatch(stdout, /^Actions:/mu);
  assert.equal(stderr, "");
});

test("user get renders the authenticated user resource", async () => {
  const io = createIo();
  const payload = {
    data: {
      id: "user-123",
      type: "users",
      attributes: {
        name: "Example FM",
        time_zone: "America/Chicago",
      },
    },
  };
  let getAuthenticatedUserCalls = 0;

  const exitCode = await runCli(
    ["user", "get"],
    io,
    createOptions({
      loadConfigImpl: async () => ({
        apiKey: "test-key",
        apiBaseUrl: "https://api.transistor.fm/v1",
      }),
      createHttpClientImpl() {
        return {
          async getAuthenticatedUser() {
            getAuthenticatedUserCalls += 1;
            return payload;
          },
        };
      },
    })
  );

  const { stdout, stderr } = io.output();
  assert.equal(exitCode, 0);
  assert.equal(getAuthenticatedUserCalls, 1);
  assert.match(stdout, /^id: user-123/mu);
  assert.match(stdout, /^type: users/mu);
  assert.match(stdout, /^name: Example FM/mu);
  assert.match(stdout, /^time_zone: America\/Chicago/mu);
  assert.equal(stderr, "");
});

test("missing credentials fail before any network request", async () => {
  let createHttpClientCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["user", "get"],
        createIo(),
        createOptions({
          loadConfigImpl: async () => {
            throw new Error("Missing TRANSISTOR_API_KEY.");
          },
          createHttpClientImpl() {
            createHttpClientCalls += 1;
            return {};
          },
        })
      ),
    /Missing TRANSISTOR_API_KEY\./u
  );

  assert.equal(createHttpClientCalls, 0);
});

test("unknown user actions still return guided help", async () => {
  const io = createIo();
  const exitCode = await runCli(["user", "bogus"], io, createOptions());
  const { stderr } = io.output();

  assert.equal(exitCode, 1);
  assert.match(stderr, /Unknown action "bogus" for resource "user"/u);
  assert.match(stderr, /Actions:/u);
  assert.doesNotMatch(stderr, /Notes:/u);
});

test("user get surfaces mocked API failures", async () => {
  await assert.rejects(
    () =>
      runCli(
        ["user", "get"],
        createIo(),
        createOptions({
          loadConfigImpl: async () => ({
            apiKey: "test-key",
            apiBaseUrl: "https://api.transistor.fm/v1",
          }),
          createHttpClientImpl() {
            return {
              async getAuthenticatedUser() {
                throw new Error("Transistor API rate limit exceeded.");
              },
            };
          },
        })
      ),
    /Transistor API rate limit exceeded\.[\s\S]*user get --help/u
  );
});
