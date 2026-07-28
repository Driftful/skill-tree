---
name: transcript-cleanup
description: Process transcripts using context-safe slicing tools. Reads in word-count batches with look-ahead, verifies terminology, and appends to output. Includes cleaning rules for accuracy over polish. Use when cleaning up raw transcripts.
---

# Transcript Cleanup

Tools and instructions for processing raw transcripts into polished documents. This skill provides:
- **Context-safe tools** — slice.py and append.py for handling long transcripts without context overflow
- **Processing workflow** — step-by-step instructions in [references/cleaning-rules.md](references/cleaning-rules.md)

## Context Hygiene (READ FIRST)

**This skill processes long transcripts. Protecting your context window is critical.**

### Hard Rules

**DO NOT use the Read tool on the transcript file. EVER. Not even "just a few lines."**

Use `scripts/slice.py` for ALL transcript reads. No exceptions.

1. **Never read the transcript directly** — no Read tool, no `cat`, no `head`, no `tail`. Only `slice.py`.
2. **Never read a line twice** — if a slice is short, continue from `SLICE END last_line + 1`, don't restart.
3. **Never read or write the cleaned output file** — only append to it. The sole exception is the final chapter prepend in Step 6, which concatenates via a temp file and still never reads the transcript.
4. **Never print cleaned content to the user** — append it to the file silently. Printing wastes context.
5. **Never modify `--target-words`** — it is ALWAYS the same value start-to-finish. The script does the math with `--buffer-words`.
6. **Never read full codebase files** — for terminology lookups, use subagents, grep, or file slices.
7. **Never read script source files** — run `python3 scripts/slice.py -h` or `python3 scripts/append.py -h` to learn usage.

### What You CAN Freely Read and Write

**The metadata file (if provided) is read-only.** It's small and contains pre-analyzed transcript information. Use your normal Read tool to consult it for technical terms, chapter markers, and overview information.

**The observations file is append-only.** Named `{transcript}-observations.md` (e.g., `episode.txt` → `episode-observations.md`). Append cleanup decisions, notable mentions, and title candidates as you go.

**The cleaned output file is off-limits.** Named `{transcript}-cleaned.md` (e.g., `episode.txt` → `episode-cleaned.md`). Never read it, never write to it directly—only append. The one exception is prepending the final chapter block in Step 6; see [cleaning-rules.md](references/cleaning-rules.md) for the temp-file concatenation that does this without reading the file.

### Why This Matters

A 10,000-word transcript consumes attention you need for accurate cleanup. Reading the output file to "append" doubles your context cost per iteration. By the third window, you've lost the capacity for careful work.

## Definitions

- **Segment**: A block containing speaker name, spoken text, timestamp, and surrounding blank lines. Segments are separated by blank lines. A typical segment looks like:
  ```
  **Speaker Name**: The spoken text goes here.
  00:01:23
  ```
- **Window**: The target slice currently being processed.
- **Look-ahead**: 5 additional segments read only for context (never output).
- **Raw transcript segments**: The original transcript content as emitted by `slice.py`, still in speaker/timestamp segment form.

## slice.py

Streams through a transcript file and prints a word-count-limited slice with look-ahead.

**Usage:**
```bash
python3 scripts/slice.py <file> --start-line N --line-count M --target-words 2000
```

`--line-count` (or `--end-line`) is REQUIRED. Omitting it exits with `Provide exactly one of --end-line or --line-count`. Estimate `M` from the transcript's words-per-line so the slice comfortably exceeds `--target-words`; the script stops counting at the target and returns the remainder as look-ahead.

Run `scripts/slice.py -h` for all arguments.

**Output markers:**
- `SLICE START`: metadata about slice parameters
- `TARGET REACHED`: appears AFTER the line that crosses the word budget, separating "process this" from "look-ahead only"
- `SLICE END`: final counts and whether target was reached

**Segment-aware line counts:** Request a `--line-count` that captures complete segments. The script doesn't understand segment boundaries—you must calculate line counts that avoid slicing mid-segment.

**Handling short slices (`target_reached=false`):**

If a slice ends before reaching the word target, you need more lines. **NEVER read the same lines twice.** Continue from where you left off:

1. Note `SLICE END last_line` and `slice_words` from the short slice
2. Call again with:
   - `--start-line` = `last_line + 1` (continue, don't restart)
   - `--buffer-words` = accumulated `slice_words` from previous calls
   - `--target-words 2000` (ALWAYS the same value start-to-finish — never do the subtraction yourself)
3. Repeat until `target_reached=true`

**CRITICAL:** `--target-words` is ALWAYS the same start-to-finish. The script does the subtraction. If you pass a smaller number, the math breaks.

## append.py

Appends content to a file without reading it first. Creates the file if it doesn't exist.

**Usage:**
```bash
cat <<'EOF' | python3 scripts/append.py "path/to/output.md" -
{content here}
EOF
```

Run `scripts/append.py -h` for all arguments.

**Line tracking:** Track `TARGET REACHED after_line` from slice.py — your next window starts at `after_line + 1`.

**Use `TARGET REACHED after_line`, NOT `SLICE END last_line`.** The look-ahead from this window becomes the start of the next window.
