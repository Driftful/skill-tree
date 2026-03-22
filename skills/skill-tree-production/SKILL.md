---
name: skill-tree-production
description: Maintains the production-side source of truth for The Skill Tree, including episode intake, speaker profiles, transcripts, reusable directory entries, show notes, audio tagging, and remote publishing metadata. Use when the user wants to start or update an episode, create or enrich speaker records, clean up or enrich transcripts, curate directory entries or topics, prepare show notes, tag audio, or sync/publish the show through the hosting workflow.
---

# The Skill Tree Production

Production workflow and source-of-truth guidance for the product-facing sibling of The Skill Tree podcast.

## Use This Skill For

- Starting a new episode record before title, transcript, or final metadata are ready.
- Creating or enriching host and guest profiles.
- Cleaning up transcripts, then enriching them with reusable directory links and inline references.
- Writing or refining show notes from transcript-backed source material.
- Preparing local MP3 metadata and chapter markers before upload.
- Syncing mature local episode records to the remote hosting provider only when explicitly requested.

## Workflow Entry Points

- [Podcast Production Workflow](references/host-workflows.md)
- [New Episode Intake](references/new-episode-intake.md)
- [Transcript Enrichment](references/transcript-enrichment.md)
- [Speaker Profile Intake](references/speaker-profile-intake.md)
- [Directory Intake](references/directory-intake.md)
- [Topic Curation](references/topic-curation.md)
- [Show Notes Template](references/show-notes.md)
- [Audio Tagging](references/audio-tagging.md)

## Operating Rules

- Treat local files as the source of truth; remote episode creation, updates, and publish actions happen only when the user explicitly asks for them.
- Before sending show notes or another Markdown-backed description to a hosting provider, run `uv run --script skills/skill-tree-podcast/scripts/parse-markdown-json.py <markdown-file>` and use the returned `html` value rather than raw Markdown.
- Keep the root skill concise and navigation-first; use the reference docs for the detailed workflow for each production step.

## Reference Docs

- [Content Model](references/content-model.md)
- [Architecture](references/architecture.md)
- [Link Resolution](references/link-resolution.md)
