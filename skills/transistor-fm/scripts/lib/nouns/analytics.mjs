const ANALYTICS_REFERENCE_NOTE =
  "Reference docs: references/api.md covers analytics endpoint routing, date-range rules, and include support.";

const SHOW_ID_FLAG = {
  name: "--id <show-id-or-slug>",
  summary: "Show ID or slug accepted by the API",
};

const EPISODE_ID_FLAG = {
  name: "--id <episode-id-or-slug>",
  summary: "Episode ID or slug accepted by the API",
};

const DATE_RANGE_FLAGS = [
  {
    name: "--start-date <dd-mm-yyyy>",
    summary: "Optional range start. Must be paired with `--end-date`.",
  },
  {
    name: "--end-date <dd-mm-yyyy>",
    summary: "Optional range end. Must be paired with `--start-date`.",
  },
];

const SHOW_INCLUDE_FLAG = {
  name: "--include <show>",
  summary: "Include the related show resource when the API supports it",
};

const EPISODE_INCLUDE_FLAG = {
  name: "--include <episode>",
  summary: "Include the related episode resource when the API supports it",
};

function getLastFlagValue(flags, name) {
  const value = flags?.[name];
  return Array.isArray(value) ? value[value.length - 1] : value;
}

function getRequiredFlag(flags, name, label) {
  const value = getLastFlagValue(flags, name);
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required ${label}.`);
  }
  return String(value);
}

function getOptionalFlag(flags, name) {
  const value = getLastFlagValue(flags, name);
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return String(value);
}

function normalizeInclude(value) {
  return String(value || "").trim().toLowerCase();
}

function validateDateRange(startDate, endDate) {
  if ((startDate && !endDate) || (!startDate && endDate)) {
    throw new Error(
      "Provide `--start-date <dd-mm-yyyy>` and `--end-date <dd-mm-yyyy>` together."
    );
  }

  for (const [label, value] of [
    ["`--start-date <dd-mm-yyyy>`", startDate],
    ["`--end-date <dd-mm-yyyy>`", endDate],
  ]) {
    if (value === undefined) {
      continue;
    }

    if (!/^\d{2}-\d{2}-\d{4}$/u.test(value)) {
      throw new Error(`${label} must use the \`dd-mm-yyyy\` format.`);
    }
  }
}

function buildAnalyticsQuery(flags = {}, { allowedIncludes = [] } = {}) {
  const startDate = getOptionalFlag(flags, "start-date");
  const endDate = getOptionalFlag(flags, "end-date");
  validateDateRange(startDate, endDate);

  const query = {};
  if (startDate !== undefined) {
    query.start_date = startDate;
    query.end_date = endDate;
  }

  const include = getOptionalFlag(flags, "include");
  if (include !== undefined) {
    const normalizedInclude = normalizeInclude(include);
    if (!allowedIncludes.includes(normalizedInclude)) {
      throw new Error(
        `\`--include <relationship>\` must be one of ${allowedIncludes
          .map((entry) => `\`${entry}\``)
          .join(", ")}.`
      );
    }
    query["include[]"] = normalizedInclude;
  }

  return query;
}

function renderEpisodesAnalytics(resource = {}) {
  const lines = [];
  const episodes = Array.isArray(resource?.attributes?.episodes) ? resource.attributes.episodes : [];

  if (resource.id !== undefined) {
    lines.push(`id: ${resource.id}`);
  }

  if (resource.type !== undefined) {
    lines.push(`type: ${resource.type}`);
  }

  lines.push(`episodes_count: ${episodes.length}`);

  if (!episodes.length) {
    lines.push("episodes: []");
    return `${lines.join("\n")}\n`;
  }

  lines.push("episodes:");
  for (const episode of episodes) {
    const dailyPoints = Array.isArray(episode?.downloads) ? episode.downloads.length : 0;
    lines.push(
      `- ${episode?.id || "unknown"}  ${episode?.title || "Untitled episode"} (${dailyPoints} daily points)`
    );
  }

  return `${lines.join("\n")}\n`;
}

export function registerAnalyticsNoun(registry) {
  registry.addNoun({
    name: "analytics",
    summary: "Inspect show and episode analytics",
    notes: [
      "Use `show` for `GET /v1/analytics/:id`, `episodes` for `GET /v1/analytics/:id/episodes`, and `episode` for `GET /v1/analytics/episodes/:id`.",
      "If you pass one date flag you must pass both, and both must use the `dd-mm-yyyy` format documented by the API.",
      "Use `--include` only when you need related resources; keep sparse fieldsets in the reference docs instead of the default help output.",
      ANALYTICS_REFERENCE_NOTE,
    ],
    endpoints: [
      "GET /v1/analytics/:id",
      "GET /v1/analytics/:id/episodes",
      "GET /v1/analytics/episodes/:id",
    ],
    actions: {
      show: {
        summary: "Fetch show-wide downloads per day",
        flags: [
          "--id <show-id-or-slug>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <show>",
        ],
        selectorFlags: [SHOW_ID_FLAG],
        filterFlags: [...DATE_RANGE_FLAGS, SHOW_INCLUDE_FLAG],
        notes: [
          "Defaults to the last 14 days when no date range is provided.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs analytics show --id 132543",
          "node scripts/transistor-fm.mjs analytics show --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs analytics show --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026 --include show",
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "id", "`--id <show-id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/${encodeURIComponent(showId)}`,
            query: buildAnalyticsQuery(args.flags, {
              allowedIncludes: ["show"],
            }),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      episodes: {
        summary: "Fetch downloads per day for all episodes in one show",
        flags: [
          "--id <show-id-or-slug>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <show>",
        ],
        selectorFlags: [SHOW_ID_FLAG],
        filterFlags: [...DATE_RANGE_FLAGS, SHOW_INCLUDE_FLAG],
        notes: [
          "Defaults to the last 7 days when no date range is provided.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs analytics episodes --id 132543",
          "node scripts/transistor-fm.mjs analytics episodes --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs analytics episodes --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026 --include show",
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "id", "`--id <show-id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/${encodeURIComponent(showId)}/episodes`,
            query: buildAnalyticsQuery(args.flags, {
              allowedIncludes: ["show"],
            }),
          });

          return renderEpisodesAnalytics(payload?.data || {});
        },
      },
      episode: {
        summary: "Fetch downloads per day for one episode",
        flags: [
          "--id <episode-id-or-slug>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <episode>",
        ],
        selectorFlags: [EPISODE_ID_FLAG],
        filterFlags: [...DATE_RANGE_FLAGS, EPISODE_INCLUDE_FLAG],
        notes: [
          "Defaults to the last 14 days when no date range is provided.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs analytics episode --id 3056098",
          "node scripts/transistor-fm.mjs analytics episode --id 3056098 --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs analytics episode --id 3056098 --start-date 01-03-2026 --end-date 07-03-2026 --include episode",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/episodes/${encodeURIComponent(episodeId)}`,
            query: buildAnalyticsQuery(args.flags, {
              allowedIncludes: ["episode"],
            }),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
