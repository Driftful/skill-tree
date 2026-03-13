const USER_READ_ONLY_FIELDS = [
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

export function registerUserNoun(registry) {
  registry.addNoun({
    name: "user",
    summary: "Inspect the authenticated Transistor user",
    notes: [
      "Read-only: the documented API only exposes authenticated user retrieval for this noun.",
    ],
    actions: {
      get: {
        summary: "Retrieve details of the user account that is authenticating to the API.",
        readOnlyFields: USER_READ_ONLY_FIELDS,
        examples: ["node scripts/transistor-fm.mjs user get"],
        async run(_args, context) {
          const payload = await context.httpClient.getAuthenticatedUser();
          return context.formatters.renderResource(payload?.data || {});
        },
      },
    },
  });
}
