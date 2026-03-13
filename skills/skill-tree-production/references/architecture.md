# Skill Architecture

## High-Level Design

The podcast is represented as an agent skill:
- Root `SKILL.md` provides compact orientation and navigation.
- Domain content is split across episodes, speakers, transcripts, reusable directory entries, and topics.
- Script-generated index and aggregation pages provide fast traversal paths for agents.

## Progressive Disclosure Strategy

1. Agent reads root `SKILL.md`.
2. Agent follows links to topic, episode, or speaker indexes.
3. Agent drills into leaf/source documents only as needed.

This keeps initial context small while preserving deep coverage.

## Repository Anchors

- Skill entry point: `skills/skill-tree-podcast/SKILL.md`
- Reference docs: `skills/skill-tree-podcast/references/`
- Source content: `skills/skill-tree-podcast/data/`

## Source Content Layers

- `data/episodes/`: per-episode records
- `data/speakers/`: reusable people records
- `data/transcripts/`: cleaned transcript text
- `data/directory/`: reusable named entries for things in the podcast ecosystem
- `data/topics/`: high-level corpus themes curated separately over time

Keep `directory` and `topics` distinct:

- `directory` is for concrete named things such as tools, orgs, files, protocols, and coined show terms
- `topics` is for durable high-level themes used for corpus-level organization

## Non-Goals for Root Docs

Do not place deep operational instructions in root `AGENTS.md` or root `SKILL.md`.
Keep those files focused on orientation and navigation, not long-form process detail.
