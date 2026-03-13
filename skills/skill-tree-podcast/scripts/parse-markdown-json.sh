#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <markdown-file>" >&2
  exit 1
fi

input_file="$1"

if [ ! -f "$input_file" ]; then
  echo "File not found: $input_file" >&2
  exit 1
fi

uv run --with python-frontmatter --with markdown python - "$input_file" <<'PY'
import json
import sys

import frontmatter
import markdown

post = frontmatter.load(sys.argv[1])

print(
    json.dumps(
        {
            "frontmatter": post.metadata,
            "markdown": post.content,
            "html": markdown.markdown(post.content),
        },
        indent=2,
    )
)
PY
