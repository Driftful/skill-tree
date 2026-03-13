import fs from "node:fs/promises";
import path from "node:path";

const EPISODE_ID_FLAG = {
  name: "--id <episode-id>",
  summary: "Episode ID accepted by the API",
};

const SHOW_ID_FLAG = {
  name: "--show-id <id-or-slug>",
  summary: "Show ID or slug accepted by the API",
};

const EPISODE_INCLUDE_FLAG = {
  name: "--include <show>",
  summary: "Include the related show resource when the API supports it",
};

const LIST_FILTER_FLAGS = [
  SHOW_ID_FLAG,
  {
    name: "--status <draft|scheduled|published>",
    summary: "Filter by publish state",
  },
  {
    name: "--order <asc|desc>",
    summary: "Sort oldest first (`asc`) or newest first (`desc`)",
  },
  {
    name: "--query <text>",
    summary: "Search by episode title or related metadata",
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

const EPISODE_MUTATION_FIELDS = [
  {
    flag: "title",
    key: "title",
    name: "--title <value>",
    summary: "Episode title",
    type: "string",
  },
  {
    flag: "description",
    key: "description",
    name: "--description <value>",
    summary: "Longer episode description; HTML is allowed by the API",
    type: "string",
  },
  {
    flag: "transcript-text",
    key: "transcript_text",
    name: "--transcript-text <value>",
    summary: "Full transcript text passed directly to the API",
    type: "string",
  },
  {
    flag: "audio-url",
    key: "audio_url",
    name: "--audio-url <value>",
    summary: "Publicly reachable audio URL or the `audio_url` returned by `upload`",
    type: "string",
  },
  {
    flag: "author",
    key: "author",
    name: "--author <value>",
    summary: "Episode author",
    type: "string",
  },
  {
    flag: "explicit",
    key: "explicit",
    name: "--explicit <true|false>",
    summary: "Whether the episode contains explicit content",
    type: "boolean",
  },
  {
    flag: "image-url",
    key: "image_url",
    name: "--image-url <value>",
    summary: "Episode artwork image URL",
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
    flag: "number",
    key: "number",
    name: "--number <integer>",
    summary: "Episode number",
    type: "integer",
  },
  {
    flag: "season",
    key: "season",
    name: "--season <integer>",
    summary: "Season number",
    type: "integer",
  },
  {
    flag: "type",
    key: "type",
    name: "--type <full|trailer|bonus>",
    summary: "Episode type",
    type: "string",
  },
  {
    flag: "alternate-url",
    key: "alternate_url",
    name: "--alternate-url <value>",
    summary: "Alternate episode URL overriding the share URL",
    type: "string",
  },
  {
    flag: "video-url",
    key: "video_url",
    name: "--video-url <value>",
    summary: "YouTube video URL for episode pages",
    type: "string",
  },
  {
    flag: "email-notifications",
    key: "email_notifications",
    name: "--email-notifications <true|false>",
    summary: "Override private-podcast email notifications for the episode",
    type: "boolean",
  },
  {
    flag: "increment-number",
    key: "increment_number",
    name: "--increment-number <true|false>",
    summary: "Automatically set the next episode number for the current season",
    type: "boolean",
    createOnly: true,
  },
];

const EPISODE_READ_ONLY_FIELDS = [
  {
    name: "audio_processing",
    summary: "Denotes processing of audio after creating or updating the audio URL",
  },
  {
    name: "created_at",
    summary: "Timestamp of creation",
  },
  {
    name: "duration",
    summary: "Duration of episode in seconds",
  },
  {
    name: "duration_in_mmss",
    summary: "Duration of episode in minutes and seconds",
  },
  {
    name: "embed_html",
    summary: "Embeddable audio player HTML",
  },
  {
    name: "embed_html_dark",
    summary: "Dark theme of the embeddable audio player HTML",
  },
  {
    name: "formatted_description",
    summary: "HTML episode description including dynamic content like chapters and supporters",
  },
  {
    name: "formatted_published_at",
    summary: "Formatted version of the publish timestamp",
  },
  {
    name: "formatted_summary",
    summary: "Formatted episode summary short description",
  },
  {
    name: "media_url",
    summary: "Trackable audio MP3 URL",
  },
  {
    name: "status",
    summary: "Current publish state returned by the API",
  },
  {
    name: "published_at",
    summary: "Episode publish datetime in the show's time zone",
  },
  {
    name: "share_url",
    summary: "Generated share URL for the episode",
  },
  {
    name: "transcript_url",
    summary: "Generated transcript URL when Transistor exposes one",
  },
  {
    name: "transcripts",
    summary: "Array of URLs to AI transcription formats",
  },
  {
    name: "slug",
    summary: "Slugified episode title used in Transistor websites",
  },
  {
    name: "updated_at",
    summary: "Timestamp of last update",
  },
];

const TRANSCRIPT_FILE_FIELD = {
  name: "--transcript-file <path>",
  summary: "Read transcript text from a local Markdown file",
};

function withTranscriptFileField(fields) {
  const transcriptTextIndex = fields.findIndex((field) => field.name === "--transcript-text <value>");
  if (transcriptTextIndex === -1) {
    return [...fields, TRANSCRIPT_FILE_FIELD];
  }

  return [
    ...fields.slice(0, transcriptTextIndex + 1),
    TRANSCRIPT_FILE_FIELD,
    ...fields.slice(transcriptTextIndex + 1),
  ];
}

const EPISODE_CREATE_WRITABLE_FIELDS = [
  ...withTranscriptFileField(EPISODE_MUTATION_FIELDS.map(({ name, summary }) => ({
    name,
    summary,
  }))),
];

const EPISODE_UPDATE_WRITABLE_FIELDS = [
  ...withTranscriptFileField(
    EPISODE_MUTATION_FIELDS.filter((field) => !field.createOnly).map(({ name, summary }) => ({
      name,
      summary,
    }))
  ),
];

const PUBLISH_FIELDS = [
  {
    name: "--published-at <value>",
    summary: "Optional publish timestamp forwarded to the API when provided",
  },
];

const EPISODES_ANALYTICS_DATE_RANGE_FLAGS = [
  {
    name: "--start-date <dd-mm-yyyy>",
    summary: "Optional range start. Must be paired with `--end-date`.",
  },
  {
    name: "--end-date <dd-mm-yyyy>",
    summary: "Optional range end. Must be paired with `--start-date`.",
  },
];

const EPISODE_ANALYTICS_INCLUDE_FLAG = {
  name: "--include <episode>",
  summary: "Include the related episode resource when the API supports it",
};

const EPISODES_ANALYTICS_INCLUDE_FLAG = {
  name: "--include <show>",
  summary: "Include the related show resource when the API supports it",
};

const UPLOAD_FLAGS = ["--file <path>"];

const LIST_QUERY_KEYS = {
  "show-id": "show_id",
  status: "status",
  order: "order",
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

function parseIntegerFlag(flags, name, label) {
  const value = getLastFlagValue(flags, name);
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (!/^-?\d+$/u.test(String(value).trim())) {
    throw new Error(`${label} must be an integer.`);
  }

  return Number.parseInt(String(value), 10);
}

function getRequiredEnumFlag(flags, name, allowedValues, label) {
  const value = getRequiredFlag(flags, name, label).toLowerCase();
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${label} must be one of ${allowedValues.map((entry) => `\`${entry}\``).join(", ")}.`
    );
  }
  return value;
}

function buildListQuery(flags = {}) {
  const query = {};

  for (const [flagName, queryName] of Object.entries(LIST_QUERY_KEYS)) {
    const value = getLastFlagValue(flags, flagName);
    if (value === undefined || value === null || value === "") {
      continue;
    }
    query[queryName] = value;
  }

  return query;
}

function buildEpisodeGetQuery(flags = {}) {
  const include = getOptionalFlag(flags, "include");
  if (include === undefined) {
    return undefined;
  }

  const normalizedInclude = include.trim().toLowerCase();
  if (normalizedInclude !== "show") {
    throw new Error("`--include <show>` only accepts `show` for this endpoint.");
  }

  return {
    "include[]": normalizedInclude,
  };
}

function coerceEpisodeFieldValue(field, flags) {
  const label = `\`${field.name}\``;
  if (field.type === "boolean") {
    return parseBooleanFlag(flags, field.flag, label);
  }
  if (field.type === "integer") {
    return parseIntegerFlag(flags, field.flag, label);
  }
  return getOptionalFlag(flags, field.flag);
}

function buildEpisodeMutation(flags = {}, { includeShowId = false, includeCreateOnly = false } = {}) {
  const episode = {};

  if (includeShowId) {
    episode.show_id = getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`");
  }

  for (const field of EPISODE_MUTATION_FIELDS) {
    if (field.createOnly && !includeCreateOnly) {
      continue;
    }
    const value = coerceEpisodeFieldValue(field, flags);
    if (value === undefined) {
      continue;
    }
    episode[field.key] = value;
  }

  return episode;
}

function requireMeaningfulMutation(episode, { includeShowId = false } = {}) {
  const keys = Object.keys(episode).filter((key) => (includeShowId ? key !== "show_id" : true));
  if (keys.length) {
    return;
  }

  throw new Error(
    "Provide at least one writable field such as `--title`, `--description`, `--author`, `--explicit`, `--number`, `--season`, `--transcript-text`, `--transcript-file`, or `--audio-url`."
  );
}

function validateEpisodeMutation(episode) {
  if (episode.number !== undefined && episode.number <= 0) {
    throw new Error("`--number <integer>` must be greater than 0.");
  }
}

async function applyTranscriptInput(episode, flags = {}) {
  const transcriptText = getOptionalFlag(flags, "transcript-text");
  const transcriptFile = getOptionalFlag(flags, "transcript-file");

  if (transcriptText !== undefined && transcriptFile !== undefined) {
    throw new Error(
      "Use either `--transcript-text <value>` or `--transcript-file <path>`, not both."
    );
  }

  if (transcriptFile !== undefined) {
    const transcriptTextFromFile = await readTextFile(transcriptFile, "transcript file");
    episode.transcript_text = normalizeMarkdownTranscript(transcriptTextFromFile);
  }
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

function buildEpisodeAnalyticsQuery(flags = {}, { allowedIncludes = [] } = {}) {
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

function buildPublishMutation(status, flags = {}) {
  const publishedAt = getOptionalFlag(flags, "published-at");

  return {
    status,
    ...(status === "draft" || !publishedAt ? {} : { published_at: publishedAt }),
  };
}

function renderEpisodeListItem(resource = {}) {
  const title = resource?.attributes?.title || "Untitled episode";
  return `- ${resource?.id || "unknown"}  ${title}`;
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

async function readUploadFile(filePath) {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    throw new Error(`Unable to read \`${filePath}\`: ${error?.message || "Unknown error."}`);
  }
}

async function readTextFile(filePath, label = "file") {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read ${label} \`${filePath}\`: ${error?.message || "Unknown error."}`);
  }
}

function normalizeMarkdownTranscript(text) {
  const codeSpans = [];
  const protectedText = String(text).replace(/`[^`\n]*`/gu, (match) => {
    const index = codeSpans.push(match) - 1;
    return `ZZCODETOKEN${index}ZZ`;
  });

  const normalizedText = protectedText
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/(\*\*|__)(.*?)\1/gu, "$2")
    .replace(/(\*|_)([^*_]+?)\1/gu, "$2");

  return normalizedText.replace(/ZZCODETOKEN(\d+)ZZ/gu, (_, index) => codeSpans[Number(index)]);
}

function buildUploadResult(audioUrl, renderResource) {
  return renderResource({
    attributes: {
      audio_url: audioUrl,
    },
  });
}

export function registerEpisodesNoun(registry) {
  registry.addNoun({
    name: "episodes",
    summary: "Create, inspect, and publish podcast episodes",
    notes: [
      "Use `--id` for `get`, `update`, and `publish`; use `--show-id` to scope `list` or create a new episode.",
      "Transcript text is supported directly on `create` and `update` via `--transcript-text` or `--transcript-file`.",
      "Use `upload` for local audio files; it authorizes and performs the presigned PUT before returning the reusable `audio_url`.",
    ],
    endpoints: [
      "GET /v1/episodes",
      "GET /v1/episodes/:id",
      "POST /v1/episodes",
      "PATCH /v1/episodes/:id",
      "PATCH /v1/episodes/:id/publish",
      "GET /v1/episodes/authorize_upload",
    ],
    actions: {
      list: {
        summary: "Retrieve a paginated list of episodes ordered by published date.",
        flags: [
          "--show-id <id-or-slug>",
          "--status <draft|scheduled|published>",
          "--order <asc|desc>",
          "--query <text>",
          "--page <number>",
          "--per <number>",
        ],
        filterFlags: LIST_FILTER_FLAGS,
        examples: [
          "node scripts/transistor-fm.mjs episodes list --show-id 132543",
          "node scripts/transistor-fm.mjs episodes list --show-id my-show-slug --status draft --order asc",
          "node scripts/transistor-fm.mjs episodes list --query transcript --page 1 --per 5",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "GET",
            path: "episodes",
            query: buildListQuery(args.flags),
          });

          return context.formatters.renderCollection(payload?.data || [], {
            meta: payload?.meta || {},
            renderItem: renderEpisodeListItem,
          });
        },
      },
      get: {
        summary: "Retrieve a single podcast episode.",
        flags: ["--id <episode-id>", "--include <show>"],
        selectorFlags: [EPISODE_ID_FLAG],
        filterFlags: [EPISODE_INCLUDE_FLAG],
        readOnlyFields: EPISODE_READ_ONLY_FIELDS,
        examples: [
          "node scripts/transistor-fm.mjs episodes get --id 3056098",
          "node scripts/transistor-fm.mjs episodes get --id 3056098 --include show",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const query = buildEpisodeGetQuery(args.flags);
          const payload = await context.httpClient.request({
            method: "GET",
            path: `episodes/${encodeURIComponent(episodeId)}`,
            ...(query ? { query } : {}),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      create: {
        summary: "Create a new draft episode for the specified show. Note that publishing an episode involves a separate endpoint.",
        flags: ["--show-id <id-or-slug>", "--title <value>"],
        selectorFlags: [SHOW_ID_FLAG],
        writableFields: EPISODE_CREATE_WRITABLE_FIELDS,
        examples: [
          'node scripts/transistor-fm.mjs episodes create --show-id 132543 --title "Great episode"',
          'node scripts/transistor-fm.mjs episodes create --show-id my-show-slug --description "Longer episode notes" --transcript-text "Hello world"',
          "node scripts/transistor-fm.mjs episodes create --show-id my-show-slug --transcript-file ./transcript.md",
        ],
        async run(args, context) {
          const episode = buildEpisodeMutation(args.flags, {
            includeShowId: true,
            includeCreateOnly: true,
          });
          await applyTranscriptInput(episode, args.flags);
          requireMeaningfulMutation(episode, { includeShowId: true });
          validateEpisodeMutation(episode);

          const payload = await context.httpClient.request({
            method: "POST",
            path: "episodes",
            body: { episode },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      update: {
        summary: "Update a single podcast episode. Note that publishing or unpublishing an episode involves a separate endpoint.",
        flags: ["--id <episode-id>", "--title <value>"],
        selectorFlags: [EPISODE_ID_FLAG],
        writableFields: EPISODE_UPDATE_WRITABLE_FIELDS,
        readOnlyFields: EPISODE_READ_ONLY_FIELDS,
        examples: [
          'node scripts/transistor-fm.mjs episodes update --id 3056098 --title "Updated title"',
          'node scripts/transistor-fm.mjs episodes update --id 3056098 --audio-url https://cdn.example.com/audio.mp3 --transcript-text "Updated transcript"',
          "node scripts/transistor-fm.mjs episodes update --id 3056098 --transcript-file ./transcript.md",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const episode = buildEpisodeMutation(args.flags);
          await applyTranscriptInput(episode, args.flags);
          requireMeaningfulMutation(episode);
          validateEpisodeMutation(episode);

          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `episodes/${encodeURIComponent(episodeId)}`,
            body: { episode },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      publish: {
        summary: "Publish a single episode now or in the past, schedule for the future, or revert to a draft.",
        flags: ["--id <episode-id>", "--published-at <value>"],
        selectorFlags: [EPISODE_ID_FLAG],
        writableFields: PUBLISH_FIELDS,
        examples: [
          "node scripts/transistor-fm.mjs episodes publish --id 3056098",
          'node scripts/transistor-fm.mjs episodes publish --id 3056098 --published-at "2026-03-11 09:00:00"',
        ],
        notes: [
          "Use this action only for publish-state changes. Content edits belong in `episodes update`.",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const episode = buildPublishMutation("published", args.flags);
          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `episodes/${encodeURIComponent(episodeId)}/publish`,
            body: { episode },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      schedule: {
        summary: "Publish a single episode now or in the past, schedule for the future, or revert to a draft.",
        flags: ["--id <episode-id>", "--published-at <value>"],
        selectorFlags: [EPISODE_ID_FLAG],
        writableFields: PUBLISH_FIELDS,
        examples: [
          'node scripts/transistor-fm.mjs episodes schedule --id 3056098 --published-at "2026-03-15 09:00:00"',
        ],
        notes: [
          "Use this action only for publish-state changes. Content edits belong in `episodes update`.",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const episode = buildPublishMutation("scheduled", args.flags);
          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `episodes/${encodeURIComponent(episodeId)}/publish`,
            body: { episode },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      unpublish: {
        summary: "Publish a single episode now or in the past, schedule for the future, or revert to a draft.",
        flags: ["--id <episode-id>"],
        selectorFlags: [EPISODE_ID_FLAG],
        examples: [
          "node scripts/transistor-fm.mjs episodes unpublish --id 3056098",
        ],
        notes: [
          "Use this action only for publish-state changes. Content edits belong in `episodes update`.",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const episode = buildPublishMutation("draft", args.flags);
          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `episodes/${encodeURIComponent(episodeId)}/publish`,
            body: { episode },
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      analytics: {
        summary: "Retrieve analytics of downloads per day for a single episode. Defaults to the last 14 days.",
        flags: [
          "--id <episode-id>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <episode>",
        ],
        selectorFlags: [EPISODE_ID_FLAG],
        filterFlags: [...EPISODES_ANALYTICS_DATE_RANGE_FLAGS, EPISODE_ANALYTICS_INCLUDE_FLAG],
        notes: [
          "Defaults to the last 14 days when no date range is provided.",
          "Both date flags must use the `dd-mm-yyyy` format documented by the API.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs episodes analytics --id 3056098",
          "node scripts/transistor-fm.mjs episodes analytics --id 3056098 --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs episodes analytics --id 3056098 --start-date 01-03-2026 --end-date 07-03-2026 --include episode",
        ],
        async run(args, context) {
          const episodeId = getRequiredFlag(args.flags, "id", "`--id <episode-id>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/episodes/${encodeURIComponent(episodeId)}`,
            query: buildEpisodeAnalyticsQuery(args.flags, {
              allowedIncludes: ["episode"],
            }),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      "analytics-all": {
        summary: "Retrieve analytics of downloads per day for all episodes of a podcast. Defaults to the last 7 days.",
        flags: [
          "--show-id <id-or-slug>",
          "--start-date <dd-mm-yyyy>",
          "--end-date <dd-mm-yyyy>",
          "--include <show>",
        ],
        selectorFlags: [SHOW_ID_FLAG],
        filterFlags: [...EPISODES_ANALYTICS_DATE_RANGE_FLAGS, EPISODES_ANALYTICS_INCLUDE_FLAG],
        notes: [
          "Defaults to the last 7 days when no date range is provided.",
          "Both date flags must use the `dd-mm-yyyy` format documented by the API.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs episodes analytics-all --show-id 132543",
          "node scripts/transistor-fm.mjs episodes analytics-all --show-id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026",
          "node scripts/transistor-fm.mjs episodes analytics-all --show-id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026 --include show",
        ],
        async run(args, context) {
          const showId = getRequiredFlag(args.flags, "show-id", "`--show-id <id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `analytics/${encodeURIComponent(showId)}/episodes`,
            query: buildEpisodeAnalyticsQuery(args.flags, {
              allowedIncludes: ["show"],
            }),
          });

          return renderEpisodesAnalytics(payload?.data || {});
        },
      },
      upload: {
        summary: "Authorize a URL for uploading a local audio file to be used when creating or updating an episode.",
        flags: UPLOAD_FLAGS,
        notes: [
          "The CLI derives the API `filename` from the local path, uploads the file with the returned `content_type`, and prints the resulting `audio_url`.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs episodes upload --file ./Episode1.mp3",
        ],
        async run(args, context) {
          const filePath = getRequiredFlag(args.flags, "file", "`--file <path>`");
          const filename = path.basename(filePath);
          if (!filename || filename === "." || filename === path.sep) {
            throw new Error("`--file <path>` must point to a local file.");
          }

          const fileBody = await readUploadFile(filePath);
          const payload = await context.httpClient.request({
            method: "GET",
            path: "episodes/authorize_upload",
            query: { filename },
          });

          const attributes = payload?.data?.attributes || {};
          const uploadUrl = attributes.upload_url;
          const contentType = attributes.content_type;
          const audioUrl = attributes.audio_url;

          if (!uploadUrl || !contentType || !audioUrl) {
            throw new Error("Authorize-upload did not return `upload_url`, `content_type`, and `audio_url`.");
          }

          await context.httpClient.upload({
            url: uploadUrl,
            contentType,
            body: fileBody,
          });

          return buildUploadResult(audioUrl, context.formatters.renderResource);
        },
      },
    },
  });
}
