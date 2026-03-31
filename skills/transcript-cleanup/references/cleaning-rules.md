# Cleaning Rules

Processing workflow and detailed instructions for cleaning raw transcript content. This is a reference for [SKILL.md](../SKILL.md).

## Definitions

- **Observations file**: `in-progress/[episode]-observations.md` — append-only log of referenceable items, title candidates, and cleanup decisions discovered during cleanup.
- **Cleaned transcript**: `in-progress/[episode]-cleaned.md` — the append-only polished transcript assembled window by window.

## Core Philosophy

**Accuracy over polish (No paraphrasing)**: Preserve exactly what was said. Remove verbal clutter to improve readability, but **NEVER paraphrase or alter underlying sentence structure**. Even if a sentence is grammatically awkward, clean the filler and preserve the rest exactly as spoken.

**Canonical name normalization**: When a named product, tool, framework, or project has a public canonical name, use that canonical name in the cleaned transcript, chapter titles, and metadata. Transcript casing or phonetic spelling should not override the public canonical form.

Examples:
- Transcript says "case" but the project is publicly named "Case" → use "Case"
- Transcript says "typescript" → use "TypeScript"
- Transcript says "neovim" or "neo vim" → use "Neovim"

When uncertain about canonical naming, verify against official sources (project website, GitHub repo, npm package) before applying a correction. If still uncertain, ask the user.

## Human-in-the-Loop Clarifications

**When in doubt, ask.** This skill processes content where small errors compound. A mis-identified technical term becomes a consistent mistake across thousands of words.

**Prefer asking over spinning wheels.** If you've spent more than a minute researching a term without high confidence, ask the user. They often know the answer immediately.

### When to Ask the User

- **Unfamiliar jargon** — terms you cannot verify with 99% confidence through search tools
- **Ambiguous speaker attribution** — when it's unclear who is speaking
- **Unclear acronyms** — especially domain-specific ones not findable via web search
- **Spelling of proper nouns** — names of people, companies, or projects
- **Context gaps** — anything that would require guessing to clean accurately
- **Canonical naming uncertainty** — when you're unsure if it's "Case" or "case", ask
- **Handle vs name ambiguity** — when unsure if something is a handle or proper name

### How to Ask

Defer to project-specific instructions or skills for human-in-the-loop interaction (e.g., a `human-in-the-loop` skill or MCP tools). If no project-specific method exists, use available question-asking tools (AskQuestion, MCP tools with user interaction, etc.).

**Use selection questions** when there are discrete options (e.g., "Is this Case or case?"). **Use freeform questions** when you need a URL, spelling, or open-ended answer. Batch related questions together when possible.

### When NOT to Ask

- Standard filler removal (um, uh, like) — apply universally
- Obvious sentence repairs — use context from the transcript
- Common technical terms you can verify via web or repo search
- Decisions already logged in the metadata file's Technical Terms or Decisions sections

**Principle:** Asking slows you down slightly but prevents compounding errors. A 30-second clarification is cheaper than re-processing 5,000 words. Don't hesitate to reach out.

---

## Workflow

### Step 0: Load First-Pass Discovery (Metadata File)

**Before processing any window, check for and load the first-pass discovery metadata file.**

The producer creates this file during the First-Pass Discovery workflow (see host-workflows.md). It should exist at `in-progress/[episode]-metadata.md` before cleanup begins.

**Expected input:**
- Raw transcript path (e.g., `references/transcripts/001.txt`)
- Metadata file path (e.g., `references/in-progress/001-metadata.md`)

**If the metadata file exists:**

1. Read it using your normal Read tool — it's small and designed for this purpose.
2. Extract the following for use during cleanup:
   - Overview (word count, speakers, timestamp format)
   - Chapter markers (topic shifts with timestamps)
   - Technical terms (verified spellings and canonical forms)
   - Flagged ambiguities that still need resolution
3. If there are unresolved ambiguities (terms flagged with < 99% confidence), ask the user to verify them now before proceeding.
4. Proceed to Step 1.

**If the metadata file does NOT exist:**

Fall back to running the pre-process analysis yourself. Spawn a subagent to perform whole-file analysis.

**Spawn a Task subagent with these instructions:**

Provide the subagent with:
- The transcript file path
- The skill scripts directory path (for `slice.py`)

#### Subagent Flowchart (Keep It Simple)

```
1. wc -l {transcript}  →  get LINE_COUNT
2. slice.py --start-line 1 --line-count LINE_COUNT  →  read ENTIRE FILE
3. You now have the full transcript content. DO NOT read the file again in any other way.
4. Complete ALL tasks below using the content you already have. NO nested subagents.
```

**Do NOT overcomplicate this.** One subagent, one read of the file, all analysis done in that subagent.

#### Tasks for the subagent:

1. **Explain segment structure** — Review the transcript format and confirm what constitutes a segment (speaker line, text, timestamp, blank line separators). Report any format variations.

2. **Get word count and content overview** — From the `slice.py` output, report:
   - Total word count from `SLICE END`
   - Estimated number of segments
   - List of unique speakers found

3. **Identify and verify jargon (CRITICAL)** — Scan the transcript content for ALL technical terms, proper nouns, and domain-specific language. Look for:
   - camelCase or PascalCase words (likely code/library names)
   - Repeated unusual spellings
   - Terms that appear inconsistently spelled
   - Acronyms and initialisms
   
   **Verification requirements:**
   - You MUST use ALL available tools to identify what each term refers to:
     - **Web search** — search for the term, related projects, libraries, or concepts
     - **Repository search** — grep the codebase for the term or similar spellings
     - **Documentation lookup** — check if the term appears in docs, READMEs, or comments
   - For each term, report:
     - The term as it appears in the transcript
     - What it likely refers to (with evidence from searches)
     - The canonical spelling
     - Confidence level (must be 99%+ to proceed without human verification)
   - **If confidence is below 99%, flag the term for human clarification**

4. **Initial referenceable item scan** — Note things that may be useful for downstream enrichment:
   - Tools, products, frameworks, libraries, protocols mentioned
   - Skills or workflows mentioned by name
   - Companies, organizations, or people (beyond the speakers)
   - Specific articles, blog posts, videos, talks, or episodes referenced
   - Memes or cultural references
   
   Do not resolve or research these deeply yet. Just note them in chronological order and whether they look like directory candidates (likely to recur) or one-off references.

5. **Flag ambiguities** — Note any unclear speaker attributions, unfinished thoughts at file boundaries, or content that will need human clarification.

6. **Detect timestamp format** — Identify the timestamp format used (e.g., `00:01:23`, `[1:23]`, inline vs. separate line). Report the pattern for consistent handling.

7. **Note major topic shifts** — Identify where conversation shifts topics significantly. Record the timestamp for each shift. These become chapter markers in the final output.

After the subagent returns, **write ALL findings to the metadata file at `in-progress/[episode]-metadata.md`** before proceeding. This persists the analysis so you don't lose it.

**Write to metadata file:**
- Total word count and estimated windows (total words ÷ 2000)
- List of unique speakers
- Segment structure notes
- Timestamp format
- Major topic shifts (with timestamps for chapter markers)
- ALL identified technical terms (with verification status and canonical spelling)
- Flagged ambiguities

**Do NOT write referenceable items to the metadata file.** Those go in the separate observations file during cleanup (see Step 1).

**Then verify flagged jargon with the user** — use human-in-the-loop to confirm any terms the subagent couldn't verify with 99% confidence. Update the metadata file with verified spellings.

### Step 1: Initialize Observations File

Create the observations file using your normal Write tool. This file is separate from the metadata file.

**Metadata file (read-only):** `in-progress/[episode]-metadata.md`
- Created by the producer during First-Pass Discovery
- Contains overview, chapter markers, technical terms
- **Do NOT write to this file** — only read it for reference during cleanup

**Observations file (append-only):** `in-progress/[episode]-observations.md`
- Your working log for referenceable items and title candidates
- Create this file at the start of cleanup

**Observations file structure:**

```markdown
## Cleanup Decisions
{non-obvious decisions, e.g., "treating 'auxlint' as 'Oxlint'"}

## Observations Log
{append-only log of referenceable items and title candidates}
```

**The Observations Log is strictly append-only.** As you process each window, append new entries for referenceable items and title candidates immediately after encountering them, before moving to the next window. Each entry should include:
- What was mentioned
- Classification: `[directory]`, `[one-off]`, or `[title]`
- Any notes

**Append incrementally, not in batches.** After cleaning each window, append observations from that window to the observations file before starting the next window. Do not accumulate observations across multiple windows and then write them all at once.

Example entries:
```
- [directory] "Cursor" — AI code editor, mentioned multiple times
- [one-off] "that Simon Willison post about..." — specific article, needs URL
- [directory] "MCP" — protocol, recurring reference
- [title] "They're All Markdown Files" — Nick's reaction to seeing the skill structure
- [title] "The Vibes Are the Spec" — on trusting intuition during ideation
```

**Why incremental logging matters:** Batch-populating the observations log after several windows defeats its purpose as a running record. If you lose context or need to restart, the incremental log shows exactly where you left off and what you noticed along the way.

### Step 2: Read Window + Look-ahead

For each batch:
1. Use `scripts/slice.py` with `--start-line` set to 1 (first window) or `TARGET REACHED after_line + 1` from the previous window
2. Target 2000 words; the script will include look-ahead content past the `TARGET REACHED` marker
3. Verify domain terminology if needed (see Terminology Verification below)
4. Consult the metadata file for prior decisions on technical terms

Clean only up to the `TARGET REACHED` marker; treat remaining lines as look-ahead context.

### Step 3: Clean Up the Window

Process ONLY content up to the TARGET REACHED marker. Use look-ahead only to understand where sentences are going.

**Before cleaning:**
- Consult the metadata file for verified technical terms (read-only)
- Log any new cleanup decisions to the observations file's Cleanup Decisions section
- Note any phrases or moments that could work as episode titles

See the Cleaning Rules section below for detailed instructions.

### Step 4: Append to Output

After cleaning a window, follow this procedure:

1. Append any new referenceable items to the observations file's Observations Log (in order, with classification)
2. Append the cleaned chunk (content up to `TARGET REACHED`) to the cleaned transcript using `scripts/append.py`
3. Note `TARGET REACHED after_line`—your next window starts at `after_line + 1`

**CRITICAL: Use `TARGET REACHED after_line`, NOT `SLICE END last_line`.**
- `TARGET REACHED after_line` = the last line you cleaned (content boundary)
- `SLICE END last_line` = the last line of the entire slice including look-ahead

If you use `SLICE END`, you'll skip the look-ahead content. The look-ahead from this window should become the start of the next window.

**Duplicate prevention:**
If you always use `TARGET REACHED after_line + 1` as your next `--start-line`, you won't duplicate content. Do NOT read the cleaned output file to verify—that defeats the purpose of append-only workflow.

### Step 5: Advance and Repeat

1. Set `--start-line` to `TARGET REACHED after_line + 1` from the previous window
2. Set `--buffer-words` to 0 (new window starts fresh)
3. Repeat Steps 2-4 until transcript is complete

**Between windows vs. within a window:**
- **Between windows:** `--buffer-words 0`, start from `TARGET REACHED after_line + 1`
- **Within a window (short slice):** `--buffer-words` = accumulated words, start from `SLICE END last_line + 1`

**Only clean what the slicer printed.** Never reconstruct from memory or synthesize from multiple slices.

### Step 6: Finalize with Chapters

After processing the entire transcript, generate podcast-style chapters.

**Chapter Guidelines:**
- **5-10 chapters** for a 30-minute episode (scale proportionally)
- **Catchy, scannable titles** — something a listener would see and think "oh, I want that part"
- **Major topic shifts only** — each chapter marks a real gear-change in conversation
- **NOT a detailed outline** — avoid chapter-per-tangent; consolidate related discussion

The chapter markers from the metadata file (created during First-Pass Discovery) are your starting point. Do a **post-conversion chapter review pass** before finalizing them in the cleaned transcript.

#### Required Post-Conversion Chapter Review Pass

Before you lock the chapters into the cleaned transcript, compare the proposed chapter markers against all 3 artifacts:

1. **Raw transcript segments** — verify that each timestamp lands on a real conversational pivot in the original segmented transcript, not just in your memory of the cleanup
2. **Metadata file** — compare the chapter markers from the producer's first-pass discovery against your observations during cleanup
3. **Cleaned transcript** — make sure each title still accurately describes the cleaned discussion that follows the timestamp

During this pass, explicitly check:
- **Timestamp alignment** — does the timestamp land on the start of the discussed topic, or is it early/late?
- **Title accuracy** — is the title describing what actually begins there?
- **Canonical naming** — do chapter titles use the canonical public names for products, tools, and frameworks, not the transcript's phonetic or lowercase spelling?
- **Density** — are there too many chapters for the episode length, creating an outline instead of chapters?
- **Listener usefulness** — are the titles scannable, concrete, and worth clicking?
- **Boundary quality** — do adjacent chapters mark genuinely different topics, or should they be merged or shifted?

If the chapter markers in the metadata file and cleaned transcript disagree, treat the cleaned transcript chapter list as **not yet finalized**. Reconcile the differences by checking the raw transcript segments and then update the cleaned transcript with the corrected chapter list.

Only after this comparison pass should you prepend the final chapters to the cleaned transcript. Do NOT add timestamps inline throughout the text.

---

## Cleaning Rules

### Mandatory Removals

| Remove | Examples |
|--------|----------|
| Filler words | um, uh, like, you know, I mean, sort of, kind of |
| Verbal stumbles | False starts, stuttering, repeated words |
| Filler agreements | yeah, mm-hmm, right, uh-huh (when just acknowledging) |
| Timestamps | Remove from inline text (preserve for final Chapters only) |

**Example stumble cleanup:**
- Before: "I think, I think we should go to the, to the store"
- After: "I think we should go to the store"

### Sentence Restoration

Transcripts often have broken sentences across lines. Fix these contextually:

| Issue | Fix |
|-------|-----|
| Missing period before capital letter | Add period: "end of thought New idea" → "end of thought. New idea" |
| Sentence split across lines | Merge into single sentence |
| Interrupted thought resumed | Use hyphen or ellipsis as appropriate |
| Speaker trails off, picks up differently | New sentence |

### Speaker Consolidation

If a speaker talks across multiple consecutive segments, consolidate into their first occurrence:

**Before:**
```
**Alice**: I was thinking about
**Alice**: the project timeline
**Alice**: and whether we can ship by Friday.
```

**After:**
```
**Alice**: I was thinking about the project timeline and whether we can ship by Friday.
```

### Number Formatting

Write numbers as digits, not words:
- "twenty-three" → "23"
- "two hundred" → "200"
- "a couple" → "2" (when meaning a specific quantity)

### Repetition as Clarification

If a speaker repeats themselves, they may be clarifying. Defer to the clearer version:

**Before:** "It's a, it's basically a state machine—a finite state machine."
**After:** "It's a finite state machine."

### Quoted Speech

When a speaker is quoting something or having a pretend conversation, use quotation marks:

**Before:** And then the user would say well what about this edge case
**After:** And then the user would say, "Well, what about this edge case?"

### Handles vs Names

When a speaker mentions a handle (username, CLI command, package name, file path, or code identifier) versus a proper name, format handles with backticks:

| Mention Type | Example | Format |
|--------------|---------|--------|
| Twitter/GitHub handle | @nicknisi | `@nicknisi` |
| CLI command | npm install | `npm install` |
| Package name | the ai-sdk package | the `ai-sdk` package |
| File path | the SKILL.md file | the `SKILL.md` file |
| Code identifier | the useChat hook | the `useChat` hook |
| Proper name | Nick Nisi | Nick Nisi (no backticks) |
| Product name | Cursor | Cursor (no backticks) |

Use context to distinguish: "I saw nicknisi post about it" (handle, use `@nicknisi`) vs "Nick talked about it" (name, no formatting).

### Terminology Verification

If you suspect a technical term is mis-transcribed, verify it without polluting your context window.

**Lookup hierarchy (in order of preference):**
1. **Spawn a subagent** — delegate the lookup to a Task subagent; it returns only the answer. The subagent should exhaust all search options (web search, repo search, documentation) before returning.
2. **Semantic search** — use native codebase search if available
3. **Grep** — search for the term with `rg` or Grep tool
4. **File slice** — if you must read a file, use line ranges to read only the relevant section
5. **Ask the user** — if none of the above yields 99% confidence, use human-in-the-loop

Common issues to verify:
- Homophones (their/there, affect/effect)
- Technical terms (camelCase names, library names)
- Domain jargon

**Confidence threshold:** Do not proceed with a term correction unless you have 99% confidence in the canonical spelling. When in doubt, ask the user.

---

## Referenceable Item Tracking

While cleaning, notice and log items that may be useful for downstream enrichment. This happens incrementally as you process each window, not as a batch at the end.

### What to Notice

**Directory candidates** — things likely to recur across episodes:
- Tools and products
- Frameworks and libraries
- Protocols and file conventions
- Companies and organizations
- Skills mentioned by name
- Coined podcast terms or recurring show segments

**One-off references** — things worth linking but unlikely to recur:
- Specific articles or blog posts
- Specific videos, talks, or conference presentations
- Specific episodes of other shows
- Memes or cultural references with a canonical source
- One-off project mentions

**Possible episode titles** — phrases or moments that could work as titles:
- Memorable quotes or turns of phrase
- Surprising statements or conclusions
- Recurring themes crystallized into a phrase
- Anything that captures the spirit of the conversation

Title candidates are logged only during per-window processing, not in the subagent pre-analysis.

### How to Log

Append observations to the **observations file** (`in-progress/[episode]-observations.md`) as you encounter them, in chronological order. Each entry should include:
- What was mentioned (verbatim or the canonical name if you have verified it)
- Whether it looks like a directory candidate or one-off reference
- Any notes about ambiguity or confidence

**Log immediately, not later.** After cleaning each window, append that window's observations before proceeding to the next slice. Do not defer logging until several windows have been processed.

Chronological order is sufficient. The cleaned transcript won't have timestamps or line numbers, so enrichment will find items by scanning in order.

Do not research or resolve these during cleanup. The observation log feeds the separate enrichment workflow.

---

## Quick Reference Checklist

**Before starting (once):**
- [ ] Load metadata file from `in-progress/[episode]-metadata.md`
- [ ] If metadata file doesn't exist, run the fallback subagent analysis
- [ ] Ask user to verify any flagged jargon (< 99% confidence)
- [ ] Create observations file at `in-progress/[episode]-observations.md`
- [ ] Cleaned file is created automatically on first append at `in-progress/[episode]-cleaned.md`

**For each window:**
- [ ] Set `--start-line` to 1 (first window) or `TARGET REACHED after_line + 1` (subsequent windows)
- [ ] Read one slice with `scripts/slice.py`, targeting 2000 words (script adds look-ahead past target)
- [ ] Check metadata file for prior technical term decisions (read-only)
- [ ] Ask user about any new context gaps
- [ ] Notice referenceable items (tools, articles, skills, etc.) and possible episode titles
- [ ] Remove: um, uh, like, you know, yeah, mm-hmm, etc.
- [ ] Fix broken sentences (missing periods, split lines)
- [ ] Consolidate consecutive same-speaker segments
- [ ] Numbers as digits (23 not twenty-three)
- [ ] Verify suspicious technical terms; log new cleanup decisions to observations file
- [ ] Append new observations to observations file (referenceable items with classification, title candidates)
- [ ] Append cleaned content (up to `TARGET REACHED`) to `in-progress/[episode]-cleaned.md`
- [ ] Note `TARGET REACHED after_line` — next window starts at `after_line + 1`

**After transcript conversion is complete:**
- [ ] Review chapter markers from metadata file against the raw transcript segments
- [ ] Compare metadata chapter markers vs cleaned transcript chapter list
- [ ] Adjust timestamps, titles, and density before finalizing chapters
- [ ] Prepend the finalized chapter list to the cleaned transcript
