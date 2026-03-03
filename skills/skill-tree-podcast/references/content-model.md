# Content Model

This skill serves two audiences:
- Listeners (and their agents) discovering relevant episodes, guests, and topics.
- Podcast hosts/authors maintaining source content and publishing updates.

## Core Principle

Use progressive disclosure. Keep root `SKILL.md` minimal and navigation-first, and place detailed guidance in child documents.

## Source of Truth Files

These are hand-authored and treated as build inputs:
- `speakers/*.md`: host/guest bios and expertise tags.
- `episodes/*.md`: metadata, summaries, tags, and speaker references.
- `transcripts/*.md`: full episode transcripts.
- `topics/*.md`: topic definitions (slug, display name, description).

Speaker files are source-of-truth records, not leaf pages.

## Generated Outputs

Generated during the build/publish process:
- `topics/*.index.md`: topic aggregations (episodes + speakers by topic).
- `topics/index.md`: list of all topics.
- `episodes/index.md`: chronological episode list.
- `speakers/index.md`: speakers with appearance counts.
- topic links surfaced from the root `SKILL.md`.

## Topic Definition vs Aggregation

Keep topic definitions and topic aggregations separate.

Example flow:
`SKILL.md` -> `topics/skill-authoring.index.md` -> `topics/skill-authoring.md` + related episodes.

## Open Decision

Topic naming for source vs generated files remains open. Candidate patterns:
- `{slug}.md` and `{slug}.index.md`
- `{slug}/definition.md` and `{slug}/index.md`
- `{slug}.md` and `_{slug}.md`
