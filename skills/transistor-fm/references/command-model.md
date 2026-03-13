# Command Model

Assume the current working directory is the `transistor-fm` skill root.

The CLI is help-first. Start broad, then narrow:

```bash
node scripts/transistor-fm.mjs help
node scripts/transistor-fm.mjs episodes help
node scripts/transistor-fm.mjs episodes create --help
```

## Shape

- Global help: `node scripts/transistor-fm.mjs help`
- Resource help: `node scripts/transistor-fm.mjs <resource> help`
- Action help: `node scripts/transistor-fm.mjs <resource> <action> --help`
- Action execution: `node scripts/transistor-fm.mjs <resource> <action> [flags]`

## Current Resources

- `user`
- `shows`
- `episodes`
- `subscribers`
- `webhooks`

## Reading Help Output

- `Selector flags` choose the record or scope, such as `--id` or `--show-id`.
- `Filter flags` narrow list or analytics queries.
- `Writable fields` mutate API-backed data.
- `Read-only fields` are surfaced for context but not accepted as writable CLI input.
- `Notes` usually carry operational caveats and links into `references/api.md`.

## Flag Conventions

- The CLI accepts `--flag value` and `--flag=value`.
- Repeated flags are preserved, which matters for commands like `subscribers create-batch --email ... --email ...`.
- IDs and slugs are resource-specific. Check resource or action help instead of assuming `--id` and `--show-id` mean the same thing everywhere.

