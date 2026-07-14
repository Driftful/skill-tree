# Audio Tagging

This document defines the default pre-upload tagging workflow for local MP3 files.

Treat audio tagging as part of episode production, not as an optional polish pass after upload.

## When To Use This

Use this workflow when:

- the user provides a local MP3 path for an episode
- episode metadata is mature enough to publish or preview
- the file needs embedded title, summary, podcast frames, or chapters before upload

## Source Of Truth

Build the MP3 tags from the local podcast source files:

- `references/show.md` for show title, website, categories, provider defaults, and show description
- `references/episodes/*.md` front matter for episode title, summary, hosts, guests, and publishing state
- the episode Markdown body for long-form description context
- the episode `## Episode Chapters` section for chapter timestamps and labels when present

Do not invent a separate hand-maintained metadata file for the MP3 unless the user explicitly wants one.

## Default Tooling

Use:

- `uvx eyeD3` for standard ID3 frames, comments, URLs, and podcast-related plugin support
- `uvx mp3chaps2` for MP3 chapter import, listing, and removal

Use `eyeD3` first, then `mp3chaps2`.

## Recommended Sequence

1. Confirm the local MP3 path.
2. Inspect the current file with `uvx eyeD3 -v <file>` and `uvx mp3chaps2 -l <file>` before making upload decisions.
3. Read `references/show.md` and the episode source file.
4. Verify that title, summary, and show notes are mature enough for embedding.
5. If chapter timestamps exist, render them into a sidecar file beside the MP3 using `HH:MM:SS.mmm Title` lines. The sidecar must be named by stripping the `.mp3` extension and appending `.chapters.txt` (e.g., `episode.mp3` → `episode.chapters.txt`, not `episode.mp3.chapters.txt`).
6. If required tags are missing or stale, use `uvx eyeD3` to write the standard fields.
7. Use `uvx eyeD3 --plugin=itunes-podcast --add` to mark the file as podcast audio.
8. Use `uvx mp3chaps2 -i <file>` to import or refresh chapters.
9. Verify tags with `uvx eyeD3 -v <file>` and chapters with `uvx mp3chaps2 -l <file>`.
10. Only upload the MP3 after verification succeeds.

Use this same preparation sequence whether the uploaded file will be attached during hosted episode creation or used to replace the audio for an existing hosted episode.

## Minimum Upload-Ready Fields

Treat these as the minimum bar for upload or hosted-audio replacement:

- episode title in `TIT2`
- show title in `TALB`
- show title or podcast name in `TPE1`
- show title in `TPE2`
- episode summary in `COMM` when the summary is approved for embedding
- podcast-identification frames via the `eyeD3` iTunes podcast plugin
- embedded chapters when the episode source includes `## Episode Chapters`

Richer tagging is encouraged, but do not block routine replacement work on optional fields when the minimum set is correct and verified.

## Canonical Command Template

Use this sequence when the file needs to be refreshed from the local episode record:

```bash
uvx eyeD3 --encoding utf8 \
  -t "<episode-title>" \
  -A "<show-title>" \
  -a "<show-title>" \
  -b "<show-title>" \
  -G "Podcast" \
  --publisher "<publisher-name>" \
  -c "<episode-summary>" \
  "<file>"

uvx eyeD3 --plugin=itunes-podcast --add "<file>"
uvx mp3chaps2 -i "<file>"
uvx eyeD3 -v "<file>"
uvx mp3chaps2 -l "<file>"
```

When reliable values already exist for share, transcript, site, or provider episode URLs, add them before the final verification pass.

## Preferred Field Mapping

Write as many reliable fields as can be derived without guesswork.

Preferred mappings:

- episode title -> `TIT2`
- show title -> `TALB`
- show title or podcast name -> `TPE1`
- show title as album artist -> `TPE2`
- episode summary -> `COMM`
- show description or secondary descriptive text -> additional `COMM`
- episode summary when a player benefits from lyric-style display -> `USLT`
- genre -> `TCON`
- publisher name — the show/podcast publisher, e.g. the show title, not the hosting provider -> `TPUB`
- podcast grouping or type label when useful -> `TIT1`
- short subtitle/tagline when useful -> `TIT3`
- website, share URL, transcript URL, or audio URL -> URL frames such as `WOAS`, `WOAF`, `WPUB`, or `WXXX`
- durable implementation-specific values such as hosts or provider episode ID -> `TXXX`
- podcast-identification frames -> `eyeD3` iTunes podcast plugin
- embedded chapters -> `CHAP` and `CTOC` via `mp3chaps2`

## Authoring Constraints

- Prefer values already present in the repo over guessed values.
- Do not block tagging on having every optional field.
- If `## Episode Chapters` is missing, skip chapter import rather than inventing timestamps.
- If summary text is not finalized, ask before embedding it into the MP3.
- Check the current MP3 before upload even if you expect it to have already been tagged.
- Treat missing required fields or mismatches against local episode metadata as a reason to refresh the tags before upload.
- If metadata changes materially after tagging but before upload, re-run tagging so the local file stays aligned with the episode record.

## Operational Notes

- The local MP3 is a derived publish artifact, not the source of truth.
- The source of truth remains `references/show.md`, the episode file, and the transcript-derived supporting files.
- `publishing.audio_url` should only be saved after the tagged file is uploaded.
