# Topic Curation

This document covers the standalone workflow for curating `data/topics/`.

## Goal

Maintain a small, stable, high-signal topic vocabulary that organizes the full podcast corpus.

## Core Rule

Topic curation is always its own workflow.

Do not create, propose, merge, split, rename, or assign topics during:

- new-episode intake
- transcript cleanup
- transcript enrichment
- speaker profile intake

## What A Topic Is

A topic is a high-level, precise, durable theme that can credibly group multiple episodes and support a long-lived landing page.

Good topics are:

- broad enough to cover multiple episodes
- narrow enough to be distinct from neighboring topics
- stable over time
- useful for navigation and aggregation

## What A Topic Is Not

A topic is not:

- a product
- a company
- a person
- a repo
- a protocol or file format
- a one-off article or blog post

Those belong in `data/directory/` or as inline transcript links instead.

## Curation Workflow

1. Review the existing `data/topics/` set.
2. Review the episode corpus as a whole, not just a single episode.
3. Identify clusters that recur across multiple episodes and are likely to continue to matter.
4. Compare candidate clusters against existing topics before creating anything new.
5. Merge or rename topics when the vocabulary has become redundant or unclear.
6. Split topics only when one topic has become too broad to remain precise.
7. Update episode `topics:` lists only as part of this curation pass.

## Decision Standard

Create a new topic only when an existing topic plus directory links cannot accurately represent the pattern across the corpus.

If a name points to a specific tool such as `DeepWiki` or `Claude Code`, it is usually a directory entry, not a topic.
