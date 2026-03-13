function formatValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatListHeader(meta = {}) {
  const currentPage = meta.currentPage;
  const totalPages = meta.totalPages;
  const totalCount = meta.totalCount;

  if (
    currentPage !== undefined &&
    totalPages !== undefined &&
    totalCount !== undefined
  ) {
    return `Page ${formatValue(currentPage)} of ${formatValue(totalPages)} (${formatValue(
      totalCount
    )} total)`;
  }

  return "";
}

function defaultRenderListItem(resource = {}) {
  const id = resource.id !== undefined ? formatValue(resource.id) : "unknown";
  const attributes = resource.attributes || {};
  const label =
    attributes.title ||
    attributes.name ||
    attributes.slug ||
    attributes.email ||
    formatValue(resource.type || "resource");

  return `- ${id}  ${label}`;
}

export function renderResource(resource = {}) {
  const lines = [];

  if (resource.id !== undefined) {
    lines.push(`id: ${formatValue(resource.id)}`);
  }

  if (resource.type !== undefined) {
    lines.push(`type: ${formatValue(resource.type)}`);
  }

  for (const [key, value] of Object.entries(resource.attributes || {})) {
    lines.push(`${key}: ${formatValue(value)}`);
  }

  return `${lines.join("\n")}\n`;
}

export function renderCollection(resources = [], { meta = {}, renderItem } = {}) {
  const items = Array.isArray(resources) ? resources : [];
  const lines = [];
  const header = formatListHeader(meta);

  if (header) {
    lines.push(header);
  }

  if (header && items.length) {
    lines.push("");
  }

  if (!items.length) {
    lines.push("No results.");
    return `${lines.join("\n")}\n`;
  }

  for (const item of items) {
    lines.push(typeof renderItem === "function" ? renderItem(item) : defaultRenderListItem(item));
  }

  return `${lines.join("\n")}\n`;
}
