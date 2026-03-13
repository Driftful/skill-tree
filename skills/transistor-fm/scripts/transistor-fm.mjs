#!/usr/bin/env node

import { runCli } from "./lib/cli.mjs";

runCli(process.argv.slice(2)).then(
  (exitCode) => {
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  },
  (error) => {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
);
