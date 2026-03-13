const SUBSCRIBER_REFERENCE_NOTE =
  "Reference docs: references/api.md covers subscriber list, batch create, update, and delete workflows.";

const SUBSCRIBER_ID_FLAG = {
  name: "--id <subscriber-id>",
  summary: "Subscriber ID accepted by the API",
};

const SHOW_ID_FLAG = {
  name: "--show-id <id-or-slug>",
  summary: "Show ID or slug accepted by the API",
};

const QUERY_FLAG = {
  name: "--query <text>",
  summary: "Search subscribers by email address",
};

const PAGE_FLAG = {
  name: "--page <number>",
  summary: "Pagination page number",
};

const PER_FLAG = {
  name: "--per <number>",
  summary: "Results per page",
};

const EMAIL_FLAG = {
  name: "--email <value>",
  summary: "Subscriber email address",
};

const EMAILS_FLAG = {
  name: "--emails <value1,value2>",
  summary: "Comma-separated email list normalized into the API's `emails[]` batch input",
};

const SKIP_WELCOME_EMAIL_FLAG = {
  name: "--skip-welcome-email",
  summary: "Default: false. Do not send the instructional welcome email",
};

const DRY_RUN_FLAG = {
  name: "--dry-run",
  summary: "Print the planned destructive request without revoking subscriber access",
};

const SUBSCRIBER_FILTER_FLAGS = [SHOW_ID_FLAG, QUERY_FLAG, PAGE_FLAG, PER_FLAG];

const SUBSCRIBER_READ_ONLY_FIELDS = [
  {
    name: "created_at",
    summary: "Timestamp of creation",
  },
  {
    name: "status",
    summary: "Current access status returned by the API",
  },
  {
    name: "feed_url",
    summary: "Private subscriber feed URL",
  },
  {
    name: "has_downloads",
    summary: "Subscriber has downloaded at least one episode",
  },
  {
    name: "subscribe_url",
    summary: "Subscriber-facing subscribe URL",
  },
  {
    name: "last_notified_at",
    summary: "Last welcome or notification timestamp returned by the API",
  },
  {
    name: "updated_at",
    summary: "Timestamp of last update",
  },
];

const LIST_QUERY_KEYS = {
  "show-id": "show_id",
  query: "query",
  page: "pagination[page]",
  per: "pagination[per]",
};

function getLastFlagValue(flags, name) {
  const value = flags?.[name];
  return Array.isArray(value) ? value[value.length - 1] : value;
}

function getFlagValues(flags, name) {
  const value = flags?.[name];
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value.map((entry) => String(entry)) : [String(value)];
}

function hasFlag(flags, name) {
  return Object.prototype.hasOwnProperty.call(flags || {}, name);
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

function buildListQuery(flags = {}) {
  const query = {};

  for (const [flagName, queryName] of Object.entries(LIST_QUERY_KEYS)) {
    const value = getOptionalFlag(flags, flagName);
    if (value === undefined) {
      continue;
    }
    query[queryName] = value;
  }

  return query;
}

function normalizeBatchEmails(flags = {}) {
  const repeatedEmails = getFlagValues(flags, "email")
    .map((value) => value.trim())
    .filter(Boolean);
  const commaSeparatedEmails = getFlagValues(flags, "emails")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  const emails = [...repeatedEmails, ...commaSeparatedEmails];

  if (!emails.length) {
    throw new Error(
      "Provide at least one email via `--email <value>` or `--emails <value1,value2>`."
    );
  }

  return emails;
}

function buildCreateBody(flags = {}) {
  return {
    show_id: getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`"),
    email: getRequiredFlag(flags, "email", "`--email <value>`"),
    skip_welcome_email: hasFlag(flags, "skip-welcome-email"),
  };
}

function buildCreateBatchBody(flags = {}) {
  return {
    show_id: getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`"),
    emails: normalizeBatchEmails(flags),
    skip_welcome_email: hasFlag(flags, "skip-welcome-email"),
  };
}

function buildUpdateBody(flags = {}) {
  return {
    subscriber: {
      email: getRequiredFlag(flags, "email", "`--email <value>`"),
    },
  };
}

function buildDeleteByEmailBody(flags = {}) {
  return {
    show_id: getRequiredFlag(flags, "show-id", "`--show-id <id-or-slug>`"),
    email: getRequiredFlag(flags, "email", "`--email <value>`"),
  };
}

function buildDeleteRequest(flags = {}) {
  const hasId = getOptionalFlag(flags, "id") !== undefined;
  const hasShowId = getOptionalFlag(flags, "show-id") !== undefined;
  const hasEmail = getOptionalFlag(flags, "email") !== undefined;

  if (hasId && (hasShowId || hasEmail)) {
    throw new Error(
      "Use either `--id <subscriber-id>` or `--show-id <id-or-slug>` with `--email <value>`, not both."
    );
  }

  if (hasId) {
    const subscriberId = getRequiredFlag(flags, "id", "`--id <subscriber-id>`");
    return {
      method: "DELETE",
      path: `subscribers/${encodeURIComponent(subscriberId)}`,
      body: undefined,
    };
  }

  if (hasShowId || hasEmail) {
    if (!hasShowId || !hasEmail) {
      throw new Error(
        "Provide both `--show-id <id-or-slug>` and `--email <value>` when deleting by email."
      );
    }

    return {
      method: "DELETE",
      path: "subscribers",
      body: buildDeleteByEmailBody(flags),
    };
  }

  throw new Error(
    "Provide either `--id <subscriber-id>` or `--show-id <id-or-slug>` with `--email <value>`."
  );
}

function renderDryRun({ method, path, body }) {
  return [
    "Dry run only. No subscriber access was changed.",
    `Planned request: ${method} /v1/${path}`,
    `Payload: ${JSON.stringify(body)}`,
    "Warning: deleting a subscriber revokes their private podcast access.",
    "",
  ].join("\n");
}

export function registerSubscribersNoun(registry) {
  registry.addNoun({
    name: "subscribers",
    summary: "Manage private podcast subscribers",
    notes: [
      "Use `--show-id` to scope list, create, create-batch, and delete-by-email operations.",
      "Pass `--skip-welcome-email` to suppress the instructional email; otherwise the API default remains false.",
      "Destructive actions revoke their private feed access. Use `--dry-run` to inspect the request plan first.",
      SUBSCRIBER_REFERENCE_NOTE,
    ],
    endpoints: [
      "GET /v1/subscribers",
      "GET /v1/subscribers/:id",
      "POST /v1/subscribers",
      "POST /v1/subscribers/batch",
      "PATCH /v1/subscribers/:id",
      "DELETE /v1/subscribers",
      "DELETE /v1/subscribers/:id",
    ],
    actions: {
      list: {
        summary: "Retrieve a list of all subscribers for a single private podcast.",
        flags: ["--show-id <id-or-slug>", "--query <text>", "--page <number>", "--per <number>"],
        filterFlags: SUBSCRIBER_FILTER_FLAGS,
        examples: [
          "node scripts/transistor-fm.mjs subscribers list --show-id 132543",
          "node scripts/transistor-fm.mjs subscribers list --show-id my-show-slug --query example.com",
          "node scripts/transistor-fm.mjs subscribers list --show-id 132543 --page 1 --per 5",
        ],
        async run(args, context) {
          getRequiredFlag(args.flags, "show-id", "`--show-id <id-or-slug>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: "subscribers",
            query: buildListQuery(args.flags),
          });

          return context.formatters.renderCollection(payload?.data || [], {
            meta: payload?.meta || {},
          });
        },
      },
      get: {
        summary: "Retrieve a single private podcast subscriber.",
        flags: ["--id <subscriber-id>"],
        selectorFlags: [SUBSCRIBER_ID_FLAG],
        readOnlyFields: SUBSCRIBER_READ_ONLY_FIELDS,
        examples: [
          "node scripts/transistor-fm.mjs subscribers get --id 709423",
        ],
        async run(args, context) {
          const subscriberId = getRequiredFlag(args.flags, "id", "`--id <subscriber-id>`");
          const payload = await context.httpClient.request({
            method: "GET",
            path: `subscribers/${encodeURIComponent(subscriberId)}`,
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      create: {
        summary: "Add a single subscriber to a private podcast, and send an optional instructional email.",
        flags: ["--show-id <id-or-slug>", "--email <value>", "--skip-welcome-email"],
        selectorFlags: [SHOW_ID_FLAG],
        writableFields: [EMAIL_FLAG, SKIP_WELCOME_EMAIL_FLAG],
        examples: [
          "node scripts/transistor-fm.mjs subscribers create --show-id 132543 --email person@example.com",
          "node scripts/transistor-fm.mjs subscribers create --show-id my-show-slug --email person@example.com --skip-welcome-email",
        ],
        notes: [
          "By default, `skip_welcome_email` stays false and Transistor sends the instructional email.",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "POST",
            path: "subscribers",
            body: buildCreateBody(args.flags),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      "create-batch": {
        summary: "Add a batch of multiple subscribers to a private podcast, and send them optional instructional emails.",
        flags: [
          "--show-id <id-or-slug>",
          "--email <value>",
          "--emails <value1,value2>",
          "--skip-welcome-email",
        ],
        selectorFlags: [SHOW_ID_FLAG],
        writableFields: [EMAIL_FLAG, EMAILS_FLAG, SKIP_WELCOME_EMAIL_FLAG],
        examples: [
          "node scripts/transistor-fm.mjs subscribers create-batch --show-id 132543 --email carol@example.com --email derek@example.com",
          "node scripts/transistor-fm.mjs subscribers create-batch --show-id 132543 --emails carol@example.com,derek@example.com --skip-welcome-email",
        ],
        notes: [
          "Repeated `--email` values and comma-separated `--emails` input are normalized into the API's `emails[]` batch payload.",
          "By default, `skip_welcome_email` stays false and Transistor sends the instructional emails.",
        ],
        async run(args, context) {
          const payload = await context.httpClient.request({
            method: "POST",
            path: "subscribers/batch",
            body: buildCreateBatchBody(args.flags),
          });

          return context.formatters.renderCollection(payload?.data || {});
        },
      },
      update: {
        summary: "Update a single private podcast subscriber.",
        flags: ["--id <subscriber-id>", "--email <value>"],
        selectorFlags: [SUBSCRIBER_ID_FLAG],
        writableFields: [EMAIL_FLAG],
        readOnlyFields: SUBSCRIBER_READ_ONLY_FIELDS,
        examples: [
          "node scripts/transistor-fm.mjs subscribers update --id 709423 --email updated@example.com",
        ],
        async run(args, context) {
          const subscriberId = getRequiredFlag(args.flags, "id", "`--id <subscriber-id>`");
          const payload = await context.httpClient.request({
            method: "PATCH",
            path: `subscribers/${encodeURIComponent(subscriberId)}`,
            body: buildUpdateBody(args.flags),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
      delete: {
        summary: "Remove a single private podcast subscriber and revoke their access to the podcast.",
        flags: ["--id <subscriber-id>", "--show-id <id-or-slug>", "--email <value>", "--dry-run"],
        selectorFlags: [SUBSCRIBER_ID_FLAG, SHOW_ID_FLAG],
        writableFields: [EMAIL_FLAG, DRY_RUN_FLAG],
        examples: [
          "node scripts/transistor-fm.mjs subscribers delete --show-id 132543 --email person@example.com --dry-run",
          "node scripts/transistor-fm.mjs subscribers delete --show-id my-show-slug --email person@example.com",
          "node scripts/transistor-fm.mjs subscribers delete --id 709423 --dry-run",
        ],
        notes: [
          "This action revokes the subscriber's private feed access.",
          "Use either the subscriber ID or the show/email pair to select the record.",
        ],
        async run(args, context) {
          const request = buildDeleteRequest(args.flags);
          if (hasFlag(args.flags, "dry-run")) {
            return renderDryRun({
              method: request.method,
              path: request.path,
              body: request.body || {},
            });
          }

          const payload = await context.httpClient.request({
            method: request.method,
            path: request.path,
            ...(request.body ? { body: request.body } : {}),
          });

          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
