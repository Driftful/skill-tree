#!/usr/bin/env python3
"""Slice a transcript by line with streaming reads and word budget tracking.

The script streams through the file, printing only the requested slice with
two marker lines:

- `SLICE START`: metadata about the slice parameters
- `TARGET REACHED`: appears AFTER the line that crosses the word budget,
  separating "process this" from "look-ahead only"

If the buffered words already meet or exceed the target, the script exits with
an error instead of emitting a misleading marker.

If the slice ends before reaching the target, no TARGET REACHED marker appears,
and SLICE END reports `target_reached=false`.

Line numbers are 1-based. The `--buffer-words` parameter tells the script how
many words the client already has buffered, so the script can calculate how
many more words are needed to reach the target.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

WORD_RE = re.compile(r"\S+")


def count_words(text: str) -> int:
    return len(WORD_RE.findall(text))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Stream a line-based slice from a transcript and mark where the "
            "word budget is reached."
        )
    )
    parser.add_argument("file", help="Path to the transcript file to slice")
    parser.add_argument(
        "--start-line",
        type=int,
        required=True,
        help="Inclusive 1-based line number where the slice begins",
    )
    parser.add_argument(
        "--buffer-words",
        type=int,
        default=0,
        help=(
            "Words the client already has buffered. The script calculates "
            "how many more words are needed: target - buffer-words"
        ),
    )
    parser.add_argument(
        "--end-line",
        type=int,
        help="Inclusive 1-based line number where the slice ends",
    )
    parser.add_argument(
        "--line-count",
        type=int,
        help="Number of lines to include, starting from --start-line",
    )
    parser.add_argument(
        "--target-words",
        type=int,
        default=2000,
        help="Desired total words (buffer + slice) before marking target reached",
    )
    return parser.parse_args()


def validate_args(args: argparse.Namespace) -> None:
    if args.start_line < 1:
        raise ValueError("--start-line must be at least 1")
    if args.buffer_words < 0:
        raise ValueError("--buffer-words must be 0 or greater")
    if args.target_words < 0:
        raise ValueError("--target-words must be 0 or greater")
    if args.buffer_words >= args.target_words:
        raise ValueError(
            "--buffer-words must be less than --target-words; "
            "the target is already reached"
        )

    has_end_line = args.end_line is not None
    has_line_count = args.line_count is not None
    if has_end_line == has_line_count:
        raise ValueError("Provide exactly one of --end-line or --line-count")

    if has_end_line and args.end_line < args.start_line:
        raise ValueError("--end-line must be greater than or equal to --start-line")

    if has_line_count and args.line_count < 1:
        raise ValueError("--line-count must be at least 1")


def resolve_end_line(start_line: int, end_line: int | None, line_count: int | None) -> int:
    if end_line is not None:
        return end_line
    assert line_count is not None
    return start_line + line_count - 1


def main() -> int:
    args = parse_args()
    try:
        validate_args(args)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    path = Path(args.file)
    if not path.exists():
        print(f"error: file not found: {path}", file=sys.stderr)
        return 1
    if not path.is_file():
        print(f"error: not a file: {path}", file=sys.stderr)
        return 1

    words_needed = max(0, args.target_words - args.buffer_words)
    words_in_slice = 0
    target_emitted = False
    last_line_in_slice = args.start_line - 1

    end_line: int | None = None
    if args.end_line is not None or args.line_count is not None:
        end_line = resolve_end_line(args.start_line, args.end_line, args.line_count)

    print(
        "--- SLICE START "
        f"start_line={args.start_line} "
        f"buffer_words={args.buffer_words} "
        f"target_words={args.target_words} "
        f"words_needed={words_needed} "
        + (f"end_line={end_line} " if end_line else "")
        + "---"
    )

    with path.open(encoding="utf-8") as f:
        for line_number, line in enumerate(f, start=1):
            line = line.rstrip("\n\r")

            if line_number < args.start_line:
                continue

            if end_line is not None and line_number > end_line:
                break

            print(line)
            words_in_line = count_words(line)
            words_in_slice += words_in_line
            last_line_in_slice = line_number

            if not target_emitted and words_needed > 0 and words_in_slice >= words_needed:
                print(
                    "--- TARGET REACHED "
                    f"after_line={line_number} "
                    f"slice_words={words_in_slice} "
                    f"total_words={args.buffer_words + words_in_slice} ---"
                )
                target_emitted = True

    if last_line_in_slice < args.start_line:
        print(
            f"error: --start-line {args.start_line} is beyond end of file",
            file=sys.stderr,
        )
        return 1

    if end_line is not None and last_line_in_slice < end_line:
        print(
            f"warning: file ended at line {last_line_in_slice}, "
            f"before requested end_line {end_line}",
            file=sys.stderr,
        )

    print(
        "--- SLICE END "
        f"last_line={last_line_in_slice} "
        f"slice_words={words_in_slice} "
        f"total_words={args.buffer_words + words_in_slice} "
        f"target_reached={str(target_emitted).lower()} ---"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
