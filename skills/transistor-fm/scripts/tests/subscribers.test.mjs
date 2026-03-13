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

function createSubscriberPayload() {
  return {
    data: {
      id: "709423",
      type: "subscribers",
      attributes: {
        email: "arthur@example.com",
        subscribe_url: "https://subscribe.transistor.fm/b390b1089a13f0",
      },
    },
  };
}

function createSubscriberListPayload() {
  return {
    data: [
      {
        id: "709423",
        type: "subscribers",
        attributes: {
          email: "arthur@example.com",
        },
      },
      {
        id: "709424",
        type: "subscribers",
        attributes: {
          email: "beatrice@example.com",
        },
      },
    ],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 2,
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

test("subscribers help lists actions without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["subscribers", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs subscribers \[action\] \[flags\]/u);
  assert.match(
    stdout,
    /create-batch\s*\n\s*Add a batch of multiple subscribers to a private podcast, and send them optional instructional emails\./u
  );
  assert.match(
    stdout,
    /delete\s*\n\s*Remove a single private podcast subscriber and revoke their access to the podcast\./u
  );
  assert.doesNotMatch(stdout, /--id <subscriber-id>/u);
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.doesNotMatch(stdout, /Selector flags:/u);
  assert.doesNotMatch(stdout, /Writable fields:/u);
  assert.doesNotMatch(stdout, /Read-only fields:/u);
  assert.doesNotMatch(stdout, /Examples:/u);
  assert.equal(stderr, "");
});

test("subscribers create-batch --help documents batch normalization and default welcome email behavior", async () => {
  const io = createIo();
  const exitCode = await runCli(["subscribers", "create-batch", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /--email <value>/u);
  assert.match(stdout, /--emails <value1,value2>/u);
  assert.match(stdout, /emails\[\]/u);
  assert.match(stdout, /Default: false\. Do not send the instructional welcome email/u);
  assert.equal(stderr, "");
});

test("subscribers get --help includes documented read-only subscriber fields", async () => {
  const io = createIo();
  const exitCode = await runCli(["subscribers", "get", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs subscribers get \[flags\]/u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /created_at - Timestamp of creation/u);
  assert.match(stdout, /has_downloads - Subscriber has downloaded at least one episode/u);
  assert.match(stdout, /updated_at - Timestamp of last update/u);
  assert.equal(stderr, "");
});

test("subscribers list requires --show-id and forwards filters", async () => {
  const io = createIo();
  const payload = createSubscriberListPayload();
  const requests = [];

  const exitCode = await runCli(
    [
      "subscribers",
      "list",
      "--show-id",
      "132543",
      "--query",
      "example.com",
      "--page",
      "1",
      "--per=5",
    ],
    io,
    createOptions({
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
    })
  );

  const { stdout, stderr } = io.output();
  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "GET",
      path: "subscribers",
      query: {
        show_id: "132543",
        query: "example.com",
        "pagination[page]": "1",
        "pagination[per]": "5",
      },
    },
  ]);
  assert.match(stdout, /^Page 1 of 1 \(2 total\)$/mu);
  assert.match(stdout, /^- 709423  arthur@example\.com$/mu);
  assert.equal(stderr, "");
});

test("subscribers get renders one resource", async () => {
  const io = createIo();
  const payload = createSubscriberPayload();
  const requests = [];

  const exitCode = await runCli(
    ["subscribers", "get", "--id", "709423"],
    io,
    createOptions({
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
    })
  );

  const { stdout, stderr } = io.output();
  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [{ method: "GET", path: "subscribers/709423" }]);
  assert.match(stdout, /^id: 709423$/mu);
  assert.match(stdout, /^email: arthur@example\.com$/mu);
  assert.match(stdout, /^subscribe_url: https:\/\/subscribe\.transistor\.fm\/b390b1089a13f0$/mu);
  assert.equal(stderr, "");
});

test("subscribers create requires --email before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["subscribers", "create", "--show-id", "132543"],
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
    /Missing required `--email <value>`\.[\s\S]*subscribers create --help/u
  );

  assert.equal(requestCalls, 0);
});

test("subscribers create sends the flat body and honors --skip-welcome-email", async () => {
  const io = createIo();
  const payload = createSubscriberPayload();
  const requests = [];

  const exitCode = await runCli(
    [
      "subscribers",
      "create",
      "--show-id",
      "132543",
      "--email",
      "carol@example.com",
      "--skip-welcome-email",
    ],
    io,
    createOptions({
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
    })
  );

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "POST",
      path: "subscribers",
      body: {
        show_id: "132543",
        email: "carol@example.com",
        skip_welcome_email: true,
      },
    },
  ]);
});

test("subscribers create-batch normalizes repeated and comma-separated email input", async () => {
  const io = createIo();
  const payload = createSubscriberListPayload();
  const requests = [];

  const exitCode = await runCli(
    [
      "subscribers",
      "create-batch",
      "--show-id",
      "132543",
      "--email",
      "carol@example.com",
      "--email",
      "derek@example.com",
      "--emails",
      "ellen@example.com, frank@example.com ",
    ],
    io,
    createOptions({
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
    })
  );

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "POST",
      path: "subscribers/batch",
      body: {
        show_id: "132543",
        emails: [
          "carol@example.com",
          "derek@example.com",
          "ellen@example.com",
          "frank@example.com",
        ],
        skip_welcome_email: false,
      },
    },
  ]);
});

test("subscribers update sends a nested subscriber payload", async () => {
  const io = createIo();
  const payload = createSubscriberPayload();
  const requests = [];

  const exitCode = await runCli(
    ["subscribers", "update", "--id", "709423", "--email", "updated@example.com"],
    io,
    createOptions({
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
    })
  );

  assert.equal(exitCode, 0);
  assert.deepEqual(requests, [
    {
      method: "PATCH",
      path: "subscribers/709423",
      body: {
        subscriber: {
          email: "updated@example.com",
        },
      },
    },
  ]);
});

test("subscribers delete routes to the correct endpoint for either selector mode", async () => {
  const cases = [
    {
      argv: ["subscribers", "delete", "--show-id", "132543", "--email", "carol@example.com"],
      request: {
        method: "DELETE",
        path: "subscribers",
        body: {
          show_id: "132543",
          email: "carol@example.com",
        },
      },
    },
    {
      argv: ["subscribers", "delete", "--id", "709423"],
      request: {
        method: "DELETE",
        path: "subscribers/709423",
      },
    },
  ];

  for (const testCase of cases) {
    const io = createIo();
    const payload = createSubscriberPayload();
    const requests = [];

    const exitCode = await runCli(
      testCase.argv,
      io,
      createOptions({
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
      })
    );

    assert.equal(exitCode, 0);
    assert.deepEqual(requests, [testCase.request]);
  }
});

test("subscribers delete dry-run skips the destructive request", async () => {
  const io = createIo();
  let requestCalls = 0;

  const exitCode = await runCli(
    ["subscribers", "delete", "--show-id", "132543", "--email", "carol@example.com", "--dry-run"],
    io,
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

  const { stdout, stderr } = io.output();
  assert.equal(exitCode, 0);
  assert.equal(requestCalls, 0);
  assert.match(stdout, /^Dry run only\. No subscriber access was changed\.$/mu);
  assert.match(stdout, /^Planned request: DELETE \/v1\/subscribers$/mu);
  assert.match(stdout, /"show_id":"132543"/u);
  assert.match(stdout, /"email":"carol@example\.com"/u);
  assert.equal(stderr, "");
});

test("subscribers delete dry-run supports ID-based deletion", async () => {
  const io = createIo();
  let requestCalls = 0;

  const exitCode = await runCli(
    ["subscribers", "delete", "--id", "709423", "--dry-run"],
    io,
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

  const { stdout, stderr } = io.output();
  assert.equal(exitCode, 0);
  assert.equal(requestCalls, 0);
  assert.match(stdout, /^Planned request: DELETE \/v1\/subscribers\/709423$/mu);
  assert.equal(stderr, "");
});

test("subscribers delete rejects mixed selector modes before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        [
          "subscribers",
          "delete",
          "--id",
          "709423",
          "--show-id",
          "132543",
          "--email",
          "carol@example.com",
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
    /Use either `--id <subscriber-id>` or `--show-id <id-or-slug>` with `--email <value>`, not both\.[\s\S]*subscribers delete --help/u
  );

  assert.equal(requestCalls, 0);
});

test("subscribers update surfaces mocked API failures", async () => {
  await assert.rejects(
    () =>
      runCli(
        ["subscribers", "update", "--id", "709423", "--email", "updated@example.com"],
        createIo(),
        createOptions({
          loadConfigImpl: async () => ({
            apiKey: "test-key",
            apiBaseUrl: "https://api.transistor.fm/v1",
          }),
          createHttpClientImpl() {
            return {
              async request() {
                throw new Error("Subscriber API exploded.");
              },
            };
          },
        })
      ),
    /Subscriber API exploded\.[\s\S]*subscribers update --help/u
  );
});
