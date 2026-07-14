# Directory Intake

This document covers how to create or enrich a reusable entry in `references/directory/`.

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
- a broad thematic concept that belongs in `references/topics/`

## Intake Workflow

1. Start from a cleaned transcript, existing episode metadata, or an explicit user request.
2. Check whether a matching `references/directory/` entry already exists.
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

**GitHub research**: For GitHub-hosted projects, use the `gh` CLI tool (`gh repo view`, `gh api repos/<owner/repo>`) to get accurate metadata rather than web scraping.

**Link ordering**: When a project has both a GitHub repo and a cleaner informational website, list the website first in `links:`. The website provides a better landing experience for listeners. Include GitHub as a secondary link when useful.

If the evidence is weak or ambiguous, keep the item in the review document as unresolved instead of guessing. When in doubt, ask the user — they often know the canonical name or URL immediately.

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
- `links`: canonical links worth reusing (list the primary/informational website first, GitHub second)
- `aliases`: optional alternate spellings or names
- `evidence`: optional short notes about how the item was identified when disambiguation matters
- `usage`: optional grammar and formatting rules for how to reference this item

Keep the body optional. Use it only for substantive notes that do not fit cleanly into front matter.

## Usage Rules

The `usage` field captures grammar, formatting, and stylistic rules for referencing the item consistently. Include usage rules when:

- The item has non-obvious capitalization (e.g., "macOS", "iOS", "TypeScript")
- The item should appear in backticks in certain contexts (e.g., CLI commands, file names)
- The item is commonly confused with something else
- The item has a handle form vs. a name form

Example usage field values:

```yaml
usage: "Always capitalize as 'TypeScript', never 'Typescript' or 'typescript'"
usage: "Use backticks when referring to the CLI command (`case run`), plain text for the product (Case)"
usage: "Distinguish from Neovim; Vim refers specifically to the original editor"
usage: "Use `@nicknisi` for the handle, 'Nick Nisi' for the person"
```

When a directory entry has usage rules, the enrichment workflow should apply those rules when linking or formatting transcript mentions.

## Summary Rule

Write `summary` so it can be copied directly from the review document into front matter with little or no rewriting.

Prefer one sentence that:

- identifies what the thing is
- explains why it matters in the podcast context
- stays factual and reusable across episodes

## Writing Rule

Directory entries should be concise, factual, and reusable across episodes.
Write for fast retrieval first, not marketing copy.

When linking from a transcript, point reusable mentions at the local `references/directory/*.md` file rather than the external canonical URL stored in `links:`.
