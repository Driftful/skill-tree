# Podcast Production Workflow

This is the single progressive-disclosure entry point for podcast production tasks.
Use it to route into the detailed workflow needed for the current production step.

## What This Covers

- New episode setup and intake workflow.
- Guest profile creation and updates.
- Episode transcript processing and formatting.
- Episode metadata updates, including reusable directory entries and inline references.
- Separate topic curation across the full episode set.
- Build and publish/deploy scripts for GitHub.

## New Episode Setup

For the full intake process for a brand-new episode, see [New Episode Intake](new-episode-intake.md).

Use that workflow when the user wants to begin episode prep before the transcript, polished title, or full metadata are available.

For the detailed workflow for researching and creating host or guest records, see [Speaker Profile Intake](speaker-profile-intake.md).
For the post-cleanup metadata pass that creates reusable directory links and inline one-off references, see [Transcript Enrichment](transcript-enrichment.md).
For the exact resolution and review-document rules used during transcript enrichment, see [Link Resolution](link-resolution.md).
For the separate whole-corpus process that curates `data/topics/`, see [Topic Curation](topic-curation.md).

## Transcript Workflow

Current working pipeline for transcript creation and cleanup:

1. Record the session with separate speaker tracks.
2. Import all tracks into `Descript` and perform the podcast edit there.
3. Export the edited audio and transcribe it with `MacWhisper`.
4. Prefer the `Nvidia Parakeet v3` model, which has been the most accurate so far.
5. Export the transcript from `MacWhisper` as `segments`.
6. Run the parent repo's `transcript-cleanup` skill against that segmented transcript.
7. Run the transcript enrichment workflow to identify reusable directory entries and inline one-off references.
8. Review the generated Markdown review document and edit or approve it before any replacements are applied.
9. Only after review approval, create or update the needed `data/directory/` files, apply transcript replacements, and update episode `directory:` entries.
10. Leave topics alone during transcript enrichment and revisit them only in the separate topic-curation workflow.

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

## Maintenance Expectations

- Keep source content (`data/episodes`, `data/speakers`, `data/transcripts`, `data/directory`, and `data/topics`) current and consistent.
- Let build scripts generate index and aggregation pages from the source content.
- Ensure root `SKILL.md` continues to act as a concise navigation hub.

## Authoring Guidance

- Prefer structured metadata that supports query-style retrieval by agents.
- Keep summaries scannable and tags accurate.
- Link speakers, directory entries, and episodes consistently so retrieval remains reliable.
- Review topics in a dedicated periodic pass rather than proposing them during episode-level workflows.
