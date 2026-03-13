import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

import { parseArgv, runCli } from "../lib/cli.mjs";
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

async function loadFixture(name) {
  const fileUrl = new URL(`./fixtures/shows/${name}`, import.meta.url);
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

test("parseArgv preserves spaced, equals, boolean, and repeated flags", () => {
  const parsed = parseArgv([
    "shows",
    "update",
    "--id",
    "132543",
    "--title=Updated Title",
    "--private",
    "--tag",
    "alpha",
    "--tag=beta",
  ]);

  assert.deepEqual(parsed.positionals, ["shows", "update"]);
  assert.deepEqual(parsed.flags, {
    id: "132543",
    title: "Updated Title",
    private: true,
    tag: ["alpha", "beta"],
  });
  assert.deepEqual(parsed.rawFlags, [
    ["id", "132543"],
    ["title", "Updated Title"],
    ["private", true],
    ["tag", "alpha"],
    ["tag", "beta"],
  ]);
});

test("shows help lists actions without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["shows", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs shows \[action\] \[flags\]/u);
  assert.match(stdout, /update\s*\n\s*Update a show with any or all of the following attributes\./u);
  assert.doesNotMatch(stdout, /--id <id-or-slug>/u);
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.doesNotMatch(stdout, /Action details:/u);
  assert.doesNotMatch(stdout, /Selector flags:/u);
  assert.doesNotMatch(stdout, /Filter flags:/u);
  assert.doesNotMatch(stdout, /Writable fields:/u);
  assert.doesNotMatch(stdout, /Read-only fields:/u);
  assert.doesNotMatch(stdout, /Examples:/u);
  assert.equal(stderr, "");
});

test("shows update --help still works when mixed with parsed flags", async () => {
  const io = createIo();
  const exitCode = await runCli(
    ["shows", "update", "--id", "132543", "--help"],
    io,
    createOptions()
  );
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs shows update \[flags\]/u);
  assert.match(stdout, /Selector flags:/u);
  assert.match(stdout, /Writable fields:/u);
  assert.doesNotMatch(stdout, /^Actions:/mu);
  assert.equal(stderr, "");
});

test("shows update --help lists the expanded documented mutation surface", async () => {
  const io = createIo();
  const exitCode = await runCli(["shows", "update", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /--copyright <value>/u);
  assert.match(stdout, /--explicit <true\|false>/u);
  assert.match(stdout, /--image-url <value>/u);
  assert.match(stdout, /--owner-email <value>/u);
  assert.match(stdout, /--secondary-category <value>/u);
  assert.match(stdout, /--show-type <episodic\|serial>/u);
  assert.match(stdout, /--time-zone <value>/u);
  assert.match(stdout, /--website <value>/u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /multiple_seasons - Podcast has multiple seasons/u);
  assert.match(stdout, /spotify - Spotify URL/u);
  assert.match(stdout, /updated_at - Timestamp of last update/u);
  assert.equal(stderr, "");
});

test("shows get --help includes documented API-managed read-only fields", async () => {
  const io = createIo();
  const exitCode = await runCli(["shows", "get", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs shows get \[flags\]/u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /feed_url - Generated RSS feed URL/u);
  assert.match(stdout, /private - Read-only visibility attribute/u);
  assert.match(stdout, /playlist_limit - Playlist embed player episode limit/u);
  assert.equal(stderr, "");
});

test("shows list renders pagination metadata and forwards parsed query flags", async () => {
  const io = createIo();
  const payload = await loadFixture("list.json");
  const requests = [];

  const exitCode = await runCli(
    ["shows", "list", "--query", "caffeine", "--page", "1", "--per=2", "--private"],
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
  assert.equal(requests.length, 1);
  assert.deepEqual(requests[0], {
    method: "GET",
    path: "shows",
    query: {
      query: "caffeine",
      private: true,
      "pagination[page]": "1",
      "pagination[per]": "2",
    },
  });
  assert.match(stdout, /^Page 1 of 3 \(25 total\)$/mu);
  assert.match(stdout, /^- 132543  The Caffeine Show$/mu);
  assert.match(stdout, /^- 132544  Another Show$/mu);
  assert.equal(stderr, "");
});

test("shows get supports numeric IDs", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    ["shows", "get", "--id", "132543"],
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
  assert.deepEqual(requests, [{ method: "GET", path: "shows/132543" }]);
  assert.match(stdout, /^id: 132543$/mu);
  assert.match(stdout, /^slug: the-caffeine-show$/mu);
  assert.equal(stderr, "");
});

test("shows get supports slug selectors", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    ["shows", "get", "--id", "the-caffeine-show"],
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
  assert.deepEqual(requests, [{ method: "GET", path: "shows/the-caffeine-show" }]);
});

test("shows update rejects empty mutation input before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["shows", "update", "--id", "132543"],
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
    /Provide at least one writable field[\s\S]*shows update --help/u
  );

  assert.equal(requestCalls, 0);
});

test("shows update sends the documented nested show payload with typed values", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    [
      "shows",
      "update",
      "--id=132543",
      "--title",
      "Updated Title",
      "--author=Updated Author",
      "--copyright",
      "2026 Skill Tree Media",
      "--explicit",
      "true",
      "--image-url",
      "https://cdn.example.com/show.jpg",
      "--keywords",
      "coffee,caffeine",
      "--owner-email",
      "owner@example.com",
      "--secondary-category",
      "Arts",
      "--show-type",
      "serial",
      "--time-zone",
      "America/Chicago",
      "--website",
      "https://example.com/show",
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
      method: "PATCH",
      path: "shows/132543",
      body: {
        show: {
          title: "Updated Title",
          author: "Updated Author",
          copyright: "2026 Skill Tree Media",
          explicit: true,
          image_url: "https://cdn.example.com/show.jpg",
          keywords: "coffee,caffeine",
          owner_email: "owner@example.com",
          secondary_category: "Arts",
          show_type: "serial",
          time_zone: "America/Chicago",
          website: "https://example.com/show",
        },
      },
    },
  ]);
  assert.match(stdout, /^title: The Caffeine Show$/mu);
  assert.equal(stderr, "");
});

test("shows update rejects invalid boolean values before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["shows", "update", "--id", "132543", "--explicit", "sometimes"],
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
    /`--explicit <true\|false>` must be `true` or `false`\.[\s\S]*shows update --help/u
  );

  assert.equal(requestCalls, 0);
});
