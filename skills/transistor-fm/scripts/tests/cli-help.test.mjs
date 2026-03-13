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

function createOptions() {
  return {
    loadSchemaBundleImpl: async () => ({
      bundle: createDefaultSchemaBundle("2026-03-11T00:00:00.000Z"),
      warnings: [],
    }),
  };
}

test("no-arg invocation renders global help", async () => {
  const io = createIo();
  const exitCode = await runCli([], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /Usage:/u);
  assert.match(stdout, /episodes/u);
  assert.match(stdout, /episodes create --help/u);
  assert.equal(stderr, "");
});

test("resource-only invocation falls back to resource help", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes \[action\]/u);
  assert.match(stdout, /Create, inspect, and publish podcast episodes/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.equal(stderr, "");
});

test("resource-scoped help flag renders resource help", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "--help"], io, createOptions());
  const { stdout, stderr } = io.output();

  assert.equal(exitCode, 0);
  assert.match(stdout, /node scripts\/transistor-fm\.mjs episodes \[action\]/u);
  assert.match(stdout, /Actions:/u);
  assert.doesNotMatch(stdout, /Notes:/u);
  assert.equal(stderr, "");
});

test("unknown resource returns guided help and non-zero exit", async () => {
  const io = createIo();
  const exitCode = await runCli(["unknown"], io, createOptions());
  const { stderr } = io.output();

  assert.equal(exitCode, 1);
  assert.match(stderr, /Unknown resource "unknown"/u);
  assert.match(stderr, /Resources:/u);
});

test("unknown action returns resource help and non-zero exit", async () => {
  const io = createIo();
  const exitCode = await runCli(["episodes", "bogus"], io, createOptions());
  const { stderr } = io.output();

  assert.equal(exitCode, 1);
  assert.match(stderr, /Unknown action "bogus"/u);
  assert.match(stderr, /Actions:/u);
});
