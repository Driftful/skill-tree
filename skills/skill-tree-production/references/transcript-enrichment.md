# Transcript Enrichment

This document covers the metadata pass that happens after transcript cleanup.

## Goal

Turn a cleaned transcript into better source material for the podcast knowledge base without turning this step into topic curation.

## What This Workflow Does

- Identifies reusable `data/directory/` candidates mentioned in the episode.
- Adds local Markdown links to reusable `data/directory/` entries in the transcript.
- Adds inline Markdown links for one-off references that are useful only in local transcript context.
- Produces an intermediate review document before any replacements are applied.

## What This Workflow Does Not Do

- It does not create, merge, split, rename, or assign topics.
- It does not replace the separate episode-intake workflow.
- It does not require that every named thing become a standalone directory entry.
- It does not apply replacements directly from research results without a review step.

## Resolution Pipeline

1. Start from the cleaned transcript in `data/transcripts/` plus any user-attached cleanup metadata.
2. Extract candidate mentions that may need either a reusable directory entry or an inline one-off link.
3. **Canonicalization pass** — before researching or drafting the review document, verify canonical naming for each candidate:
   - Check official project websites, GitHub repos, or npm/PyPI packages for the canonical display name
   - Normalize casing and spelling to match the public canonical form (e.g., "TypeScript" not "typescript", "Case" not "case")
   - Note any aliases that explain how the name appeared in the transcript
4. Check local `data/directory/` entries and aliases first before doing outside research.
5. For unresolved or ambiguous candidates, run research subagents to identify the best target URL and enough facts to support a concise summary. For GitHub repos, use the `gh` CLI tool (`gh repo view`, `gh api`) rather than web scraping.
6. Track two different kinds of confidence:
   - entity-match confidence: how certain the workflow is about the target item
   - placement confidence: how certain the workflow is about the exact transcript locations that should be replaced
7. Write an intermediate Markdown review document to `references/in-progress/[episode]-links.md` that separates:
   - proposed directory matches or new entries
   - proposed inline one-off links
   - uncertain or unresolved cases
8. Ask the user to edit or confirm that review document.
9. Only after user approval, create or update any needed `data/directory/` entries and apply transcript replacements.
10. Leave `topics:` unchanged and defer topic decisions to the standalone topic-curation workflow.

## Review-First Rule

Do not replace transcript text, create inline links, or create new directory entries directly from raw research results.

Always stage the proposed changes in the review document first.
The user may edit that document before approving application.

## Clarification-First Rule

When a transcript reference appears to point to a specific artifact rather than a general entity, prefer clarification over guessing.

Common examples:

- a show's intro clip rather than the show in general
- a specific episode rather than the series
- a specific video, talk, or blog post rather than the person or company behind it

If there is a reasonable chance the user has the exact target URL or has a stronger preference about what should be linked, ask before applying a generic fallback.

**Prefer asking over spinning.** A quick question to the user often resolves in seconds what research might not resolve at all. Use selection questions for discrete choices, freeform questions for URLs or open-ended answers.

## Placement Rule

Default to linking only the first occurrence of each accepted reusable directory item in a transcript.

Link later occurrences when:
- The user explicitly asks for denser linking
- Repeated links are clearly needed for readability in a long transcript section
- **A synonym or alternate name is used in a way that wouldn't automatically connect** — if a listener wouldn't realize the synonym refers to the same thing, link it

Examples of when to link again:
- "We use Case for that" ... [later, separate thought] ... "The WorkOS harness handles it" → link both, since "WorkOS harness" doesn't obviously mean Case
- "TypeScript is great" ... [later] ... "TS makes refactoring easier" → link both if the abbreviation isn't obviously connected

Examples of when NOT to link again:
- "Case, also known as the WorkOS harness" → only link "Case", the connection is explicit
- "TypeScript, or TS for short" → only link "TypeScript"

## Link Target Rule

When a reusable directory candidate is accepted:

- create or update the corresponding `data/directory/*.md` entry
- link the transcript mention to that local directory file, not directly to the external canonical URL

When a one-off inline reference is accepted:

- link directly to the external canonical URL in the transcript

## Anchor Text Rule

Attach each link to the text that best matches what is actually being referenced.

Examples:

- if the reference is to an intro clip, link the intro description rather than the show title
- if the reference is to a specific article or video, link the article or idea description rather than only the author's name
- if the reference is to a reusable tool or product, linking the named entity itself is usually appropriate

## Topic-Aware Linking

Consider the overall episode topics and the surrounding discussion when deciding link text and targets.

A mention may serve different purposes depending on context:

- When a tool is the **main subject** of a section, link the first prominent mention
- When a tool is mentioned **in passing** while discussing something else, evaluate whether linking adds value or creates noise
- When the same term could link to multiple targets (e.g., a company vs. their product), use the episode's focus to pick the more relevant one
- When a speaker is explaining a concept and names a tool as an example, consider whether the link should go to the tool or to the concept

Before generating the review document, scan the chapter markers and overall topic flow to understand what the episode is actually about. This helps avoid over-linking tangential mentions while ensuring key discussion points are properly connected.

## Reusable Directory Candidates

Common candidates include:

- tools and products
- frameworks and libraries
- protocols and file conventions
- companies and organizations
- coined podcast terms or recurring show segments
- public skills, plugins, or integrations that are reusable across episodes

The question is not whether the thing is important in this one episode. The question is whether it is likely to be useful as a reusable entry across the podcast corpus.

**Public vs. local directory placement**: A publicly available skill, plugin, or integration may still belong in the local `data/directory/` if it is likely to recur across episodes. For example, a widely-used Cursor skill or a popular MCP server that comes up in multiple conversations should have a local directory entry, even though it exists in a public registry. The local entry provides podcast-specific context and anchors transcript links consistently.

## Inline One-Off References

Keep a mention inline when:

- it is specific to a single anecdote or citation
- it is unlikely to recur
- the value comes mainly from linking the exact thing being mentioned

Examples:

- a specific article
- a single blog post
- a one-off conference talk
- a one-off project mention that is unlikely to recur

## Confidence Rules

- High confidence: strong evidence that the target is correct and the placement is correct.
- Medium confidence: plausible, but requires explicit human review before application.
- Low confidence: include it in the review document as unresolved or tentative, but do not apply it.

It is valid to have a high-confidence target with medium-confidence placement.
For example, the workflow may know which `DeepWiki` page is correct while still being unsure which transcript mentions should be linked.

## Review Document

Write the intermediate review artifact to `references/in-progress/[episode]-links.md`.
For the detailed resolution rules and review-document structure, see [Link Resolution](link-resolution.md).

Minimum sections:

- proposed directory entries and matches
- proposed inline links
- unresolved or uncertain cases

Minimum fields per item:

- mention text
- normalized name
- proposed directory slug or canonical URL
- summary for directory entries when applicable
- confidence notes
- transcript locations where the replacement is proposed
- short rationale or evidence summary

## Episode Metadata Rule

This workflow does not update episode front matter with `directory:` entries. Directory membership is derived at index time from linked references in transcript and episode content.

This workflow should not propose or assign `topics:`. Topic decisions belong to the standalone topic-curation workflow.
