# Link Resolution

This document defines how transcript enrichment resolves mentions into reusable directory entries and inline Markdown links.

## Goal

Resolve mentions with high confidence while keeping final application under human control.

## Inputs

- cleaned transcript
- user-attached cleanup metadata when available
- existing `data/directory/` entries

## Resolution Order

1. Extract candidate mentions from the transcript.
2. Normalize obvious variants using local aliases and transcript context.
3. Try exact or alias-based matches against `data/directory/`.
4. **Verify entity distinctness** — when a candidate appears similar to an existing directory entry, confirm they are the same entity before reusing the existing entry. Related but distinct tools must have separate entries.
   - Example: `Vim` and `Neovim` are related but distinct — do not silently substitute one for the other.
   - Example: `React` and `React Native` are related but distinct frameworks.
   - Example: `TypeScript` and `JavaScript` are related but distinct languages.
   - When the transcript explicitly names a distinct entity, create a new directory entry rather than linking to a related one.
5. For unresolved or ambiguous items, run research subagents.
6. Collect a proposed canonical target plus supporting evidence.
7. Score confidence for both target match and transcript placement.
8. For reusable directory candidates, derive a proposed slug and a frontmatter-ready summary in addition to the canonical target.
9. Write all proposals into the review document.
10. Wait for user edits or approval before applying anything.

## Subagent Research Expectations

For unresolved candidates, research should aim to find:

- the canonical display name
- a canonical URL or best primary public page
- enough context to write a short factual summary
- any aliases or spelling variants that explain the transcript wording

**Link target preference**: When a project has both a GitHub repository and a cleaner informational website, prefer linking to the website. The website is typically more accessible to listeners and provides a better landing experience.

Examples:
- TanStack has tanstack.com → link to tanstack.com, not github.com/TanStack
- Playwright has playwright.dev → link to playwright.dev, not github.com/microsoft/playwright
- A project with only a GitHub page → link to GitHub

Research should prefer the clearest canonical source available for the kind of thing being resolved.

**GitHub research**: When investigating GitHub repositories, prefer the `gh` CLI tool over web scraping or generic search. Use commands like:
- `gh repo view <owner/repo>` — get repo description, topics, and metadata
- `gh api repos/<owner/repo>` — full repo details as JSON
- `gh api repos/<owner/repo>/readme` — fetch README content
- `gh search repos <query>` — find repos matching a term

The `gh` tool provides accurate, structured data and avoids rate limiting issues.

Before settling on a fallback target, check whether the transcript is actually referring to:

- a parent entity
- a specific artifact created by that entity
- an idea explained in a specific artifact

If the transcript points at a specific artifact and the exact target is uncertain, prefer asking the user over silently linking a broader parent page.

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

Write the review artifact to `references/in-progress/[episode]-links.md`.

Examples:

- `references/in-progress/000-theyre-all-markdown-files-links.md`
- `references/in-progress/001-links.md`

This keeps all in-progress episode files together in one directory. The indexer excludes `in-progress/` from reference scanning, so these files do not need YAML frontmatter.

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

**Exception for disconnected synonyms**: When a synonym or alternate name appears in a separate thought and a listener wouldn't automatically connect it to the earlier mention, propose linking it too.

- Link again: "We use Case" ... [later, separate context] ... "The WorkOS harness handles it" — these don't obviously refer to the same thing
- Don't link again: "Case, also known as the WorkOS harness" — the connection is explicit

For one-off inline references, propose the single occurrence that most directly mentions the cited item.

## Anchor Selection Defaults

Choose the smallest span of text that accurately names the thing being linked.

Prefer:

- the episode title when linking a specific episode
- the intro or clip description when linking a specific clip
- the idea or video description when linking a specific talk or video

Avoid attaching a link to a broader parent noun when the actual target is narrower.

## Human-in-the-Loop

**Prefer asking over guessing.** When resolution is uncertain, reach out to the user rather than spinning wheels on research or making assumptions.

Good reasons to ask the user:

- **Multiple plausible targets** — "This could be X or Y. Which is it?"
- **Uncertain link placement** — "Should I link this mention or a different one?"
- **Ambiguous reference** — "Is this referring to the company, the product, or the open-source project?"
- **Missing context** — "I can't find a canonical URL for this. Do you have one?"
- **Topic-dependent linking** — "Given the episode focus, should this tangential mention be linked at all?"

Use selection questions when there are discrete options. Use freeform questions when you need a URL, name, or open-ended answer. Batch related questions when possible.

**It's okay to ask.** A quick clarification is cheaper than incorrect links that require manual cleanup.

## Application Rule

The review document is the only place where raw resolution results should be staged for approval.

Do not:

- directly rewrite the transcript from unresolved research
- create new directory entries before review

Apply changes only after the user has reviewed or confirmed the document.

After approval:

- create any needed `data/directory/*.md` entries for accepted reusable items
- use local relative links from the transcript to those directory files
- use direct external links only for approved inline one-off references
- preserve the approved anchor text choice, especially when it points at a specific artifact or idea instead of a broader name
