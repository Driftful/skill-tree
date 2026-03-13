import { WEBHOOK_EVENT_NAMES } from "../constants/webhooks.mjs";

const WEBHOOK_REFERENCE_NOTE =
  "Reference docs: references/api.md covers webhook endpoints, supported event names, and the 50-webhook account limit.";

const WEBHOOK_ID_FLAG = {
  name: "--id <webhook-id>",
  summary: "Webhook ID accepted by the API",
};

const SHOW_ID_FLAG = {
  name: "--show-id <id-or-slug>",
  summary: "Show ID or slug accepted by the API",
};

const EVENT_NAME_FLAG = {
  name: "--event-name <event-name>",
  summary: `Supported values: ${WEBHOOK_EVENT_NAMES.map((name) => `\`${name}\``).join(", ")}`,
};

const URL_FLAG = {
  name: "--url <value>",
  summary: "Destination URL that receives webhook deliveries",
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

function validateEventName(flags) {
  const eventName = getRequiredFlag(flags, "event-name", "`--event-name <event-name>`");
  if (!WEBHOOK_EVENT_NAMES.includes(eventName)) {
    throw new Error(
      `\`--event-name <event-name>\` must be one of ${WEBHOOK_EVENT_NAMES.map((name) => `\`${name}\``).join(", ")}.`
    );
  }
  return eventName;
}

function buildListQuery(flags = {}) {
  return {
    show_id: getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`"),
  };
}

function buildCreateBody(flags = {}) {
  return {
    show_id: getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`"),
    event_name: validateEventName(flags),
    url: getRequiredFlag(flags, "url", "`--url <value>`"),
  };
}

function renderWebhookListItem(resource = {}) {
  const id = resource?.id || "unknown";
  const eventName = resource?.attributes?.event_name || "unknown_event";
  const url = resource?.attributes?.url || "";

  return url ? `- ${id}  ${eventName} -> ${url}` : `- ${id}  ${eventName}`;
}

export function registerWebhooksNoun(registry) {
  registry.addNoun({
    name: "webhooks",
    summary: "Inspect and manage Transistor webhooks",
    notes: [
      "Use `--show-id` to scope list and create operations, and `--id` to delete one webhook.",
      `Supported event names: ${WEBHOOK_EVENT_NAMES.map((name) => `\`${name}\``).join(", ")}.`,
      "Transistor documents a maximum of 50 webhooks per user account.",
      "There is no separate get-one-webhook endpoint in the documented v1 surface.",
      WEBHOOK_REFERENCE_NOTE,
    ],
    endpoints: ["GET /v1/webhooks", "POST /v1/webhooks", "DELETE /v1/webhooks/:id"],
    actions: {
      list: {
        summary: "Retrieve a list of webhooks for a show",
        flags: ["--show-id <id-or-slug>"],
        selectorFlags: [SHOW_ID_FLAG],
        examples: [
          "node scripts/transistor-fm.mjs webhooks list --show-id 132543",
          "node scripts/transistor-fm.mjs webhooks list --show-id my-show-slug",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "GET",
            path: "webhooks",
            query: buildListQuery(args.flags),
          });

          return context.formatters.renderCollection(payload?.data || [], {
            meta: payload?.meta || {},
            renderItem: renderWebhookListItem,
          });
        },
      },
      create: {
        summary: "Subscribe to a webhook with the given event name and show.",
        flags: ["--show-id <id-or-slug>", "--event-name <event-name>", "--url <value>"],
        selectorFlags: [SHOW_ID_FLAG],
        writableFields: [EVENT_NAME_FLAG, URL_FLAG],
        notes: [
          "Event names are limited to the documented allowlist and are validated before any network request.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs webhooks create --show-id 132543 --event-name episode_created --url https://example.com/hooks/episodes",
          "node scripts/transistor-fm.mjs webhooks create --show-id my-show-slug --event-name subscriber_created --url https://example.com/hooks/subscribers",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "POST",
            path: "webhooks",
            body: buildCreateBody(args.flags),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      delete: {
        summary: "Unsubscribe from a webhook.",
        flags: ["--id <webhook-id>"],
        selectorFlags: [WEBHOOK_ID_FLAG],
        notes: [
          "Deletes the configured webhook subscription at `DELETE /v1/webhooks/:id`.",
        ],
        examples: [
          "node scripts/transistor-fm.mjs webhooks delete --id 88002",
        ],
        async run(args, context) {
          const webhookId = getRequiredFlag(args.flags, "id", "`--id <webhook-id>`");
          const payload = await context.httpClient.request({
            method: "DELETE",
            path: `webhooks/${encodeURIComponent(webhookId)}`,
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
