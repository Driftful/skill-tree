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

test("shows help lists analytics without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["shows", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs shows \[action\] \[flags\]/u);
  assert.match(
    stdout,
    /analytics\s*\n\s*Retrieve analytics of downloads per day for an entire podcast\. Defaults to the last 14 days\./u
  );
  assert.doesNotMatch(stdout, /--id <id-or-slug>/u);
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.doesNotMatch(stdout, /Selector flags:/u);
  assert.equal(stderr, "");
});

test("episodes help lists analytics actions without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(
    stdout,
    /analytics\s*\n\s*Retrieve analytics of downloads per day for a single episode\. Defaults to the last 14 days\./u
  );
  assert.match(
    stdout,
    /analytics-all\s*\n\s*Retrieve analytics of downloads per day for all episodes of a podcast\. Defaults to the last 7 days\./u
  );
  assert.doesNotMatch(stdout, /--include <episode>/u);
  assert.equal(stderr, "");
});

test("shows analytics --help documents paired date flags and show includes", async () => {
  const io = createIo();
  const exitCode = await runCli(["shows", "analytics", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs shows analytics \[flags\]/u);
  assert.match(stdout, /--start-date <dd-mm-yyyy>/u);
  assert.match(stdout, /--end-date <dd-mm-yyyy>/u);
  assert.match(stdout, /--include <show>/u);
  assert.match(stdout, /must use the `dd-mm-yyyy` format documented by the API/u);
  assert.doesNotMatch(stdout, /fields\[show\]/u);
  assert.equal(stderr, "");
});

test("episodes analytics --help surfaces include support without dumping sparse field syntax", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "analytics", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes analytics \[flags\]/u);
  assert.match(stdout, /--include <episode>/u);
  assert.doesNotMatch(stdout, /fields\[episode\]/u);
  assert.equal(stderr, "");
});

test("episodes analytics-all --help documents paired date flags and show includes", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "analytics-all", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes analytics-all \[flags\]/u);
  assert.match(stdout, /--show-id <id-or-slug>/u);
  assert.match(stdout, /--start-date <dd-mm-yyyy>/u);
  assert.match(stdout, /--end-date <dd-mm-yyyy>/u);
  assert.match(stdout, /--include <show>/u);
  assert.match(stdout, /must use the `dd-mm-yyyy` format documented by the API/u);
  assert.equal(stderr, "");
});

test("shows analytics routes to the show endpoint and forwards paired date filters", async () => {
  const io = createIo();
  const payload = {
    data: {
      id: "132543",
      type: "show_analytics",
      attributes: {
        downloads: [
          { date: "01-03-2026", count: 10 },
          { date: "02-03-2026", count: 12 },
        ],
      },
    },
  };
  const requests = [];

  const exitCode = await runCli(
    [
      "shows",
      "analytics",
      "--id",
      "my-show-slug",
      "--start-date",
      "01-03-2026",
      "--end-date",
      "07-03-2026",
      "--include",
      "show",
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
      path: "analytics/my-show-slug",
      query: {
        start_date: "01-03-2026",
        end_date: "07-03-2026",
        "include[]": "show",
      },
    },
  ]);
  assert.match(stdout, /^type: show_analytics$/mu);
  assert.match(stdout, /^downloads: \[/mu);
  assert.equal(stderr, "");
});

test("episodes analytics-all routes to the all-episodes endpoint and renders a distinct summary", async () => {
  const io = createIo();
  const payload = {
    data: {
      id: "132543",
      type: "episodes_analytics",
      attributes: {
        episodes: [
          {
            id: "2",
            title: "Episode Two",
            downloads: [
              { date: "01-03-2026", count: 6 },
              { date: "02-03-2026", count: 5 },
            ],
          },
          {
            id: "1",
            title: "Episode One",
            downloads: [
              { date: "01-03-2026", count: 4 },
              { date: "02-03-2026", count: 3 },
            ],
          },
        ],
      },
    },
  };
  const requests = [];

  const exitCode = await runCli(
    [
      "episodes",
      "analytics-all",
      "--show-id",
      "132543",
      "--start-date",
      "01-03-2026",
      "--end-date",
      "07-03-2026",
      "--include",
      "show",
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
      path: "analytics/132543/episodes",
      query: {
        start_date: "01-03-2026",
        end_date: "07-03-2026",
        "include[]": "show",
      },
    },
  ]);
  assert.match(stdout, /^type: episodes_analytics$/mu);
  assert.match(stdout, /^episodes_count: 2$/mu);
  assert.match(stdout, /^- 2  Episode Two \(2 daily points\)$/mu);
  assert.match(stdout, /^- 1  Episode One \(2 daily points\)$/mu);
  assert.equal(stderr, "");
});

test("episodes analytics routes to the single-episode endpoint", async () => {
  const io = createIo();
  const payload = {
    data: {
      id: "3056098",
      type: "episode_analytics",
      attributes: {
        downloads: [
          { date: "01-03-2026", count: 7 },
          { date: "02-03-2026", count: 8 },
        ],
      },
    },
  };
  const requests = [];

  const exitCode = await runCli(
    [
      "episodes",
      "analytics",
      "--id",
      "3056098",
      "--start-date",
      "01-03-2026",
      "--end-date",
      "07-03-2026",
      "--include",
      "episode",
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
      path: "analytics/episodes/3056098",
      query: {
        start_date: "01-03-2026",
        end_date: "07-03-2026",
        "include[]": "episode",
      },
    },
  ]);
  assert.match(stdout, /^type: episode_analytics$/mu);
  assert.match(stdout, /^downloads: \[/mu);
  assert.equal(stderr, "");
});

test("shows analytics rejects partial date ranges before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["shows", "analytics", "--id", "132543", "--start-date", "01-03-2026"],
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
    /Provide `--start-date <dd-mm-yyyy>` and `--end-date <dd-mm-yyyy>` together\.[\s\S]*shows analytics --help/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes analytics validates include values per action before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        [
          "episodes",
          "analytics",
          "--id",
          "3056098",
          "--start-date",
          "01-03-2026",
          "--end-date",
          "07-03-2026",
          "--include",
          "show",
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
    /`--include <relationship>` must be one of `episode`\./u
  );

  assert.equal(requestCalls, 0);
});

test("episodes analytics surfaces mocked API failures", async () => {
  await assert.rejects(
    () =>
      runCli(
        ["episodes", "analytics", "--id", "3056098"],
        createIo(),
        createOptions({
          loadConfigImpl: async () => ({
            apiKey: "test-key",
            apiBaseUrl: "https://api.transistor.fm/v1",
          }),
          createHttpClientImpl() {
            return {
              async request() {
                throw new Error("Analytics API exploded.");
              },
            };
          },
        })
      ),
    /Analytics API exploded\.[\s\S]*episodes analytics --help/u
  );
});
