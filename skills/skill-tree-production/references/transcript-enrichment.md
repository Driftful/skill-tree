# Transcript Enrichment

This document covers the metadata pass that happens after transcript cleanup.

## Goal

Turn a cleaned transcript into better source material for the podcast knowledge base without turning this step into topic curation.

## What This Workflow Does

- Identifies reusable `references/directory/` candidates mentioned in the episode.
- Adds local Markdown links to reusable `references/directory/` entries in the transcript.
- Adds inline Markdown links for one-off references that are useful only in local transcript context.
- Produces an intermediate review document before any replacements are applied.

## What This Workflow Does Not Do

- It does not create, merge, split, rename, or assign topics.
- It does not replace the separate episode-intake workflow.
- It does not require that every named thing become a standalone directory entry.
- It does not apply replacements directly from research results without a review step.

## Resolution Pipeline

1. Start from the cleaned transcript in `references/transcripts/` plus any user-attached cleanup metadata.
2. Extract candidate mentions that may need either a reusable directory entry or an inline one-off link.
3. **Canonicalization pass** — before researching or drafting the review document, verify canonical naming for each candidate:
   - Check official project websites, GitHub repos, or npm/PyPI packages for the canonical display name
   - Normalize casing and spelling to match the public canonical form (e.g., "TypeScript" not "typescript", "Case" not "case")
   - Note any aliases that explain how the name appeared in the transcript
   - When a matching `references/directory/` entry exists, check its frontmatter for `usage:` or `formatting:` guidance and follow it
4. Check local `references/directory/` entries and aliases first before doing outside research.
5. For unresolved or ambiguous candidates, run research subagents to identify the best target URL and enough facts to support a concise summary. For GitHub repos, use the `gh` CLI tool (`gh repo view`, `gh api`) rather than web scraping.
6. Track two different kinds of confidence:
   - entity-match confidence: how certain the workflow is about the target item
   - placement confidence: how certain the workflow is about the exact transcript locations that should be replaced
7. Write an intermediate Markdown review document under `review/` that separates:
   - proposed directory matches or new entries
   - proposed inline one-off links
   - uncertain or unresolved cases
8. Ask the user to edit or confirm that review document.
9. Only after user approval, create or update any needed `references/directory/` entries.
10. Run the Enhancement Phase to apply links slice-by-slice (see below).
11. Leave `topics:` unchanged and defer topic decisions to the standalone topic-curation workflow.

## Enhancement Phase

After the user approves the review document, apply links to the transcript using context-safe slicing. This mirrors how `transcript-cleanup` handles long documents.

### Context Hygiene Rules

**Do NOT read the transcript directly.** Use `slice.py` for all reads.

**Do NOT read the enhanced output file.** Only append to it via `append.py`.

**Treat the links review document as your todo list.** Track each link's status as you process slices.

### Scripts

Use the same scripts from the `transcript-cleanup` skill (paths relative to skill-tree repo root):

- `skills/transcript-cleanup/scripts/slice.py` — read slices with word budget and look-ahead
- `skills/transcript-cleanup/scripts/append.py` — append content without reading the output file

Run `python3 skills/transcript-cleanup/scripts/slice.py -h` or `python3 skills/transcript-cleanup/scripts/append.py -h` for usage details. Do not read the script source files.

### Enhancement Loop

1. **Initialize**: Create the enhanced output file at `[transcript]-enhanced.md` (empty or with front matter if needed).

2. **Read slice**: Use `slice.py` with `--start-line 1` (first slice) or `TARGET REACHED after_line + 1` (subsequent slices), targeting 2000 words.

3. **Check pending links**: For each pending link in the review document, check if its first occurrence falls within this slice (up to `TARGET REACHED`).

4. **Apply links**: For approved links with first occurrences in this slice:
   - Directory entries: `[mention text](../directory/slug.md)`
   - One-off references: `[mention text](https://canonical-url.com)`
   - Mark the link as applied in your working checklist.

5. **Discover new links**: If you encounter a clearly linkable mention not in the original review document, add it to the checklist as newly discovered. Apply it if confidence is high; otherwise flag it for later review.

6. **Append slice**: Use `append.py` to append the enhanced content (up to `TARGET REACHED`) to `[transcript]-enhanced.md`.

7. **Advance**: Set `--start-line` to `TARGET REACHED after_line + 1` and repeat until the transcript is complete.

### Link Status Tracking

Track each link's status in the review document or a working checklist:

- `[ ]` pending — not yet encountered
- `[x]` applied — linked at first occurrence
- `[~]` omitted — skipped with reason (e.g., "mentioned only in passing, no clear anchor")
- `[+]` new — discovered during enhancement, not in original review

At the end of enhancement, every link from the original review should be either applied or omitted with a clear reason. New discoveries should be noted for future reference.

### Output Naming

The enhanced transcript goes to `[transcript]-enhanced.md` in the same directory as the source transcript.

Example: `references/transcripts/001-episode.md` → `references/transcripts/001-episode-enhanced.md`

After verification, the enhanced version replaces the original cleaned transcript.

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

- create or update the corresponding `references/directory/*.md` entry
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

**Public vs. local directory placement**: A publicly available skill, plugin, or integration may still belong in the local `references/directory/` if it is likely to recur across episodes. For example, a widely-used Cursor skill or a popular MCP server that comes up in multiple conversations should have a local directory entry, even though it exists in a public registry. The local entry provides podcast-specific context and anchors transcript links consistently.

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

This workflow does not update episode front matter with `directory:` entries. Directory membership is derived at index time from linked references in transcript and episode content.

This workflow should not propose or assign `topics:`. Topic decisions belong to the standalone topic-curation workflow.

## Completion and Next Steps

After transcript enrichment is complete:

1. Update the episode front matter: set `transcript_enriched: true`.
2. Offer to proceed to the next step: "Transcript enrichment complete. Would you like to finalize episode metadata and prepare for audio tagging, or move on to topic curation?"

This keeps the production workflow moving without requiring the user to remember what comes next.
