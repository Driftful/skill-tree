import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_API_BASE_URL = "https://api.transistor.fm/v1";
const LIB_DIR_PATH = path.dirname(fileURLToPath(import.meta.url));
export const SKILL_ROOT_PATH = path.resolve(LIB_DIR_PATH, "..", "..");
export const DEFAULT_ENV_FILE_PATH = path.join(SKILL_ROOT_PATH, ".env");
export const EXAMPLE_ENV_FILE_PATH = path.join(SKILL_ROOT_PATH, ".env.example");

function parseLine(line, lineNumber) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex === -1) {
    throw new Error(`Malformed .env line ${lineNumber}: expected KEY=VALUE`);
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  if (!key) {
    throw new Error(`Malformed .env line ${lineNumber}: missing key name`);
  }

  let value = trimmed.slice(separatorIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function parseEnvFile(content) {
  const values = {};
  const lines = String(content).split(/\r?\n/u);

  for (const [index, line] of lines.entries()) {
    const entry = parseLine(line, index + 1);
    if (!entry) continue;
    const [key, value] = entry;
    values[key] = value;
  }

  return values;
}

async function readEnvFile(envFilePath) {
  try {
    const content = await fs.readFile(envFilePath, "utf8");
    return parseEnvFile(content);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export async function loadConfig({
  env = process.env,
  envFilePath = DEFAULT_ENV_FILE_PATH,
} = {}) {
  const fileValues = await readEnvFile(envFilePath);
  const merged = {
    ...fileValues,
    ...env,
  };

  const apiKey = String(merged.TRANSISTOR_API_KEY || "").trim();
  const apiBaseUrl = String(
    merged.TRANSISTOR_API_BASE_URL || DEFAULT_API_BASE_URL
  ).trim();

  return {
    apiKey,
    apiBaseUrl,
    envFilePath,
  };
}
