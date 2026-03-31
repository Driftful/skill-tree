import {
  renderActionHelp,
  renderGlobalHelp,
  renderNounHelp,
  renderUnknownActionHelp,
  renderUnknownNounHelp,
} from "./help-renderer.mjs";
import { loadConfig } from "./config.mjs";
import { createHttpClient } from "./http-client.mjs";
import { registerEpisodesNoun } from "./nouns/episodes.mjs";
import { registerShowsNoun } from "./nouns/shows.mjs";
import { registerSubscribersNoun } from "./nouns/subscribers.mjs";
import { registerUserNoun } from "./nouns/user.mjs";
import { registerWebhooksNoun } from "./nouns/webhooks.mjs";
import { renderCollection, renderResource } from "./response-formatter.mjs";
import { createRegistry } from "./registry.mjs";
import { loadSchemaBundle } from "./schema-cache.mjs";

function isFlagToken(token) {
  return token !== "-" && String(token).startsWith("-");
}

function normalizeFlagName(token) {
  return String(token || "").replace(/^-+/u, "").trim();
}

function appendFlagValue(flags, name, value) {
  if (!Object.prototype.hasOwnProperty.call(flags, name)) {
    flags[name] = value;
    return;
  }

  if (Array.isArray(flags[name])) {
    flags[name].push(value);
    return;
  }

  flags[name] = [flags[name], value];
}

export function parseArgv(argv = []) {
  const positionals = [];
  const flags = {};
  const rawFlags = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index]);
    if (!isFlagToken(token)) {
      positionals.push(token);
      continue;
    }

    if (token === "--") {
      positionals.push(...argv.slice(index + 1).map((value) => String(value)));
      break;
    }

    const normalized = token.replace(/^-+/u, "");
    const equalsIndex = normalized.indexOf("=");
    const hasInlineValue = equalsIndex >= 0;
    const name = normalizeFlagName(
      hasInlineValue ? normalized.slice(0, equalsIndex) : normalized
    );

    if (!name) {
      continue;
    }

    let value = true;
    if (hasInlineValue) {
      value = normalized.slice(equalsIndex + 1);
    } else {
      const nextToken = argv[index + 1];
      if (nextToken !== undefined && !isFlagToken(String(nextToken))) {
        value = String(nextToken);
        index += 1;
      }
    }

    rawFlags.push([name, value]);
    appendFlagValue(flags, name, value);
  }

  return { positionals, flags, rawFlags };
}

function hasFlag(flags, ...names) {
  return names.some((name) => Object.prototype.hasOwnProperty.call(flags, name));
}

function write(stream, text) {
  if (typeof stream?.write === "function") {
    stream.write(text);
  }
}

function addActionHelpHint(error, nounName, actionName) {
  const message = String(error?.message || error || "").trim();
  const hint = `Use \`node scripts/transistor-fm.mjs ${nounName} ${actionName} --help\` to see documentation.`;

  if (!message) {
    return new Error(hint);
  }

  if (message.includes(hint)) {
    return error instanceof Error ? error : new Error(message);
  }

  return new Error(`${message}\n${hint}`);
}

function isEmptyActionInvocation({ positionals = [], rawFlags = [] } = {}) {
  return positionals.length === 0 && rawFlags.length === 0;
}

function shouldRenderActionHelpForValidationError(error, invocation) {
  const message = String(error?.message || error || "").trim();
  return isEmptyActionInvocation(invocation) && /^Missing required\b/u.test(message);
}

function buildSchemaBackedContext({
  schemaBundle,
  registryFactory = createRegistry,
  nounRegistrars = [
    registerUserNoun,
    registerShowsNoun,
    registerEpisodesNoun,
    registerSubscribersNoun,
    registerWebhooksNoun,
  ],
} = {}) {
  const registry = registryFactory({ schemaBundle });

  for (const registerNoun of nounRegistrars) {
    if (typeof registerNoun === "function") {
      registerNoun(registry);
    }
  }

  return {
    registry,
  };
}

async function buildCliState(options = {}) {
  const loadBundle = options.loadSchemaBundleImpl || loadSchemaBundle;
  const result = await loadBundle();

  return {
    bundle: result?.bundle || result,
    warnings: result?.warnings || [],
  };
}

async function buildActionContext(options = {}) {
  const loadConfigImpl = options.loadConfigImpl || loadConfig;
  const createHttpClientImpl = options.createHttpClientImpl || createHttpClient;
  const config = options.config || (await loadConfigImpl());

  return {
    config,
    io: options.io || process,
    httpClient: options.httpClient || createHttpClientImpl(config),
    formatters: options.formatters || {
      renderCollection,
      renderResource,
    },
  };
}

async function runSchemaBackedCli(argv, io = process, state, options = {}) {
  const { positionals, flags, rawFlags } = parseArgv(argv);
  const context = buildSchemaBackedContext({
    ...options,
    schemaBundle: state.bundle,
  });
  const wantsGlobalHelp = positionals.length === 0 || positionals[0] === "help";
  const wantsHelpFlag = hasFlag(flags, "help", "h");

  if (wantsGlobalHelp) {
    write(
      io.stdout,
      renderGlobalHelp({
        registry: context.registry,
        warnings: state.warnings,
      })
    );
    return 0;
  }

  const nounName = positionals[0];
  const noun = context.registry.getNoun(nounName);
  if (!noun) {
    write(
      io.stderr,
      renderUnknownNounHelp(nounName, {
        registry: context.registry,
        warnings: state.warnings,
      })
    );
    return 1;
  }

  const actionName = positionals[1];
  if (!actionName || actionName === "help") {
    write(io.stdout, renderNounHelp(noun, { warnings: state.warnings }));
    return 0;
  }

  const action = noun.actions[actionName];
  if (wantsHelpFlag && action) {
    write(io.stdout, renderActionHelp(noun, action, { warnings: state.warnings }));
    return 0;
  }

  if (wantsHelpFlag && !action) {
    write(
      io.stderr,
      renderUnknownActionHelp(noun, actionName, { warnings: state.warnings })
    );
    return 1;
  }

  if (!action) {
    write(
      io.stderr,
      renderUnknownActionHelp(noun, actionName, { warnings: state.warnings })
    );
    return 1;
  }

  if (typeof action.run === "function") {
    const actionInvocation = {
      nounName,
      actionName,
      positionals: positionals.slice(2),
      flags,
      rawFlags,
    };

    try {
      const actionContext = await buildActionContext({ ...options, io });
      const output = await action.run(actionInvocation, {
        ...actionContext,
        registry: context.registry,
        warnings: state.warnings,
      });

      if (output !== undefined && output !== null) {
        write(io.stdout, String(output));
      }
    } catch (error) {
      if (shouldRenderActionHelpForValidationError(error, actionInvocation)) {
        write(io.stdout, renderActionHelp(noun, action, { warnings: state.warnings }));
        return 0;
      }

      throw addActionHelpHint(error, noun.name, action.name);
    }

    return 0;
  }

  write(
    io.stderr,
    [
      `Action "${actionName}" for noun "${noun.name}" is not implemented yet.`,
      "",
      renderNounHelp(noun, { warnings: state.warnings }).trimEnd(),
      "",
    ].join("\n")
  );
  return 1;
}

export async function runCli(argv, io = process, options = {}) {
  const state = await buildCliState(options);
  return runSchemaBackedCli(argv, io, state, options);
}
