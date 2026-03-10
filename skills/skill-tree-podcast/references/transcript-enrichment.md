# Transcript Enrichment

This document covers the metadata pass that happens after transcript cleanup.

## Goal

Turn a cleaned transcript into better source material for the podcast knowledge base without turning this step into topic curation.

## What This Workflow Does

- Identifies reusable `data/directory/` candidates mentioned in the episode.
- Adds or refines episode-level `directory:` links.
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
3. Check local `data/directory/` entries and aliases first before doing outside research.
4. For unresolved or ambiguous candidates, run research subagents to identify the best target URL and enough facts to support a concise summary.
5. Track two different kinds of confidence:
   - entity-match confidence: how certain the workflow is about the target item
   - placement confidence: how certain the workflow is about the exact transcript locations that should be replaced
6. Write an intermediate Markdown review document under `review/` that separates:
   - proposed directory matches or new entries
   - proposed inline one-off links
   - uncertain or unresolved cases
7. Ask the user to edit or confirm that review document.
8. Only after user approval, create or update any needed `data/directory/` entries, apply transcript replacements, and update the episode's `directory:` list.
9. Leave `topics:` unchanged and defer topic decisions to the standalone topic-curation workflow.

## Review-First Rule

Do not replace transcript text, create inline links, create new directory entries, or update episode `directory:` fields directly from raw research results.

Always stage the proposed changes in the review document first.
The user may edit that document before approving application.

## Placement Rule

Default to linking only the first occurrence of each accepted reusable directory item in a transcript.

Link later occurrences only when the user explicitly asks for denser linking or when repeated links are clearly needed for readability in a long transcript section.

## Link Target Rule

When a reusable directory candidate is accepted:

- create or update the corresponding `data/directory/*.md` entry
- link the transcript mention to that local directory file, not directly to the external canonical URL

When a one-off inline reference is accepted:

- link directly to the external canonical URL in the transcript

## Reusable Directory Candidates

Common candidates include:

- tools and products
- frameworks and libraries
- protocols and file conventions
- companies and organizations
- coined podcast terms or recurring show segments

The question is not whether the thing is important in this one episode. The question is whether it is likely to be useful as a reusable entry across the podcast corpus.

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

The intermediate review artifact should live under `review/`.
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

This workflow may update `directory:` on an episode record.
It should not propose or assign `topics:`.
It may do so only after the review document has been confirmed.
