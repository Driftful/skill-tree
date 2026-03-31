# Workflows

Assume the current working directory is the `transistor-fm` skill root.

Start with help when you are unsure:

```bash
node scripts/transistor-fm.mjs help
node scripts/transistor-fm.mjs shows help
```

## List Shows

```bash
node scripts/transistor-fm.mjs shows list
node scripts/transistor-fm.mjs shows list --query caffeine --page 1 --per 5
node scripts/transistor-fm.mjs shows get --id the-caffeine-show
```

## Upload Local Episode Audio

Use this whenever a local MP3 will be uploaded to Transistor, whether the file is for a new hosted episode or a replacement for an existing one.

1. Confirm the file path and inspect the current audio artifact before upload.
2. Complete any required local metadata or QA steps for the source file.
3. Verify the finished file locally.
4. Upload the verified file with `node scripts/transistor-fm.mjs episodes upload --file <file>`. The CLI shows a filling progress bar during the upload step and prints the resulting `audio_url` when it completes.

Success means all of the following are true:

- `episodes upload` returns a new `audio_url`

## Create A Draft Episode

```bash
node scripts/transistor-fm.mjs episodes create --show-id 132543 --title "Great episode"
node scripts/transistor-fm.mjs episodes create --show-id my-show-slug --description "Longer episode notes" --transcript-text "Hello world"
node scripts/transistor-fm.mjs episodes create --show-id my-show-slug --transcript-file ./transcript.md
```

If `create` includes transcript text, record any returned `transcript_url` wherever you track local publishing metadata.
Do not assume `--number` is required for trailers or bonus episodes.
Bonus episodes may intentionally reuse the number of a related full episode.

If the source audio is local, first follow `Upload Local Episode Audio`, then pass the returned `audio_url` to `episodes create`.

## Replace Existing Episode Audio

Use this when a hosted episode already exists and the user wants a local MP3 to become the new remote audio.

1. First follow `Upload Local Episode Audio`.
2. Reuse the returned `audio_url` with `node scripts/transistor-fm.mjs episodes update --id <episode-id> --audio-url <audio-url>`.
3. Poll `node scripts/transistor-fm.mjs episodes get --id <episode-id>` until `audio_processing: false`.

Success means all of the following are true:

- `episodes update` succeeds for the intended episode ID
- `episodes get` settles with `audio_processing: false`

## Publish Or Schedule An Episode

```bash
 node scripts/transistor-fm.mjs episodes publish --id 3056098
node scripts/transistor-fm.mjs episodes schedule --id 3056098 --published-at "2026-03-15 09:00:00"
node scripts/transistor-fm.mjs episodes unpublish --id 3056098
```

Use `episodes update` for content edits. Keep `episodes publish` for publish-state changes only.
If `update` includes transcript text, record any returned `transcript_url` wherever you track local publishing metadata.
Do not replace episode audio from a local file until that file has passed the same local validation used for first-time uploads.

For longer transcripts, prefer the file-based form:

```bash
node scripts/transistor-fm.mjs episodes update --id 3056098 --transcript-file ./transcript.md
```

## Manage Subscribers

```bash
node scripts/transistor-fm.mjs subscribers list --show-id 132543
node scripts/transistor-fm.mjs subscribers create --show-id 132543 --email person@example.com
node scripts/transistor-fm.mjs subscribers create-batch --show-id 132543 --emails carol@example.com,derek@example.com --skip-welcome-email
node scripts/transistor-fm.mjs subscribers delete --show-id 132543 --email person@example.com --dry-run
node scripts/transistor-fm.mjs subscribers delete --id 709423 --dry-run
```

Use the dry-run forms before revoking private-feed access.

## Inspect Analytics

```bash
node scripts/transistor-fm.mjs shows analytics --id 132543
node scripts/transistor-fm.mjs episodes analytics-all --show-id my-show-slug --start-date 01-03-2026 --end-date 07-03-2026 --include show
node scripts/transistor-fm.mjs episodes analytics --id 3056098 --start-date 01-03-2026 --end-date 07-03-2026 --include episode
```

Pass `--start-date` and `--end-date` together, and keep them in `dd-mm-yyyy`.

## Manage Webhooks

```bash
node scripts/transistor-fm.mjs webhooks list --show-id 132543
node scripts/transistor-fm.mjs webhooks create --show-id 132543 --event-name episode_created --url https://example.com/hooks/episodes
node scripts/transistor-fm.mjs webhooks delete --id 88002
```
