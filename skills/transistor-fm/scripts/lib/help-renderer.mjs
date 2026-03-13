function formatWarnings(warnings = []) {
  if (!warnings.length) {
    return "";
  }

  return [
    "Warnings:",
    ...warnings.map((warning) => `- ${warning}`),
    "",
  ].join("\n");
}

function formatActionLine(action) {
  return `  ${action.name}\n    ${action.summary}`;
}

function formatEntry(entry, { indent = "" } = {}) {
  if (typeof entry === "string") {
    return `${indent}${entry}`;
  }

  const name = entry?.name || String(entry);
  const summary = entry?.summary ? ` - ${entry.summary}` : "";
  return `${indent}${name}${summary}`;
}

function formatExamples(examples = []) {
  if (!examples.length) {
    return "";
  }

  return ["Examples:", ...examples.map((example) => `  ${example}`)].join("\n");
}

function formatNotes(notes = []) {
  if (!notes.length) {
    return "";
  }

  return ["Notes:", ...notes.map((note) => `  ${note}`)].join("\n");
}

function formatFlags(flags = []) {
  if (!flags.length) {
    return "";
  }

  return ["Flags:", ...flags.map((flag) => formatEntry(flag, { indent: "  " }))].join("\n");
}

function formatGroups(groups = []) {
  const sections = groups
    .filter((group) => Array.isArray(group.entries) && group.entries.length)
    .map((group) =>
      [group.heading, ...group.entries.map((entry) => formatEntry(entry, { indent: "  " }))].join(
        "\n"
      )
    );

  return sections.join("\n\n");
}

function getActionGroups(action) {
  return [
    { heading: "Selector flags:", entries: action.selectorFlags },
    { heading: "Filter flags:", entries: action.filterFlags },
    { heading: "Writable fields:", entries: action.writableFields },
    { heading: "Read-only fields:", entries: action.readOnlyFields },
  ];
}

export function renderGlobalHelp({ registry, warnings = [] }) {
  const resources = registry.listNouns();
  const sections = [];
  const warningSection = formatWarnings(warnings);

  if (warningSection) {
    sections.push(warningSection.trimEnd());
  }

  sections.push("Usage:\n  node scripts/transistor-fm.mjs [resource] [action] [flags]");
  sections.push(
    [
      "Resources:",
      ...resources.map((resource) => `  ${resource.name.padEnd(12)} ${resource.summary}`),
    ].join("\n")
  );
  sections.push(
    [
      "Examples:",
      "  node scripts/transistor-fm.mjs help",
      "  node scripts/transistor-fm.mjs episodes help",
      "  node scripts/transistor-fm.mjs episodes create --help",
    ].join("\n")
  );

  return `${sections.join("\n\n")}\n`;
}

export function renderNounHelp(noun, { warnings = [] } = {}) {
  const actions = Object.values(noun.actions)
    .filter((action) => action.name !== "help")
    .sort((left, right) => left.name.localeCompare(right.name));
  const sections = [];
  const warningSection = formatWarnings(warnings);

  if (warningSection) {
    sections.push(warningSection.trimEnd());
  }

  sections.push(
    `Usage:\n  node scripts/transistor-fm.mjs ${noun.name} [action] [flags]`
  );
  sections.push(`Summary:\n  ${noun.summary}`);
  sections.push(
    ["Actions:", ...actions.map((action) => formatActionLine(action))].join("\n")
  );

  return `${sections.join("\n\n")}\n`;
}

export function renderActionHelp(noun, action, { warnings = [] } = {}) {
  const sections = [];
  const warningSection = formatWarnings(warnings);
  const groupedSections = formatGroups(getActionGroups(action));

  if (warningSection) {
    sections.push(warningSection.trimEnd());
  }

  sections.push(
    `Usage:\n  node scripts/transistor-fm.mjs ${noun.name} ${action.name} [flags]`
  );
  sections.push(`Summary:\n  ${action.summary}`);

  const flagsSection = groupedSections ? "" : formatFlags(action.flags);
  if (flagsSection) {
    sections.push(flagsSection);
  }

  if (groupedSections) {
    sections.push(groupedSections);
  }

  const notesSection = formatNotes([...(noun.notes || []), ...(action.notes || [])]);
  if (notesSection) {
    sections.push(notesSection);
  }

  const exampleSection = formatExamples(action.examples || []);
  if (exampleSection) {
    sections.push(exampleSection);
  }

  return `${sections.join("\n\n")}\n`;
}

export function renderUnknownNounHelp(input, { registry, warnings = [] }) {
  return `${input ? `Unknown resource "${input}".\n\n` : ""}${renderGlobalHelp({
    registry,
    warnings,
  })}`;
}

export function renderUnknownActionHelp(noun, actionName, { warnings = [] } = {}) {
  return `Unknown action "${actionName}" for resource "${noun.name}".\n\n${renderNounHelp(
    noun,
    { warnings }
  )}`;
}
