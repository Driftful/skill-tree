#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "python-frontmatter",
#   "markdown",
# ]
# ///
# pyright: reportMissingImports=false, reportMissingModuleSource=false
from datetime import date, datetime
import json
from pathlib import Path
import sys

import frontmatter
import markdown


def json_default(value: object) -> str:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    raise TypeError(f"Object of type {type(value).__name__} is not JSON serializable")

if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} <markdown-file>", file=sys.stderr)
    raise SystemExit(1)

input_file = Path(sys.argv[1])

if not input_file.is_file():
    print(f"File not found: {input_file}", file=sys.stderr)
    raise SystemExit(1)

post = frontmatter.load(input_file)

print(
    json.dumps(
        {
            "frontmatter": post.metadata,
            "markdown": post.content,
            "html": markdown.markdown(post.content),
        },
        indent=2,
        default=json_default,
    )
)
