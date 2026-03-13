function createAction(summary, flags = [], examples = []) {
  return {
    summary,
    flags,
    examples,
  };
}

export function createDefaultSchemaBundle(now = new Date().toISOString()) {
  return {
    downloadedAt: now,
    source: "transistor-docs",
    nouns: {
      user: {
        name: "user",
        summary: "Inspect the authenticated Transistor user",
        actions: {
          get: createAction("Retrieve details of the user account that is authenticating to the API.", [], [
            "node scripts/transistor-fm.mjs user get",
          ]),
        },
        fields: {
          id: { type: "string", required: true },
          name: { type: "string" },
          time_zone: { type: "string" },
          image_url: { type: "string" },
        },
        endpoints: ["GET /v1"],
      },
      shows: {
        name: "shows",
        summary: "List and inspect podcast shows",
        actions: {
          list: createAction(
            "Retrieve a paginated list of shows in descending order by updated date.",
            ["--page"],
            [
            "node scripts/transistor-fm.mjs shows list",
            ]
          ),
          get: createAction("Retrive a single show (podcast).", ["--show-id"], [
            "node scripts/transistor-fm.mjs shows get --show-id <id>",
          ]),
        },
        fields: {},
        endpoints: ["GET /v1/shows", "GET /v1/shows/:id"],
      },
      episodes: {
        name: "episodes",
        summary: "Create, inspect, and publish podcast episodes",
        actions: {
          list: createAction(
            "Retrieve a paginated list of episodes ordered by published date.",
            ["--show-id", "--page"],
            ["node scripts/transistor-fm.mjs episodes list --show-id <id>"]
          ),
          get: createAction("Retrieve a single podcast episode.", ["--episode-id"], [
            "node scripts/transistor-fm.mjs episodes get --episode-id <id>",
          ]),
          create: createAction(
            "Create a new draft episode for the specified show. Note that publishing an episode involves a separate endpoint.",
            ["--show-id", "--title"],
            ["node scripts/transistor-fm.mjs episodes create --show-id <id> --title \"Episode title\""]
          ),
          update: createAction(
            "Update a single podcast episode. Note that publishing or unpublishing an episode involves a separate endpoint.",
            ["--episode-id", "--title"],
            ["node scripts/transistor-fm.mjs episodes update --episode-id <id> --title \"New title\""]
          ),
        },
        fields: {},
        endpoints: [
          "GET /v1/episodes",
          "GET /v1/episodes/:id",
          "POST /v1/episodes",
          "PATCH /v1/episodes/:id",
        ],
      },
      subscribers: {
        name: "subscribers",
        summary: "Manage private podcast subscribers",
        actions: {
          list: createAction("Retrieve a list of all subscribers for a single private podcast.", ["--show-id", "--page"], [
            "node scripts/transistor-fm.mjs subscribers list --show-id <id>",
          ]),
          get: createAction("Retrieve a single private podcast subscriber.", ["--subscriber-id"], [
            "node scripts/transistor-fm.mjs subscribers get --subscriber-id <id>",
          ]),
          create: createAction(
            "Add a single subscriber to a private podcast, and send an optional instructional email.",
            ["--show-id", "--email"],
            ["node scripts/transistor-fm.mjs subscribers create --show-id <id> --email person@example.com"]
          ),
        },
        fields: {},
        endpoints: [
          "GET /v1/subscribers",
          "GET /v1/subscribers/:id",
          "POST /v1/subscribers",
        ],
      },
      webhooks: {
        name: "webhooks",
        summary: "Inspect and manage Transistor webhooks",
        actions: {
          list: createAction("Retrieve a list of webhooks for a show", ["--show-id"], [
            "node scripts/transistor-fm.mjs webhooks list --show-id <id>",
          ]),
          create: createAction(
            "Subscribe to a webhook with the given event name and show.",
            ["--show-id", "--url"],
            ["node scripts/transistor-fm.mjs webhooks create --show-id <id> --url https://example.com/hook"]
          ),
        },
        fields: {},
        endpoints: ["GET /v1/webhooks", "POST /v1/webhooks"],
      },
    },
  };
}

export async function loadSchemaBundle({
  now = new Date().toISOString(),
} = {}) {
  return {
    bundle: createDefaultSchemaBundle(now),
    warnings: [],
  };
}
