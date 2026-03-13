# Directory Intake

This document covers how to create or enrich a reusable entry in `data/directory/`.

## Goal

Maintain a cross-episode directory of named things in the podcast's orbit so they can be summarized once and linked many times.

## What Belongs In Directory

Create a directory entry when the item is likely to recur across episodes and benefits from a stable summary plus canonical links.

Typical directory entry types include:

- tools and products
- frameworks and libraries
- companies and organizations
- protocols and formats
- files and conventions such as `SKILL.md`
- coined show terms or recurring segment names

## What Does Not Belong In Directory

Do not create a directory entry for:

- a one-off article or blog post
- a single local citation that is best handled as an inline Markdown link
- a broad thematic concept that belongs in `data/topics/`

## Intake Workflow

1. Start from a cleaned transcript, existing episode metadata, or an explicit user request.
2. Check whether a matching `data/directory/` entry already exists.
3. Check known aliases and nearby transcript context before treating it as unresolved.
4. If it exists, update it only when new or better information is available.
5. If it does not exist or the match is ambiguous, research the item and collect enough evidence to support a canonical name, canonical link, and concise summary.
6. Record the proposed match or new entry in the review document with confidence notes before creating or applying anything.
7. Create or update the entry only after the review document has been confirmed.
8. Add the entry slug to the relevant episode `directory:` list when appropriate.

## Evidence Rule

New directory entries should be evidence-backed.

Before creating one, the workflow should have:

- a canonical display name
- a canonical URL or primary public reference
- enough supporting context to explain why this is the correct match
- alias notes when transcript phrasing differs from the canonical name

If the evidence is weak or ambiguous, keep the item in the review document as unresolved instead of guessing.

## Confidence Notes

Track confidence separately for:

- whether the target item is the correct match
- whether the proposed transcript replacements are the right placements

This makes it possible to say "the item is almost certainly correct, but these exact replacement locations should be reviewed."

## Suggested Front Matter

Most directory metadata should live in front matter.

Suggested fields:

- `name`: canonical display name
- `kind`: one of `tool`, `product`, `framework`, `library`, `company`, `organization`, `protocol`, `format`, `file`, `concept`, or another short category that fits the item
- `summary`: concise explanation of what it is and why it matters in the podcast context
- `links`: canonical links worth reusing
- `aliases`: optional alternate spellings or names
- `evidence`: optional short notes about how the item was identified when disambiguation matters

Keep the body optional. Use it only for substantive notes that do not fit cleanly into front matter.

## Summary Rule

Write `summary` so it can be copied directly from the review document into front matter with little or no rewriting.

Prefer one sentence that:

- identifies what the thing is
- explains why it matters in the podcast context
- stays factual and reusable across episodes

## Writing Rule

Directory entries should be concise, factual, and reusable across episodes.
Write for fast retrieval first, not marketing copy.

When linking from a transcript, point reusable mentions at the local `data/directory/*.md` file rather than the external canonical URL stored in `links:`.
