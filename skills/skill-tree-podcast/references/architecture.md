# Skill Architecture

## High-Level Design

The podcast is represented as an agent skill:
- Root `SKILL.md` provides compact orientation and navigation.
- Domain content is split across episodes, speakers, transcripts, and topics.
- Generated index and aggregation pages provide fast traversal paths for agents.

## Progressive Disclosure Strategy

1. Agent reads root `SKILL.md`.
2. Agent follows links to topic, episode, or speaker indexes.
3. Agent drills into leaf/source documents only as needed.

This keeps initial context small while preserving deep coverage.

## Repository Anchors

- Skill entry point: `skills/skill-tree/SKILL.md`
- Reference docs: `skills/skill-tree/references/`

## Non-Goals for Root Docs

Do not place deep operational instructions in root `AGENTS.md` or root `SKILL.md`.
Keep those files focused on orientation and navigation, not long-form process detail.
