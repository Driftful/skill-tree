import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

import { runCli } from "../lib/cli.mjs";
import { createDefaultSchemaBundle } from "../lib/schema-cache.mjs";
import { WEBHOOK_EVENT_NAMES } from "../lib/constants/webhooks.mjs";

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

async function loadFixture(name) {
  const fileUrl = new URL(`./fixtures/webhooks/${name}`, import.meta.url);
  const content = await fs.readFile(fileUrl, "utf8");
  return JSON.parse(content);
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

function createApiOptions(requests, payload) {
  return createOptions({
    loadConfigImpl: async () => ({
      apiKey: "test-key",
      apiBaseUrl: "https://api.transistor.fm/v1",
    }),
    createHttpClientImpl() {
      return {
        async request(request) {
          requests.push(request);
          return payload;
        },
      };
    },
  });
}

test("webhooks help lists actions without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["webhooks", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs webhooks \[action\] \[flags\]/u);
  assert.match(stdout, /create\s*\n\s*Subscribe to a webhook with the given event name and show\./u);
  assert.match(stdout, /delete\s*\n\s*Unsubscribe from a webhook\./u);
  assert.doesNotMatch(stdout, /--id <webhook-id>/u);
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.doesNotMatch(stdout, /Selector flags:/u);
  assert.doesNotMatch(stdout, /Writable fields:/u);
  assert.doesNotMatch(stdout, /Examples:/u);
  assert.doesNotMatch(stdout, /Fetch one webhook/u);
  assert.equal(stderr, "");
});

test("webhooks create --help includes required flags and event-name guidance", async () => {
  const io = createIo();
  const exitCode = await runCli(["webhooks", "create", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /--show-id <id-or-slug>/u);
  assert.match(stdout, /--event-name <event-name>/u);
  assert.match(stdout, /--url <value>/u);
  assert.match(stdout, /maximum of 50 webhooks per user account/u);
  assert.match(stdout, /no separate get-one-webhook endpoint/u);
  for (const eventName of WEBHOOK_EVENT_NAMES) {
    assert.match(stdout, new RegExp(eventName, "u"));
  }
  assert.equal(stderr, "");
});

test("webhooks delete --help stays aligned with the documented list create delete surface", async () => {
  const io = createIo();
  const exitCode = await runCli(["webhooks", "delete", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs webhooks delete \[flags\]/u);
  assert.match(stdout, /--id <webhook-id>/u);
  assert.match(stdout, /no separate get-one-webhook endpoint/u);
  assert.doesNotMatch(stdout, /Fetch one webhook/u);
  assert.equal(stderr, "");
});

test("webhooks list requires --show-id and routes to GET /v1/webhooks", async () => {
  let requestCalls = 0;
  const emptyIo = createIo();
  const emptyExitCode = await runCli(
    ["webhooks", "list"],
    emptyIo,
    createOptions({
      loadConfigImpl: async () => ({
        apiKey: "test-key",
        apiBaseUrl: "https://api.transistor.fm/v1",
      }),
      createHttpClientImpl() {
        return {
          async request() {
            requestCalls += 1;
            return {};
          },
        };
      },
    })
  );

  const emptyOutput = emptyIo.output();
  assert.equal(emptyExitCode, 0);
  assert.equal(requestCalls, 0);
  assert.match(emptyOutput.stdout, /node scripts\/transistor-fm\.mjs webhooks list \[flags\]/u);
  assert.match(emptyOutput.stdout, /Retrieve a list of webhooks for a show/u);
  assert.match(emptyOutput.stdout, /--show-id <id-or-slug>/u);
  assert.equal(emptyOutput.stderr, "");

  const io = createIo();
  const payload = await loadFixture("list.json");
  const requests = [];
  const exitCode = await runCli(
    ["webhooks", "list", "--show-id", "132543"],
    io,
    createApiOptions(requests, payload)
  );
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "GET",
      path: "webhooks",
      query: {
        show_id: "132543",
      },
    },
  ]);
  assert.match(stdout, /^Page 1 of 1 \(2 total\)$/mu);
  assert.match(stdout, /^- 88001  episode_created -> https:\/\/example\.com\/hooks\/episodes-created$/mu);
  assert.match(stdout, /^- 88002  subscriber_deleted -> https:\/\/example\.com\/hooks\/subscribers-deleted$/mu);
  assert.equal(stderr, "");
});

test("webhooks create rejects unsupported event names before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        [
          "webhooks",
          "create",
          "--show-id",
          "132543",
          "--event-name",
          "totally_invalid",
          "--url",
          "https://example.com/hooks/invalid",
        ],
        createIo(),
        createOptions({
          loadConfigImpl: async () => ({
            apiKey: "test-key",
            apiBaseUrl: "https://api.transistor.fm/v1",
          }),
          createHttpClientImpl() {
            return {
              async request() {
                requestCalls += 1;
                return {};
              },
            };
          },
        })
      ),
    /`--event-name <event-name>` must be one of `episode_created`, `episode_published`, `subscriber_created`, `subscriber_deleted`\.[\s\S]*webhooks create --help/u
  );

  assert.equal(requestCalls, 0);
});

test("webhooks create sends the documented body", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];
  const exitCode = await runCli(
    [
      "webhooks",
      "create",
      "--show-id",
      "132543",
      "--event-name",
      "episode_published",
      "--url",
      "https://example.com/hooks/published",
    ],
    io,
    createApiOptions(requests, payload)
  );
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "POST",
      path: "webhooks",
      body: {
        show_id: "132543",
        event_name: "episode_published",
        url: "https://example.com/hooks/published",
      },
    },
  ]);
  assert.match(stdout, /^id: 88002$/mu);
  assert.match(stdout, /^event_name: episode_published$/mu);
  assert.equal(stderr, "");
});

test("webhooks delete routes to DELETE /v1/webhooks/:id", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];
  const exitCode = await runCli(
    ["webhooks", "delete", "--id", "88002"],
    io,
    createApiOptions(requests, payload)
  );
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "DELETE",
      path: "webhooks/88002",
    },
  ]);
  assert.match(stdout, /^id: 88002$/mu);
  assert.match(stdout, /^url: https:\/\/example\.com\/hooks\/published$/mu);
  assert.equal(stderr, "");
});

test("webhooks delete surfaces mocked API failures", async () => {
  await assert.rejects(
    () =>
      runCli(
        ["webhooks", "delete", "--id", "88002"],
        createIo(),
        createOptions({
          loadConfigImpl: async () => ({
            apiKey: "test-key",
            apiBaseUrl: "https://api.transistor.fm/v1",
          }),
          createHttpClientImpl() {
            return {
              async request() {
                throw new Error("Webhook API exploded.");
              },
            };
          },
        })
      ),
    /Webhook API exploded\.[\s\S]*webhooks delete --help/u
  );
});
