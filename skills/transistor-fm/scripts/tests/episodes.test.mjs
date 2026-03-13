import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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

async function loadFixture(name) {
  const fileUrl = new URL(`./fixtures/episodes/${name}`, import.meta.url);
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

async function withTempDir(run) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "transistor-episodes-"));
  try {
    await run(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

test("episodes help lists actions without expanding per-action documentation", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes \[action\] \[flags\]/u);
  assert.match(
    stdout,
    /publish\s*\n\s*Publish a single episode now or in the past, schedule for the future, or revert to a draft\./u
  );
  assert.match(
    stdout,
    /schedule\s*\n\s*Publish a single episode now or in the past, schedule for the future, or revert to a draft\./u
  );
  assert.match(
    stdout,
    /unpublish\s*\n\s*Publish a single episode now or in the past, schedule for the future, or revert to a draft\./u
  );
  assert.match(
    stdout,
    /upload\s*\n\s*Authorize a URL for uploading a local audio file to be used when creating or updating an episode\./u
  );
  assert.doesNotMatch(stdout, /--id <episode-id>/u);
  assert.doesNotMatch(stdout, /\n  help\n/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.doesNotMatch(stdout, /Action details:/u);
  assert.doesNotMatch(stdout, /Selector flags:/u);
  assert.doesNotMatch(stdout, /Filter flags:/u);
  assert.doesNotMatch(stdout, /Writable fields:/u);
  assert.doesNotMatch(stdout, /Examples:/u);
  assert.equal(stderr, "");
});

test("episodes publish, schedule, and unpublish help keep lifecycle fields separate from content fields", async () => {
  const io = createIo();
  const publishExitCode = await runCli(["episodes", "publish", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(publishExitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes publish \[flags\]/u);
  assert.match(stdout, /--published-at <value>/u);
  assert.doesNotMatch(stdout, /--title <value>/u);
  assert.equal(stderr, "");

  const scheduleIo = createIo();
  const scheduleExitCode = await runCli(["episodes", "schedule", "--help"], scheduleIo, createOptions());
  const scheduleOutput = scheduleIo.output();
  assert.equal(scheduleExitCode, 0);
  assert.match(scheduleOutput.stdout, /node scripts\/transistor-fm\.mjs episodes schedule \[flags\]/u);
  assert.match(scheduleOutput.stdout, /--published-at <value>/u);
  assert.doesNotMatch(scheduleOutput.stdout, /--title <value>/u);

  const unpublishIo = createIo();
  const unpublishExitCode = await runCli(
    ["episodes", "unpublish", "--help"],
    unpublishIo,
    createOptions()
  );
  const unpublishOutput = unpublishIo.output();
  assert.equal(unpublishExitCode, 0);
  assert.match(unpublishOutput.stdout, /node scripts\/transistor-fm\.mjs episodes unpublish \[flags\]/u);
  assert.doesNotMatch(unpublishOutput.stdout, /--published-at <value>/u);
  assert.doesNotMatch(unpublishOutput.stdout, /--title <value>/u);
});

test("episodes create --help includes create-only fields and typed mutation flags", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "create", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /--explicit <true\|false>/u);
  assert.match(stdout, /--number <integer>/u);
  assert.match(stdout, /--season <integer>/u);
  assert.match(stdout, /--type <full\|trailer\|bonus>/u);
  assert.match(stdout, /--transcript-file <path>/u);
  assert.match(stdout, /--transcript-text <value>[\s\S]*--transcript-file <path>/u);
  assert.match(stdout, /--increment-number <true\|false>/u);
  assert.equal(stderr, "");
});

test("episodes update --help omits create-only increment-number", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "update", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /--explicit <true\|false>/u);
  assert.match(stdout, /--number <integer>/u);
  assert.match(stdout, /--transcript-file <path>/u);
  assert.match(stdout, /--transcript-text <value>[\s\S]*--transcript-file <path>/u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /media_url - Trackable audio MP3 URL/u);
  assert.match(stdout, /audio_processing - Denotes processing of audio after creating or updating the audio URL/u);
  assert.match(stdout, /transcripts - Array of URLs to AI transcription formats/u);
  assert.doesNotMatch(stdout, /--increment-number <true\|false>/u);
  assert.equal(stderr, "");
});

test("episodes get --help includes documented computed episode fields", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "get", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes get \[flags\]/u);
  assert.match(stdout, /--include <show>/u);
  assert.match(stdout, /Read-only fields:/u);
  assert.match(stdout, /duration_in_mmss - Duration of episode in minutes and seconds/u);
  assert.match(stdout, /embed_html_dark - Dark theme of the embeddable audio player HTML/u);
  assert.match(stdout, /slug - Slugified episode title used in Transistor websites/u);
  assert.equal(stderr, "");
});

test("episodes list renders pagination metadata and forwards filters", async () => {
  const io = createIo();
  const payload = await loadFixture("list.json");
  const requests = [];

  const exitCode = await runCli(
    [
      "episodes",
      "list",
      "--show-id",
      "132543",
      "--status",
      "draft",
      "--order",
      "asc",
      "--query",
      "coffee",
      "--page",
      "1",
      "--per=2",
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
      path: "episodes",
      query: {
        show_id: "132543",
        status: "draft",
        order: "asc",
        query: "coffee",
        "pagination[page]": "1",
        "pagination[per]": "2",
      },
    },
  ]);
  assert.match(stdout, /^Page 1 of 2 \(8 total\)$/mu);
  assert.match(stdout, /^- 3056098  How To Roast Coffee$/mu);
  assert.match(stdout, /^- 3056099  The Effects of Caffeine$/mu);
  assert.equal(stderr, "");
});

test("episodes get renders one resource", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    ["episodes", "get", "--id", "3056098"],
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
  assert.deepEqual(requests, [{ method: "GET", path: "episodes/3056098" }]);
  assert.match(stdout, /^id: 3056098$/mu);
  assert.match(stdout, /^title: How To Roast Coffee$/mu);
  assert.match(stdout, /^status: published$/mu);
  assert.equal(stderr, "");
});

test("episodes get forwards include show when requested", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    ["episodes", "get", "--id", "3056098", "--include", "show"],
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
      path: "episodes/3056098",
      query: { "include[]": "show" },
    },
  ]);
  assert.match(stdout, /^id: 3056098$/mu);
  assert.equal(stderr, "");
});

test("episodes create requires --show-id before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "create", "--title", "Great episode"],
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
    /Missing required `--show-id <id-or-slug>`\.[\s\S]*episodes create --help/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes create with no params falls back to action help", async () => {
  const io = createIo();
  let requestCalls = 0;

  const exitCode = await runCli(
    ["episodes", "create"],
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
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes create \[flags\]/u);
  assert.match(
    stdout,
    /Create a new draft episode for the specified show\. Note that publishing an episode involves a separate endpoint\./u
  );
  assert.match(stdout, /--show-id <id-or-slug>/u);
  assert.equal(stderr, "");
});

test("episodes create requires at least one meaningful payload field", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "create", "--show-id", "132543"],
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
    /Provide at least one writable field/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes create sends the full documented nested episode payload with typed values", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    [
      "episodes",
      "create",
      "--show-id",
      "132543",
      "--title",
      "Great episode",
      "--author",
      "Host Name",
      "--description",
      "Episode description",
      "--explicit",
      "true",
      "--image-url",
      "https://cdn.example.com/art.jpg",
      "--keywords",
      "coffee,caffeine",
      "--number",
      "7",
      "--season",
      "2",
      "--type",
      "bonus",
      "--alternate-url",
      "https://example.com/episodes/great-episode",
      "--video-url",
      "https://youtube.com/watch?v=123",
      "--email-notifications",
      "false",
      "--increment-number",
      "true",
      "--transcript-text",
      "Hello transcript",
      "--audio-url",
      "https://cdn.example.com/audio.mp3",
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
      path: "episodes",
      body: {
        episode: {
          show_id: "132543",
          title: "Great episode",
          author: "Host Name",
          description: "Episode description",
          explicit: true,
          image_url: "https://cdn.example.com/art.jpg",
          keywords: "coffee,caffeine",
          number: 7,
          season: 2,
          type: "bonus",
          alternate_url: "https://example.com/episodes/great-episode",
          video_url: "https://youtube.com/watch?v=123",
          email_notifications: false,
          increment_number: true,
          transcript_text: "Hello transcript",
          audio_url: "https://cdn.example.com/audio.mp3",
        },
      },
    },
  ]);
});

test("episodes create normalizes markdown when reading transcript text from a local file", async () => {
  await withTempDir(async (tempDir) => {
    const io = createIo();
    const payload = await loadFixture("get.json");
    const requests = [];
    const transcriptPath = path.join(tempDir, "transcript.md");
    await fs.writeFile(
      transcriptPath,
      "**Neil**: See [Cursor](https://cursor.com) and *italics* and `const value = 1`.",
      "utf8"
    );

    const exitCode = await runCli(
      [
        "episodes",
        "create",
        "--show-id",
        "132543",
        "--title",
        "Great episode",
        "--transcript-file",
        transcriptPath,
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
        path: "episodes",
        body: {
          episode: {
            show_id: "132543",
            title: "Great episode",
            transcript_text: "Neil: See Cursor and italics and `const value = 1`.",
          },
        },
      },
    ]);
  });
});

test("episodes create rejects invalid boolean and integer mutation values before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "create", "--show-id", "132543", "--explicit", "maybe", "--number", "seven"],
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
    /`--explicit <true\|false>` must be `true` or `false`\.[\s\S]*episodes create --help/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes create rejects episode numbers less than 1 before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "create", "--show-id", "132543", "--number", "0"],
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
    /`--number <integer>` must be greater than 0\.[\s\S]*episodes create --help/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes update rejects empty mutation input before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "update", "--id", "3056098"],
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
    /Provide at least one writable field/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes update sends the documented nested episode payload with typed values", async () => {
  const io = createIo();
  const payload = await loadFixture("get.json");
  const requests = [];

  const exitCode = await runCli(
    [
      "episodes",
      "update",
      "--id",
      "3056098",
      "--author",
      "Updated Host",
      "--description",
      "Updated description",
      "--explicit",
      "false",
      "--keywords",
      "updated,keywords",
      "--number",
      "8",
      "--season",
      "3",
      "--type",
      "trailer",
      "--alternate-url",
      "https://example.com/episodes/updated",
      "--video-url",
      "https://youtube.com/watch?v=456",
      "--email-notifications",
      "true",
      "--transcript-text",
      "Updated transcript",
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
      method: "PATCH",
      path: "episodes/3056098",
      body: {
        episode: {
          author: "Updated Host",
          description: "Updated description",
          explicit: false,
          keywords: "updated,keywords",
          number: 8,
          season: 3,
          type: "trailer",
          alternate_url: "https://example.com/episodes/updated",
          video_url: "https://youtube.com/watch?v=456",
          email_notifications: true,
          transcript_text: "Updated transcript",
        },
      },
    },
  ]);
});

test("episodes update normalizes markdown when reading transcript text from a local file", async () => {
  await withTempDir(async (tempDir) => {
    const io = createIo();
    const payload = await loadFixture("get.json");
    const requests = [];
    const transcriptPath = path.join(tempDir, "transcript.md");
    await fs.writeFile(
      transcriptPath,
      "Updated [link](https://example.com) with __bold__, _italics_, and `npm test`",
      "utf8"
    );

    const exitCode = await runCli(
      [
        "episodes",
        "update",
        "--id",
        "3056098",
        "--transcript-file",
        transcriptPath,
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
        method: "PATCH",
        path: "episodes/3056098",
        body: {
          episode: {
            transcript_text: "Updated link with bold, italics, and `npm test`",
          },
        },
      },
    ]);
  });
});

test("episodes update rejects episode numbers less than 1 before making a request", async () => {
  let requestCalls = 0;

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "update", "--id", "3056098", "--number", "0"],
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
    /`--number <integer>` must be greater than 0\.[\s\S]*episodes update --help/u
  );

  assert.equal(requestCalls, 0);
});

test("episodes lifecycle actions route to the publish endpoint with fixed statuses", async () => {
  const cases = [
    {
      argv: ["episodes", "unpublish", "--id", "3056098"],
      body: { episode: { status: "draft" } },
    },
    {
      argv: ["episodes", "schedule", "--id", "3056098"],
      body: {
        episode: {
          status: "scheduled",
        },
      },
    },
    {
      argv: [
        "episodes",
        "schedule",
        "--id",
        "3056098",
        "--published-at",
        "2026-03-15 09:00:00",
      ],
      body: {
        episode: {
          status: "scheduled",
          published_at: "2026-03-15 09:00:00",
        },
      },
    },
    {
      argv: [
        "episodes",
        "publish",
        "--id",
        "3056098",
        "--published-at",
        "2026-03-11 09:00:00",
      ],
      body: {
        episode: {
          status: "published",
          published_at: "2026-03-11 09:00:00",
        },
      },
    },
  ];

  for (const testCase of cases) {
    const io = createIo();
    const payload = await loadFixture("get.json");
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
    assert.deepEqual(requests, [
      {
        method: "PATCH",
        path: "episodes/3056098/publish",
        body: testCase.body,
      },
    ]);
  }
});

test("episodes upload authorizes and uploads a local file before returning audio_url", async () => {
  await withTempDir(async (tempDir) => {
    const io = createIo();
    const filePath = path.join(tempDir, "Episode1.mp3");
    await fs.writeFile(filePath, "test-audio-body", "utf8");

    const authorizePayload = {
      data: {
        id: "068317ca-661a-459c-b0c1-aa5b8bc09109",
        type: "audio_upload",
        attributes: {
          upload_url: "https://transistorupload.s3.amazonaws.com/example.mp3?signature=test",
          content_type: "audio/mpeg",
          expires_in: 600,
          audio_url: "https://transistorupload.s3.amazonaws.com/example.mp3",
        },
      },
    };
    const requests = [];
    const uploads = [];

    const exitCode = await runCli(
      ["episodes", "upload", "--file", filePath],
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
              return authorizePayload;
            },
            async upload(request) {
              uploads.push({
                ...request,
                body: request.body.toString("utf8"),
              });
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
        path: "episodes/authorize_upload",
        query: { filename: "Episode1.mp3" },
      },
    ]);
    assert.deepEqual(uploads, [
      {
        url: "https://transistorupload.s3.amazonaws.com/example.mp3?signature=test",
        contentType: "audio/mpeg",
        body: "test-audio-body",
      },
    ]);
    assert.match(stdout, /^audio_url: https:\/\/transistorupload\.s3\.amazonaws\.com\/example\.mp3$/mu);
    assert.doesNotMatch(stdout, /^upload_url:/mu);
    assert.doesNotMatch(stdout, /^content_type:/mu);
    assert.equal(stderr, "");
  });
});

test("episodes upload fails with a readable error when the local file is missing", async () => {
  const missingPath = path.join(os.tmpdir(), "transistor-missing-audio-file.mp3");

  await assert.rejects(
    () =>
      runCli(
        ["episodes", "upload", "--file", missingPath],
        createIo(),
        createOptions()
      ),
    /Unable to read `.*transistor-missing-audio-file\.mp3`:[\s\S]*episodes upload --help/u
  );
});

test("episodes upload rejects directory paths that are not readable audio files", async () => {
  await withTempDir(async (tempDir) => {
    await assert.rejects(
      () =>
        runCli(
          ["episodes", "upload", "--file", tempDir],
          createIo(),
          createOptions()
        ),
      /Unable to read `.*transistor-episodes-.*`:[\s\S]*episodes upload --help/u
    );
  });
});

test("episodes upload surfaces upload-step failures", async () => {
  await withTempDir(async (tempDir) => {
    const filePath = path.join(tempDir, "Episode1.mp3");
    await fs.writeFile(filePath, "test-audio-body", "utf8");

    const authorizePayload = {
      data: {
        attributes: {
          upload_url: "https://transistorupload.s3.amazonaws.com/example.mp3?signature=test",
          content_type: "audio/mpeg",
          audio_url: "https://transistorupload.s3.amazonaws.com/example.mp3",
        },
      },
    };

    await assert.rejects(
      () =>
        runCli(
          ["episodes", "upload", "--file", filePath],
          createIo(),
          createOptions({
            loadConfigImpl: async () => ({
              apiKey: "test-key",
              apiBaseUrl: "https://api.transistor.fm/v1",
            }),
            createHttpClientImpl() {
              return {
                async request() {
                  return authorizePayload;
                },
                async upload() {
                  throw new Error("Audio upload failed with status 403. AccessDenied");
                },
              };
            },
          })
        ),
      /Audio upload failed with status 403\. AccessDenied[\s\S]*episodes upload --help/u
    );
  });
});
