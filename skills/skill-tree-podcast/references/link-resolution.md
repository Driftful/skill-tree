# Link Resolution

This document defines how transcript enrichment resolves mentions into reusable directory entries and inline Markdown links.

## Goal

Resolve mentions with high confidence while keeping final application under human control.

## Inputs

- cleaned transcript
- user-attached cleanup metadata when available
- existing `data/directory/` entries
- existing episode `directory:` metadata

## Resolution Order

1. Extract candidate mentions from the transcript.
2. Normalize obvious variants using local aliases and transcript context.
3. Try exact or alias-based matches against `data/directory/`.
4. For unresolved or ambiguous items, run research subagents.
5. Collect a proposed canonical target plus supporting evidence.
6. Score confidence for both target match and transcript placement.
7. For reusable directory candidates, derive a proposed slug and a frontmatter-ready summary in addition to the canonical target.
8. Write all proposals into the review document.
9. Wait for user edits or approval before applying anything.

## Subagent Research Expectations

For unresolved candidates, research should aim to find:

- the canonical display name
- a canonical URL or best primary public page
- enough context to write a short factual summary
- any aliases or spelling variants that explain the transcript wording

Research should prefer the clearest canonical source available for the kind of thing being resolved.

## Confidence Model

Track two confidence values:

- target confidence: how certain the workflow is about the item itself
- placement confidence: how certain the workflow is about the exact transcript mentions to replace

Suggested interpretation:

- `high`: safe to propose as likely correct
- `medium`: plausible but needs careful review
- `low`: too uncertain to apply

Low-confidence items stay in the review document and should not be applied.

## Review Document Path

Write the review artifact under `review/`.

Suggested naming pattern:

- `review/000-theyre-all-markdown-files-links.md`
- `review/042-some-episode-links.md`

## Review Document Structure

Use separate sections for:

1. proposed directory entries and matches
2. proposed inline links
3. unresolved or uncertain cases

Minimum fields per proposed item:

- mention text
- normalized name
- proposed directory slug or canonical URL
- summary for directory entries when applicable
- target confidence
- placement confidence
- transcript locations
- rationale or evidence summary

## Placement Defaults

Unless the user asks otherwise, propose transcript replacements only at the first occurrence of each accepted reusable directory item.

For one-off inline references, propose the single occurrence that most directly mentions the cited item.

## Application Rule

The review document is the only place where raw resolution results should be staged for approval.

Do not:

- directly rewrite the transcript from unresolved research
- create new directory entries before review
- update episode `directory:` metadata before review

Apply changes only after the user has reviewed or confirmed the document.

After approval:

- create any needed `data/directory/*.md` entries for accepted reusable items
- use local relative links from the transcript to those directory files
- use direct external links only for approved inline one-off references
