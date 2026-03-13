const FOUNDATION_NOUNS = [];

function normalizeToken(value) {
  return String(value || "").trim().toLowerCase();
}

function cloneEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return entry;
  }

  return { ...entry };
}

function cloneEntries(entries = []) {
  return Array.isArray(entries) ? entries.map((entry) => cloneEntry(entry)) : [];
}

function cloneAction(actionName, action = {}) {
  return {
    ...action,
    name: normalizeToken(action.name || actionName),
    summary: action.summary || "No summary available.",
    flags: cloneEntries(action.flags),
    filterFlags: cloneEntries(action.filterFlags),
    selectorFlags: cloneEntries(action.selectorFlags),
    writableFields: cloneEntries(action.writableFields),
    readOnlyFields: cloneEntries(action.readOnlyFields),
    examples: Array.isArray(action.examples) ? [...action.examples] : [],
    notes: Array.isArray(action.notes) ? [...action.notes] : [],
    implemented: action.implemented !== false,
    run: typeof action.run === "function" ? action.run : undefined,
  };
}

function cloneNoun(noun = {}) {
  const actions = {};
  for (const [actionName, action] of Object.entries(noun.actions || {})) {
    const normalizedName = normalizeToken(actionName);
    if (!normalizedName) continue;
    actions[normalizedName] = cloneAction(normalizedName, action);
  }

  if (!actions.help) {
    actions.help = cloneAction("help", {
      summary: `Show help for ${noun.name || "this resource"}`,
      flags: [],
      examples: [`node scripts/transistor-fm.mjs ${noun.name || "resource"} help`],
    });
  }

  return {
    name: normalizeToken(noun.name),
    summary: noun.summary || "No summary available.",
    aliases: Array.isArray(noun.aliases)
      ? noun.aliases.map((alias) => normalizeToken(alias)).filter(Boolean)
      : [],
    notes: Array.isArray(noun.notes) ? [...noun.notes] : [],
    actions,
    endpoints: Array.isArray(noun.endpoints) ? [...noun.endpoints] : [],
    fields: noun.fields && typeof noun.fields === "object" ? { ...noun.fields } : {},
  };
}

function mergeNoun(existing, next) {
  if (!existing) {
    return cloneNoun(next);
  }

  return {
    ...existing,
    summary: next.summary || existing.summary,
    aliases: Array.from(new Set([...existing.aliases, ...(next.aliases || [])])),
    notes: next.notes?.length ? [...next.notes] : existing.notes,
    actions: {
      ...existing.actions,
      ...Object.fromEntries(
        Object.entries(next.actions || {}).map(([actionName, action]) => [
          normalizeToken(actionName),
          cloneAction(actionName, action),
        ])
      ),
    },
    endpoints: next.endpoints?.length ? [...next.endpoints] : existing.endpoints,
    fields: Object.keys(next.fields || {}).length ? { ...next.fields } : existing.fields,
  };
}

export function createRegistry({ schemaBundle, nouns = [] } = {}) {
  const nounMap = new Map();
  const aliasMap = new Map();
  const sources = [...FOUNDATION_NOUNS, ...Object.values(schemaBundle?.nouns || {}), ...nouns];

  function rebuildAliases() {
    aliasMap.clear();
    for (const noun of nounMap.values()) {
      for (const alias of noun.aliases) {
        aliasMap.set(alias, noun.name);
      }
    }
  }

  function addNoun(noun) {
    const normalized = cloneNoun(noun);
    if (!normalized.name) {
      return null;
    }

    nounMap.set(normalized.name, mergeNoun(nounMap.get(normalized.name), normalized));
    rebuildAliases();
    return nounMap.get(normalized.name);
  }

  for (const source of sources) {
    addNoun(source);
  }

  return {
    addNoun,
    listNouns() {
      return [...nounMap.values()].sort((left, right) =>
        left.name.localeCompare(right.name)
      );
    },
    getNoun(name) {
      const normalizedName = normalizeToken(name);
      const resolvedName = aliasMap.get(normalizedName) || normalizedName;
      return nounMap.get(resolvedName) || null;
    },
    hasNoun(name) {
      return Boolean(this.getNoun(name));
    },
  };
}
