#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# ///
"""Split a transcript into one file per speaker, as plain spoken text.

Turns start with `**Speaker**: text`; paragraphs with no prefix continue the
previous speaker's turn. The name prefix and inline Markdown (links, code
spans, emphasis) are stripped, leaving only the words that were said.
"""
from pathlib import Path
import re
import sys

SPEAKER = re.compile(r"^\*\*([^*]+)\*\*:\s*")
# [text](url) -> text, allowing one level of nested parens in the url
LINK = re.compile(r"\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)")
CODE = re.compile(r"`([^`]*)`")
EMPHASIS = re.compile(r"\*{1,2}([^*]+)\*{1,2}")


def strip_markdown(text: str) -> str:
    text = LINK.sub(r"\1", text)
    text = CODE.sub(r"\1", text)
    return EMPHASIS.sub(r"\1", text)

if not 2 <= len(sys.argv) <= 3:
    print(f"Usage: {sys.argv[0]} <transcript.md> [output-dir]", file=sys.stderr)
    raise SystemExit(1)

input_file = Path(sys.argv[1])
output_dir = Path(sys.argv[2]) if len(sys.argv) == 3 else input_file.parent / f"{input_file.stem}-by-speaker"

if not input_file.is_file():
    print(f"File not found: {input_file}", file=sys.stderr)
    raise SystemExit(1)

turns: dict[str, list[str]] = {}
current: str | None = None

for paragraph in input_file.read_text().split("\n\n"):
    paragraph = paragraph.strip()
    if not paragraph:
        continue
    match = SPEAKER.match(paragraph)
    if match:
        current = match.group(1).strip()
        paragraph = paragraph[match.end():]
    elif current is None:
        print(f"Text before the first speaker label: {paragraph[:60]!r}", file=sys.stderr)
        raise SystemExit(1)
    turns.setdefault(current, []).append(strip_markdown(paragraph))

output_dir.mkdir(parents=True, exist_ok=True)

for speaker, paragraphs in turns.items():
    slug = re.sub(r"[^a-z0-9]+", "-", speaker.lower()).strip("-")
    out = output_dir / f"{slug}.md"
    out.write_text("\n\n".join(paragraphs) + "\n")
    print(f"{out}: {len(paragraphs)} paragraphs")
