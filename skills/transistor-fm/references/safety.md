# Safety

Assume the current working directory is the `transistor-fm` skill root.

## Help Before Mutation

Before any state-changing command, read resource or action help first:

```bash
node scripts/transistor-fm.mjs episodes publish --help
node scripts/transistor-fm.mjs episodes schedule --help
node scripts/transistor-fm.mjs episodes unpublish --help
node scripts/transistor-fm.mjs subscribers delete --help
node scripts/transistor-fm.mjs webhooks delete --help
```

## Destructive Actions

- `node scripts/transistor-fm.mjs subscribers delete --show-id ... --email ...` revokes private-feed access for that subscriber.
- `node scripts/transistor-fm.mjs subscribers delete --id ...` revokes private-feed access by subscriber ID.
- Use `--dry-run` on subscriber delete actions before the live delete.
- `node scripts/transistor-fm.mjs webhooks delete --id ...` removes a webhook subscription immediately. Confirm the ID with `webhooks list` first.

## Operational Caveats

- There is no separate get-one-webhook endpoint in the documented v1 surface. Use `webhooks list` to inspect existing webhook IDs before deleting.
- `node scripts/transistor-fm.mjs episodes publish ...`, `episodes schedule ...`, and `episodes unpublish ...` are only for publish-state changes. Use `episodes update` for content edits.
- `node scripts/transistor-fm.mjs episodes upload --file ...` performs the authorize step and the presigned HTTP `PUT`; reuse the returned `audio_url` with `episodes create` or `episodes update`.
- Never upload or replace episode audio from a local MP3 blindly. Confirm that the file is the intended final artifact and has passed any required local validation first.
- Analytics date filters require both `--start-date` and `--end-date`, and both must use `dd-mm-yyyy`.
