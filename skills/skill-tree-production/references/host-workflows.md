# Podcast Production Workflow

This is the single progressive-disclosure entry point for podcast production tasks.
Use it to route into the detailed workflow needed for the current production step.

## What This Covers

- New episode setup and intake workflow.
- Guest profile creation and updates.
- Episode transcript processing and formatting.
- Episode metadata updates, transcript linking to reusable directory entries, and inline references.
- Pre-upload MP3 tagging, late-stage audio upload, remote episode sync, and publish/schedule actions.
- Separate topic curation across the full episode set.
- Build and publish/deploy scripts for GitHub.

## New Episode Setup

For the full intake process for a brand-new episode, see [New Episode Intake](new-episode-intake.md).

Use that workflow when the user wants to begin episode prep before the transcript, polished title, or full metadata are available.

For the detailed workflow for researching and creating host or guest records, see [Speaker Profile Intake](speaker-profile-intake.md).
For the post-cleanup metadata pass that creates reusable directory links and inline one-off references, see [Transcript Enrichment](transcript-enrichment.md).
For the exact resolution and review-document rules used during transcript enrichment, see [Link Resolution](link-resolution.md).
For the canonical pre-upload audio-tagging rules, see [Audio Tagging](audio-tagging.md).
For the separate whole-corpus process that curates `data/topics/`, see [Topic Curation](topic-curation.md).

## Transcript Workflow

Current working pipeline for transcript creation and cleanup:

1. Record the session with separate speaker tracks.
2. Import all tracks into `Descript` and perform the podcast edit there.
3. Export the edited audio and transcribe it with `MacWhisper`.
4. Prefer the `Nvidia Parakeet v3` model, which has been the most accurate so far.
5. Export the transcript from `MacWhisper` as `segments` and save to `references/transcripts/[episode].txt`.
6. Run First-Pass Discovery (see below) to produce the metadata file at `references/in-progress/[episode]-metadata.md`.
7. Run the parent repo's `transcript-cleanup` skill, passing:
   - The raw transcript path (e.g., `references/transcripts/001.txt`)
   - The metadata file path (e.g., `references/in-progress/001-metadata.md`)
8. Run the transcript enrichment workflow to identify reusable directory entries and inline one-off references.

### First-Pass Discovery

Before running transcript cleanup, perform a first-pass discovery analysis that produces the metadata file. This file becomes read-only input to the cleanup skill.

**Output:** `references/in-progress/[episode]-metadata.md`

**What the metadata file should contain:**

- **Overview** — word count, estimated windows (words ÷ 2000), list of speakers, timestamp format, duration
- **Chapter Markers** — major topic shifts with timestamps, drafted from scanning the full transcript
- **Technical Terms** — verified jargon, canonical spellings, and any user-confirmed corrections
- **Flagged Ambiguities** — unclear speaker attributions, unverified terms that need human clarification

**Process:**

1. Get the transcript line count with `wc -l`.
2. Read the full transcript using `slice.py --start-line 1 --line-count <total>`.
3. Identify all technical terms, proper nouns, and domain-specific language.
4. Verify each term against web search, repository search, and official documentation.
5. Note major topic shifts with timestamps for chapter markers.
6. Flag any terms or attributions with < 99% confidence for human clarification.
7. Write findings to `references/in-progress/[episode]-metadata.md`.
8. Ask the user to verify flagged terms before proceeding to cleanup.

Pass the metadata file path to transcript cleanup. The cleanup skill will read it for technical terms and chapter markers but will not write to it.
9. **Canonical name verification** — before generating the review document, verify that product/tool names use their public canonical form (e.g., "TypeScript" not "typescript", "Case" not "case"). Apply the same verification to chapter titles and metadata.
10. Review the generated Markdown review document and edit or approve it before any replacements are applied.
11. Only after review approval, create or update the needed `data/directory/` files and apply transcript replacements.
12. Leave topics alone during transcript enrichment and revisit them only in the separate topic-curation workflow.

Install the cleanup skill with:

```sh
npx skills add Diftful/skill-tree@transcript-cleanup
```

Notes:

- Treat the segmented `MacWhisper` export as the cleanup input format.
- The cleanup pass should preserve spoken meaning while improving transcript usability for downstream episode production.
- Transcript enrichment is for local episode cleanup plus reusable directory extraction, not topic assignment.
- Research can run autonomously, including subagent-backed link resolution, but transcript changes should be staged in a review document before application.
- For reusable items, link only the first approved occurrence by default and point that link at the local `data/directory/` entry.
- For one-off references, link directly to the external URL in the transcript.
- If a one-off reference seems to point at a specific clip, episode, talk, or video, ask the user for the exact target when a generic page would be a guess.
- Attach links to the text describing the actual referenced artifact or idea, not automatically to the nearest person, show, or product name.

### Working Directories

The indexer excludes certain directories from reference scanning:

- `references/in-progress/` — active episode processing files (metadata, observations, cleaned transcripts)
- `references/review/` — intermediate review documents staged for approval (no frontmatter required)
- `references/scratch/` — temporary working files and notes (no frontmatter required)

Files in these directories are not indexed and do not need YAML frontmatter. Use these locations for:
- First-pass discovery metadata (`[episode]-metadata.md`)
- Cleanup observations log (`[episode]-observations.md`)
- In-progress cleaned transcripts (`[episode]-cleaned.md`)
- Link review documents from enrichment (`[episode]-links.md`)
- Temporary notes during cleanup or enrichment
- Draft content not yet ready for the reference index

All other Markdown files under `references/` must have valid YAML frontmatter (except raw transcripts in `references/transcripts/`).

## Remote Publishing Workflow

Treat the podcast files in `data/` as the source of truth. Remote hosting actions happen only after the local episode record is mature enough to publish.

Before any upload, treat embedded MP3 metadata as part of the local publish artifact, not as an optional post-processing step.

### When Remote Actions Should Happen

- Do not create a remote episode during initial intake.
- Do not create a remote episode automatically after transcript cleanup or enrichment.
- Create or publish the remote episode only when the user explicitly asks for it.

### Recommended Sequence

1. Start the episode locally with the intake workflow.
2. Clean and enrich the transcript.
3. Finalize local metadata such as title, show notes in the episode Markdown body, transcript path, speaker references, and `## Episode Chapters` labels when available. Directory entries are created as separate files and linked in transcripts; directory membership is derived at index time.
4. Run `node skills/skill-tree-production/scripts/build-reference-indexes.mjs` to refresh committed episode, speaker, transcript, and directory indexes once the local metadata is stable.
5. When the user provides an MP3 path outside the repo, perform the same local audio preparation regardless of whether the next remote step is create or replace.
6. Inspect that local file for existing tags and chapters before upload.
7. If the file is missing required tags, has stale tags, or lacks expected chapters, tag that local file using the episode front matter, show metadata in `data/show.md`, the episode Markdown body, and the `## Episode Chapters` section.
8. Write standard ID3 fields first, then add podcast-identification frames, then import chapter markers.
9. Verify the tagged file locally before upload.
10. Upload the tagged MP3 with `node scripts/transistor-fm.mjs episodes upload --file <path>`.
11. Save the returned audio URL into the episode front matter as `publishing.audio_url`.
12. If the user explicitly asks to create the hosted episode and no `publishing.episode_id` exists yet, read the provider show ID from `data/show.md` and run `node scripts/transistor-fm.mjs episodes create --show-id <show-id-from-show-md> ...`.
13. Save the returned remote episode ID as `publishing.episode_id`, along with any returned `share_url`, `transcript_url`, or current remote `status`.
14. If the user explicitly asks to replace hosted audio for an existing episode, reuse `publishing.audio_url` with `node scripts/transistor-fm.mjs episodes update --id <episode-id> --audio-url <audio-url>` and wait for remote processing to finish.
15. If metadata changes after the remote create or audio replacement, inspect the local MP3 again, re-tag it if needed, then run `node scripts/transistor-fm.mjs episodes update --id <episode-id> ...`.
16. Any time a transcript is sent during `episodes create` or `episodes update`, save the returned `transcript_url` into episode front matter as `publishing.transcript_url` when present.
17. When the user explicitly asks to publish or schedule the episode, run `node scripts/transistor-fm.mjs episodes publish --id <episode-id> --status ...`.

### Local Audio Tagging Workflow

Treat the local MP3 as a derived artifact of the episode record.

Before upload:

1. Inspect the MP3 with `uvx eyeD3 -v <file>` and `uvx mp3chaps2 -l <file>` to see which tags and chapters already exist.
2. Read show-level metadata from `data/show.md`.
3. Read episode front matter from `data/episodes/*.md`.
4. Use the episode Markdown body as the source for long-form description context.
5. If a `## Episode Chapters` section exists, treat it as the canonical source for embedded MP3 chapters.
6. If required tags are missing or stale, apply standard ID3 frames such as title, album/show title, artist, album artist, genre, publisher, comments, and URLs.
7. Add podcast frames so podcast players can recognize the file as podcast audio.
8. Import or refresh chapter markers in the MP3 when chapter data exists.
9. Verify the resulting tags and chapters before any remote upload.

### Publish Input Mapping

At sync time, map local content into the remote episode payload like this:

- title from episode front matter `title`
- description from the episode Markdown body
- transcript text from the local transcript file
- episode number only when it is explicitly appropriate for the remote record
- keywords from `publishing.keywords` when present
- audio URL from `publishing.audio_url` when present

Do not send an episode-level summary to the remote host through this sync path, even if a local episode record keeps one for other uses.

At local tagging time, map local content into the MP3 like this:

- episode title from episode front matter `title`
- episode summary from episode front matter `summary` when present and useful for local ID3 comments
- show title from `data/show.md`
- show description from the Markdown body of `data/show.md` when a second descriptive comment field is useful
- hosts from episode front matter `hosts`
- long-form chapter labels from the episode `## Episode Chapters` section when present
- share, transcript, site, and audio URLs when they already exist

Unless explicitly overridden, use these operational defaults during sync:

- `type=full`
- `explicit=false`
- author derived from show-level defaults first, otherwise from the episode hosts

Episode-number guidance for remote sync:

- Full episodes usually send a remote episode number.
- Trailer episodes may leave the remote episode number blank.
- Bonus episodes may leave the remote episode number blank.
- Bonus episodes may also reuse the number of a related full episode when that matches the publishing intent.
- Do not assume the remote episode number must be unique across trailers or bonus episodes.

### Publish Edge Case

If the user asks to publish an episode that does not yet have `publishing.episode_id`, first create the remote episode, persist the returned ID, and then immediately run the publish command.

## Maintenance Expectations

- Keep source content (`data/episodes`, `data/speakers`, `data/transcripts`, `data/directory`, and `data/topics`) current and consistent.
- Let build scripts generate index and aggregation pages from the source content.
- Ensure root `SKILL.md` continues to act as a concise navigation hub.

## Authoring Guidance

- Prefer structured metadata that supports query-style retrieval by agents.
- Keep summaries scannable and tags accurate.
- Link speakers, directory entries, and episodes consistently so retrieval remains reliable.
- Review topics in a dedicated periodic pass rather than proposing them during episode-level workflows.

### Episode Title Changes

When changing an episode title, update all three locations:

1. **Episode frontmatter** — the `title:` field in `data/episodes/*.md`
2. **Episode document heading** — the `# Title` heading in the episode Markdown body
3. **Transcript title** — the `# Title` heading or `title:` frontmatter in `data/transcripts/*.md`

This keeps the episode and transcript titles in sync for indexing and display.
