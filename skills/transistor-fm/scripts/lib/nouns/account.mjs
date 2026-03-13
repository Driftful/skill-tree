const ACCOUNT_READ_ONLY_FIELDS = [
  {
    name: "created_at",
    summary: "Timestamp of creation",
  },
  {
    name: "image_url",
    summary: "Avatar image URL",
  },
  {
    name: "name",
    summary: "Full name",
  },
  {
    name: "time_zone",
    summary: "Current time zone",
  },
  {
    name: "updated_at",
    summary: "Timestamp of last update",
  },
];

export function registerAccountNoun(registry) {
  registry.addNoun({
    name: "account",
    summary: "Inspect the authenticated Transistor account",
    notes: [
      "Read-only: the documented API only exposes authenticated account retrieval for this noun.",
    ],
    actions: {
      get: {
        summary: "Fetch the authenticated user profile",
        readOnlyFields: ACCOUNT_READ_ONLY_FIELDS,
        examples: ["node scripts/transistor-fm.mjs account get"],
        async run(_args, context) {
          const payload = await context.httpClient.getAuthenticatedUser();
          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
