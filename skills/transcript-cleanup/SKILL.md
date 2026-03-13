---
name: transcript-cleanup
description: Process and clean up transcripts with high accuracy, preferring exact spoken words over polished prose. Reads transcripts in word-count batches with look-ahead, verifies domain terminology against the codebase, and appends to a new file. Use when the user asks to clean up, polish, or process a transcript accurately.
---

# Transcript Cleanup

Process raw transcripts into highly accurate documents that maintain the original voice and exact phrasing of speakers.

## Context Hygiene (READ FIRST)

**This skill processes long transcripts. Protecting your context window is critical.**

### Hard Rules

**DO NOT use the Read tool on the transcript file. EVER. Not even "just a few lines."**

Use `scripts/slice.py` for ALL transcript reads. No exceptions.

1. **Never read the transcript directly** — no Read tool, no `cat`, no `head`, no `tail`. Only `slice.py`.
2. **Never read a line twice** — if a slice is short, continue from `SLICE END last_line + 1`, don't restart.
3. **Never read or write the cleaned output file** — only append to it (see Step 4)
4. **Never print cleaned content to the user** — append it to the file silently. Printing wastes context.
5. **Never modify `--target-words`** — it is ALWAYS 2000. The script does the math with `--buffer-words`.
6. **Never read full codebase files** — for terminology lookups, use subagents, grep, or file slices
7. **Never read script source files** — run `python3 scripts/slice.py -h` or `python3 scripts/append.py -h` to learn usage

### What You CAN Freely Read and Write

**The metadata file is different.** It's small (a few dozen lines) and exists to be your memory between windows. Use your normal Read and Write tools to add verified technical terms, log decisions, and track any notes you need.

**The cleaned output file is off-limits.** Never read it, never write to it directly—only append (the file is created automatically on first append).

### Why This Matters

A 10,000-word transcript consumes attention you need for accurate cleanup. Reading the output file to "append" doubles your context cost per iteration. By the third window, you've lost the capacity for careful work.

## Human-in-the-Loop Clarifications

**When in doubt, ask.** This skill processes content where small errors compound. A mis-identified technical term becomes a consistent mistake across thousands of words.

### When to Ask the User

- **Unfamiliar jargon** — terms you cannot verify with 99% confidence through search tools
- **Ambiguous speaker attribution** — when it's unclear who is speaking
- **Unclear acronyms** — especially domain-specific ones not findable via web search
- **Spelling of proper nouns** — names of people, companies, or projects
- **Context gaps** — anything that would require guessing to clean accurately

### How to Ask

Defer to project-specific instructions or skills for human-in-the-loop interaction (e.g., a `human-in-the-loop` skill or MCP tools). If no project-specific method exists, use available question-asking tools (AskQuestion, MCP tools with user interaction, etc.). Batch related questions together when possible to minimize interruptions.

### When NOT to Ask

- Standard filler removal (um, uh, like) — apply universally
- Obvious sentence repairs — use context from the transcript
- Common technical terms you can verify via web or repo search
- Decisions already logged in the metadata file's Technical Terms or Decisions sections

**Principle:** Asking slows you down slightly but prevents compounding errors. A 30-second clarification is cheaper than re-processing 5,000 words.

## Core Philosophy

**Accuracy over polish (No paraphrasing)**: Preserve exactly what was said. Remove verbal clutter to improve readability, but **NEVER paraphrase or alter underlying sentence structure**. Even if a sentence is grammatically awkward, clean the filler and preserve the rest exactly as spoken.

## Definitions

- **Segment**: A block containing speaker name, spoken text, timestamp, and surrounding blank lines. Segments are separated by blank lines. A typical segment looks like:
  ```
  **Speaker Name**: The spoken text goes here.
  00:01:23
  ```
- **Window**: The target slice currently being processed.
- **Look-ahead**: 5 additional segments read only for context (never output).

## Workflow

### Step 0: Pre-Process Analysis (Subagent)

**Before processing any window, spawn a subagent to perform whole-file analysis.**

This analysis happens once, before the iterative cleanup loop. The subagent operates outside your main context, so it can safely read the entire transcript.

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

4. **Flag ambiguities** — Note any unclear speaker attributions, unfinished thoughts at file boundaries, or content that will need human clarification.

5. **Detect timestamp format** — Identify the timestamp format used (e.g., `00:01:23`, `[1:23]`, inline vs. separate line). Report the pattern for consistent handling.

6. **Note major topic shifts** — Identify approximate locations where conversation shifts topics significantly. These inform the final Chapters step.

After the subagent returns, **write ALL findings to the metadata file** before proceeding. This persists the analysis so you don't lose it.

**Write to metadata file:**
- Total word count and estimated windows (total words ÷ 2000)
- List of unique speakers
- Segment structure notes
- Timestamp format
- Major topic shifts (with approximate line numbers)
- ALL identified technical terms (with verification status and canonical spelling)
- Flagged ambiguities

**Do NOT use the metadata file to track progress** (e.g., "processed through line 500" or "on window 3"). Progress is implicit. Storing progress separately creates drift risk and wastes space.

**Then verify flagged jargon with the user** — use human-in-the-loop to confirm any terms the subagent couldn't verify with 99% confidence. Update the metadata file with verified spellings.
- Identify additional questions to ask the user before starting

### Step 1: Initialize Metadata File

Create the metadata file using your normal Write tool:

**Metadata file:** `{original-name}-metadata.md`
- This is your working memory for context that persists across windows
- Read and write this file freely with your normal tools (it stays small)
- Use it for: verified technical terms, cleanup decisions, notes about speakers, topic markers—whatever helps you maintain consistency

**Update the metadata file as you work** (use your normal Read/Write tools):
- Add any new technical terms you verified
- Log any non-obvious cleanup decisions (e.g., "treating 'auxlint' as 'Oxlint'")

### Step 2: Read Window + Look-ahead

For each batch:
1. Use `scripts/slice.py` with `--start-line` set to 1 (first window) or `TARGET REACHED after_line + 1` from the previous window
2. Target 2000 words; the script will include look-ahead content past the `TARGET REACHED` marker
3. Verify domain terminology if needed (see Terminology Verification)
4. Consult the metadata file for prior decisions on technical terms

Run `scripts/slice.py -h` to see available arguments. The script streams through the file and prints:
- `SLICE START`: metadata about slice parameters
- `TARGET REACHED`: appears AFTER the line that crosses the word budget, separating "process this" from "look-ahead only"
- `SLICE END`: final counts and whether target was reached

Clean only up to the `TARGET REACHED` marker; treat remaining lines as look-ahead context.

**Segment-aware line counts:** Request a `--line-count` that captures complete segments. The script doesn't understand segment boundaries—you must calculate line counts that avoid slicing mid-segment.

**Handling short slices (`target_reached=false`):**

If a slice ends before reaching the word target, you need more lines. **NEVER read the same lines twice.** Continue from where you left off:

1. Note `SLICE END last_line` and `slice_words` from the short slice
2. Call again with:
   - `--start-line` = `last_line + 1` (continue, don't restart)
   - `--buffer-words` = accumulated `slice_words` from previous calls
   - `--target-words 2000` (ALWAYS 2000 — never do the subtraction yourself)
3. Repeat until `target_reached=true`
4. Clean ALL content you've accumulated across these calls, up to `TARGET REACHED after_line`

**CRITICAL:** `--target-words` is ALWAYS 2000. The script does the subtraction. If you pass a smaller number, the math breaks.

**Human-in-the-loop:** If you encounter context gaps not covered by the pre-populated Technical Terms section (unfamiliar speaker names, new acronyms, ambiguous terms), ask the user before proceeding. See the "Human-in-the-Loop Clarifications" section above for guidance.

### Step 3: Clean Up the Window

Process ONLY content up to the TARGET REACHED marker. Use look-ahead only to understand where sentences are going.

**Before cleaning, add any new technical terms to the metadata file's Technical Terms section.**

#### Mandatory Removals

| Remove | Examples |
|--------|----------|
| Filler words | um, uh, like, you know, I mean, sort of, kind of |
| Verbal stumbles | False starts, stuttering, repeated words |
| Filler agreements | yeah, mm-hmm, right, uh-huh (when just acknowledging) |
| Timestamps | Remove from inline text (preserve for final Chapters only) |

**Example stumble cleanup:**
- Before: "I think, I think we should go to the, to the store"
- After: "I think we should go to the store"

#### Sentence Restoration

Transcripts often have broken sentences across lines. Fix these contextually:

| Issue | Fix |
|-------|-----|
| Missing period before capital letter | Add period: "end of thought New idea" → "end of thought. New idea" |
| Sentence split across lines | Merge into single sentence |
| Interrupted thought resumed | Use hyphen or ellipsis as appropriate |
| Speaker trails off, picks up differently | New sentence |

#### Speaker Consolidation

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

#### Number Formatting

Write numbers as digits, not words:
- "twenty-three" → "23"
- "two hundred" → "200"
- "a couple" → "2" (when meaning a specific quantity)

#### Repetition as Clarification

If a speaker repeats themselves, they may be clarifying. Defer to the clearer version:

**Before:** "It's a, it's basically a state machine—a finite state machine."
**After:** "It's a finite state machine."

#### Quoted Speech

When a speaker is quoting something or having a pretend conversation, use quotation marks:

**Before:** And then the user would say well what about this edge case
**After:** And then the user would say, "Well, what about this edge case?"

#### Terminology Verification

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

### Step 4: Append Cleaned Window to Polished Transcript

After cleaning a window, append it to the cleaned transcript file (`{original-name}-cleaned.md`). This builds the final output incrementally—each chunk you clean gets added to the work done so far.

**You MUST use `scripts/append.py`** unless you have access to a tool that is SPECIFICALLY designed to append to a file in a single call (not a read-then-write workaround, not stringing together multiple operations—one dedicated append call). If no such tool exists, use the script.

```bash
cat <<'EOF' | python3 scripts/append.py "{original-name}-cleaned.md" -
{cleaned content here}
EOF
```

**Procedure:**
1. Append the cleaned chunk (content up to `TARGET REACHED`) as shown above
2. Note `TARGET REACHED after_line`—your next window starts at `after_line + 1`

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

Prepend chapters to the output file. Do NOT add timestamps inline throughout the text.

## Quick Reference Checklist

**Before starting (once):**
- [ ] Spawn pre-process subagent to analyze transcript (Step 0)
- [ ] Ask user to verify any jargon the subagent flagged (< 99% confidence)
- [ ] Create metadata file (Step 1) — cleaned file is created automatically on first append
- [ ] Pre-populate Technical Terms from verified subagent findings

**For each window:**
- [ ] Set `--start-line` to 1 (first window) or `TARGET REACHED after_line + 1` (subsequent windows)
- [ ] Read one slice with `scripts/slice.py`, targeting 2000 words (script adds look-ahead past target)
- [ ] Check metadata file for prior technical term decisions
- [ ] Ask user about any new context gaps
- [ ] Remove: um, uh, like, you know, yeah, mm-hmm, etc.
- [ ] Fix broken sentences (missing periods, split lines)
- [ ] Consolidate consecutive same-speaker segments
- [ ] Numbers as digits (23 not twenty-three)
- [ ] Verify suspicious technical terms; add new ones to metadata file
- [ ] Append cleaned content (up to `TARGET REACHED`) to in-progress cleaned transcript
- [ ] Note `TARGET REACHED after_line` — next window starts at `after_line + 1`
