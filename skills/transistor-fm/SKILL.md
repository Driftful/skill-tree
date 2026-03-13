---
name: transistor-fm
description: Use the local Transistor CLI to inspect or mutate the authenticated user, shows, episodes, subscribers, and webhooks through a help-first interface.
---

# Transistor.fm CLI

Assume the current working directory is the `transistor-fm` skill root.

## Use This Skill When

- The user asks to inspect or mutate the authenticated Transistor user, shows, episodes, subscribers, or webhooks data.
- The user needs API-aware CLI guidance without memorizing endpoints or flag names.
- The remote record is ready to be changed after any local content validation has already happened.

Do not use this skill by itself as the decision-maker for local MP3 readiness.
If the task involves a local audio file, complete any required local audio validation before any upload or episode-audio replacement.

## Start Here

1. Open `references/setup.md` first for credential and execution-environment checks.
2. If the task involves a local MP3, read `references/workflows.md` and follow `Upload Local Episode Audio` before any `episodes create` or `episodes update --audio-url`.
3. Run `node scripts/transistor-fm.mjs help`.
4. Open `references/command-model.md` only when you need to choose or confirm a resource and action shape.
5. Open `references/safety.md` before any destructive or state-changing action.

## Credentials

- Runtime configuration lives in `.env`.
- Bootstrap from `.env.example`.
- Set `TRANSISTOR_API_KEY` before live API work.

## References

- `references/api-refresh.md`
- `references/setup.md`
- `references/command-model.md`
- `references/workflows.md`
- `references/safety.md`
