#!/usr/bin/env python3
"""Append content to a file without reading it first.

Preferred usage is stdin, which is the de facto standard way to pipe content
into this script:
    append.py <target-file> -

File input is supported only as a fallback when piping via stdin is not
practical:
    append.py <target-file> <chunk-file>
"""
import sys

if len(sys.argv) == 2 and sys.argv[1] in {"-h", "--help"}:
    print(__doc__)
    sys.exit(0)

if len(sys.argv) != 3:
    print(__doc__, file=sys.stderr)
    sys.exit(1)

target, source = sys.argv[1], sys.argv[2]

if source == "-":
    content = sys.stdin.read()
else:
    with open(source, "r") as src:
        content = src.read()

with open(target, "a") as dst:
    dst.write(content)

print(f"Appended {len(content)} chars to {target}")
