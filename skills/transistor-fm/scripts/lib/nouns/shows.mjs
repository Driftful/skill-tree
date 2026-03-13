const SHOW_REFERENCE_NOTE =
  "Reference docs: references/api.md covers show endpoints and large enum fields.";

const SHOW_ID_FLAG = {
  name: "--id <id-or-slug>",
  summary: "Show ID or slug accepted by the API",
};

const SHOW_FILTER_FLAGS = [
  {
    name: "--query <text>",
    summary: "Search by show title or related show metadata",
  },
  {
    name: "--private",
    summary: "Filter for private shows",
  },
  {
    name: "--page <number>",
    summary: "Pagination page number",
  },
  {
    name: "--per <number>",
    summary: "Results per page",
  },
];

const SHOW_ANALYTICS_DATE_RANGE_FLAGS = [
  {
    name: "--start-date <dd-mm-yyyy>",
    summary: "Optional range start. Must be paired with `--end-date`.",
  },
  {
    name: "--end-date <dd-mm-yyyy>",
    summary: "Optional range end. Must be paired with `--start-date`.",
  },
  {
    name: "--include <show>",
    summary: "Include the related show resource when the API supports it",
  },
];

const SHOW_WRITABLE_FIELDS = [
  {
    flag: "title",
    key: "title",
    name: "--title <value>",
    summary: "Podcast title",
    type: "string",
  },
  {
    flag: "author",
    key: "author",
    name: "--author <value>",
    summary: "Podcast author",
    type: "string",
  },
  {
    flag: "description",
    key: "description",
    name: "--description <value>",
    summary: "Podcast description",
    type: "string",
  },
  {
    flag: "category",
    key: "category",
    name: "--category <value>",
    summary: "Primary category; keep the inline help compact and use the reference doc for the full enum",
    type: "string",
  },
  {
    flag: "language",
    key: "language",
    name: "--language <value>",
    summary: "Spoken language code; see the reference doc for enum notes",
    type: "string",
  },
  {
    flag: "copyright",
    key: "copyright",
    name: "--copyright <value>",
    summary: "Copyright information",
    type: "string",
  },
  {
    flag: "explicit",
    key: "explicit",
    name: "--explicit <true|false>",
    summary: "Whether the podcast contains explicit content",
    type: "boolean",
  },
  {
    flag: "image-url",
    key: "image_url",
    name: "--image-url <value>",
    summary: "Podcast artwork image URL",
    type: "string",
  },
  {
    flag: "keywords",
    key: "keywords",
    name: "--keywords <value>",
    summary: "Comma-separated list of keywords",
    type: "string",
  },
  {
    flag: "owner-email",
    key: "owner_email",
    name: "--owner-email <value>",
    summary: "Podcast owner email",
    type: "string",
  },
  {
    flag: "secondary-category",
    key: "secondary_category",
    name: "--secondary-category <value>",
    summary: "Secondary category; see the reference doc for enum details",
    type: "string",
  },
  {
    flag: "show-type",
    key: "show_type",
    name: "--show-type <episodic|serial>",
    summary: "Publishing type",
    type: "string",
  },
  {
    flag: "time-zone",
    key: "time_zone",
    name: "--time-zone <value>",
    summary: "Publishing time zone; see the reference doc for enum details",
    type: "string",
  },
  {
    flag: "website",
    key: "website",
    name: "--website <value>",
    summary: "Podcast website URL",
    type: "string",
  },
];

const SHOW_READ_ONLY_FIELDS = [
  {
    name: "amazon_music",
    summary: "Amazon Music URL",
  },
  {
    name: "anghami",
    summary: "Anghami URL",
  },
  {
    name: "apple_podcasts",
    summary: "Apple Podcasts URL",
  },
  {
    name: "castbox",
    summary: "Castbox URL",
  },
  {
    name: "castro",
    summary: "Castro URL",
  },
  {
    name: "created_at",
    summary: "Timestamp of creation",
  },
  {
    name: "deezer",
    summary: "Deezer URL",
  },
  {
    name: "email_notifications",
    summary: "Private podcast email notifications enabled or disabled",
  },
  {
    name: "feed_url",
    summary: "Generated RSS feed URL",
  },
  {
    name: "fountain",
    summary: "Fountain URL",
  },
  {
    name: "gaana",
    summary: "Gaana URL",
  },
  {
    name: "goodpods",
    summary: "Goodpods URL",
  },
  {
    name: "iHeartRadio",
    summary: "iHeartRadio URL",
  },
  {
    name: "jiosaavn",
    summary: "JioSaavn URL",
  },
  {
    name: "metacast",
    summary: "Metacast URL",
  },
  {
    name: "multiple_seasons",
    summary: "Podcast has multiple seasons",
  },
  {
    name: "overcast",
    summary: "Overcast URL",
  },
  {
    name: "pandora",
    summary: "Pandora URL",
  },
  {
    name: "player_FM",
    summary: "Player FM URL",
  },
  {
    name: "playlist_limit",
    summary: "Playlist embed player episode limit",
  },
  {
    name: "pocket_casts",
    summary: "Pocket Casts URL",
  },
  {
    name: "podcast_addict",
    summary: "Podcast Addict URL",
  },
  {
    name: "slug",
    summary: "Stable slug returned by the API",
  },
  {
    name: "private",
    summary: "Read-only visibility attribute in the current CLI surface",
  },
  {
    name: "soundcloud",
    summary: "Soundcloud URL",
  },
  {
    name: "spotify",
    summary: "Spotify URL",
  },
  {
    name: "tuneIn",
    summary: "TuneIn URL",
  },
  {
    name: "updated_at",
    summary: "Timestamp of last update",
  },
];

const LIST_QUERY_KEYS = {
  private: "private",
  query: "query",
  page: "pagination[page]",
  per: "pagination[per]",
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

function validateAnalyticsDateRange(startDate, endDate) {
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

function buildShowAnalyticsQuery(flags = {}) {
  const startDate = getOptionalFlag(flags, "start-date");
  const endDate = getOptionalFlag(flags, "end-date");
  validateAnalyticsDateRange(startDate, endDate);

  const query = {};
  if (startDate !== undefined) {
    query.start_date = startDate;
    query.end_date = endDate;
  }

  const include = getOptionalFlag(flags, "include");
  if (include !== undefined) {
    const normalizedInclude = include.trim().toLowerCase();
    if (normalizedInclude !== "show") {
      throw new Error("`--include <relationship>` must be one of `show`.");
    }
    query["include[]"] = normalizedInclude;
  }

  return query;
}

function parseBooleanFlag(flags, name, label) {
  const value = getLastFlagValue(flags, name);
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (value === true) {
    return true;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }

  throw new Error(`${label} must be \`true\` or \`false\`.`);
}

function buildListQuery(flags = {}) {
  const query = {};

  for (const [flagName, queryName] of Object.entries(LIST_QUERY_KEYS)) {
    const value = flags[flagName];
    if (value === undefined || value === null || value === "") {
      continue;
    }
    query[queryName] = value;
  }

  return query;
}

function buildShowMutation(flags = {}) {
  const show = {};

  for (const field of SHOW_WRITABLE_FIELDS) {
    const label = `\`${field.name}\``;
    const value =
      field.type === "boolean"
        ? parseBooleanFlag(flags, field.flag, label)
        : getOptionalFlag(flags, field.flag);
    if (value === undefined || value === null || value === "") {
      continue;
    }
    show[field.key] = value;
  }

  return show;
}

function renderShowListItem(resource = {}) {
  const title = resource?.attributes?.title || resource?.attributes?.slug || "Untitled show";
  return `- ${resource?.id || "unknown"}  ${title}`;
}

export function registerShowsNoun(registry) {
  registry.addNoun({
    name: "shows",
    summary: "List and inspect podcast shows",
    notes: [
      "Use `--id` with either a show ID or slug for `get` and `update`.",
      SHOW_REFERENCE_NOTE,
    ],
    actions: {
      list: {
        summary: "Retrieve a paginated list of shows in descending order by updated date.",
        flags: ["--query <text>", "--private", "--page <number>", "--per <number>"],
        filterFlags: SHOW_FILTER_FLAGS,
        examples: [
          "node scripts/transistor-fm.mjs shows list",
          "node scripts/transistor-fm.mjs shows list --query caffeine --page 1 --per 5",
          "node scripts/transistor-fm.mjs shows list --private",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "GET",
            path: "shows",
            query: buildListQuery(args.flags),
          });

          return context.formatters.renderCollection(payload?.data || [], {
            meta: payload?.meta || {},
            renderItem: renderShowListItem,
          });
        },
      },
      get: {
        summary: "Retrive a single show (podcast).",
        flags: ["--id <id-or-slug>"],
        selectorFlags: [SHOW_ID_FLAG],
        readOnlyFields: SHOW_READ_ONLY_FIELDS,
        examples: [
          "node scripts/transistor-fm.mjs shows get --id 132543",
          "node scripts/transistor-fm.mjs shows get --id the-caffeine-show",
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "id", "`--id <id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `shows/${encodeURIComponent(showId)}`,
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      update: {
        summary: "Update a show with any or all of the following attributes.",
        flags: ["--id <id-or-slug>", "--title <value>"],
        selectorFlags: [SHOW_ID_FLAG],
        writableFields: SHOW_WRITABLE_FIELDS,
        readOnlyFields: SHOW_READ_ONLY_FIELDS,
        notes: ["Matches the documented Transistor show update fields."],
        examples: [
          'node scripts/transistor-fm.mjs shows update --id 132543 --title "Updated Title"',
          'node scripts/transistor-fm.mjs shows update --id the-caffeine-show --author "Updated Author"',
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "id", "`--id <id-or-slug>`");
          const show = buildShowMutation(args.flags);

          if (!Object.keys(show).length) {
            throw new Error(
              "Provide at least one writable field such as `--title`, `--author`, `--description`, `--category`, `--language`, `--explicit`, or `--show-type`."
            );
          }

          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `shows/${encodeURIComponent(showId)}`,
            body: { show },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      analytics: {
        summary: "Retrieve analytics of downloads per day for an entire podcast. Defaults to the last 14 days.",
        flags: [
          "--id <id-or-slug>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <show>",
        ],
        selectorFlags: [SHOW_ID_FLAG],
        filterFlags: SHOW_ANALYTICS_DATE_RANGE_FLAGS,
        notes: [
          "Defaults to the last 14 days when no date range is provided.",
          "Both date flags must use the `dd-mm-yyyy` format documented by the API.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs shows analytics --id 132543",
          "node scripts/transistor-fm.mjs shows analytics --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs shows analytics --id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026 --include show",
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "id", "`--id <id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/${encodeURIComponent(showId)}`,
            query: buildShowAnalyticsQuery(args.flags),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
