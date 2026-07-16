---
number: 2
title: "I Haven't Given It a Soul"
status: published
hosts:
  - neil-roberts
  - nick-nisi
guests: []
transcript: references/transcripts/002-i-havent-given-it-a-soul.md
transcript_cleaned: true
transcript_enriched: true
topics: []
publishing:
  audio_url: https://uploads.transistor.fm/7ba9704e04decdf6ddc2d13826a291a0.mp3
  episode_id: 3395809
  status: published
  published_at: 2026-07-14T18:57:06.203Z
  share_url: https://share.transistor.fm/s/50ec1dfb
  transcript_url: https://share.transistor.fm/s/50ec1dfb/transcript
---

Episode 2 of The Skill Tree is a hosts-only catch-up where Neil Roberts and Nick Nisi trade notes on a fast-moving few weeks in AI coding tools. They dig into the Ralph Loop arriving as a `/goal` command, the personal utilities they are each building around their agents, the industry's drift from Markdown to HTML for agent output, and a genuinely unnerving npm supply-chain worm.

The conversation is less about any single tool and more about the workflows forming around them. Nick walks through a session-search tool he built to fuzzy-find across every Claude, Pi, and Codex transcript he has ever run, and Neil describes the Dockerized, mobile-first OpenCode setup he wired to Readwise Reader, Tailscale, and a synced Obsidian vault — a rig so pleasant to use that Nick asks whether he has accidentally built his own OpenClaw. "I haven't given it a soul," Neil says.

## In This Episode

- Where looping agents like the Ralph Loop (`/goal`) actually help, and where the context window still gets in the way
- The small cross-tool utilities worth building yourself: Nick's session-search tool and Neil's mobile agent stack
- Why the AI crowd is rediscovering web development — external stylesheets, token budgets, and Cloudflare Code Mode — as agent output shifts from Markdown to HTML
- The npm supply-chain worm Shai-Hulud, its dead man's switch, and what it does to your trust in `npm install`

## Episode Chapters

- `00:00` An Honor Just to Be Nominated
- `01:02` Notion, Obsidian, and Claude Writing Your Docs
- `01:57` The Ralph Loop Arrives as `/goal`
- `07:31` Nick's Sessions Tool: Searching Every Transcript
- `12:11` Walled Gardens: CLAUDE.md vs AGENTS.md
- `15:10` Chasing Subagents Across Pi and OpenCode
- `19:01` Broken Agent IDEs and "Everything's Vibe Coded"
- `21:11` The TanStack Attack and Shai-Hulud
- `22:03` OpenCode Go, ChatGPT, and Claude's $20 Plan
- `23:08` The Unreasonable Effectiveness of HTML
- `27:40` Constraints, Cloudflare Code Mode, and Throwaway Scripts
- `31:28` npm Supply-Chain Fear and the Dead Man's Switch
- `32:38` Neil's Dockerized Mobile Stack
- `38:07` Is It an OpenClaw? Hermes, Raindrop, and OpenCode
- `42:42` Outro: Procrastination and Intuitive Living

## When Looping Agents Earn Their Keep

The episode opens on the Ralph Loop — the trick of running an agent in a while-loop against the same prompt — showing up as a first-class `/goal` command in both Codex and Claude. Nick recounts pointing it at a real task and watching it report back, "I have been running for an hour and three minutes. Goal achieved." Neil counters with a non-loop version of the same instinct: using Maestro end-to-end tests to let an agent iterate on his React Native app until the Android build actually worked.

The useful part is where they draw the line. Looping shines on deterministic, verifiable workflows, and falls down where the context window does. That tension — between letting an agent grind autonomously and keeping it on a short enough leash to stay accurate — runs under most of the tools they discuss.

## Building Your Own Tools Around the Agents

Both hosts have started treating their agents as platforms to build on. Nick's session-search tool indexes every Claude, Pi, and Codex transcript into SQLite — even across deleted worktrees — so he can fuzzy-find that thing he did last week, and he wraps it in an MCP server so the agents can search their own history. Neil's project is a Docker Compose stack he can drive from his phone: OpenCode's web server behind Tailscale, VS Code and a couple of web file browsers, and a Readwise Reader pipeline that summarizes saved articles through an agent and files them into a CouchDB-synced Obsidian vault as a daily "dispatch."

It is the moment Neil describes that setup — nice enough that Nick asks if it is "an OpenClaw" — that gives the episode its title. The throughline is that a lot of the value now comes from the unglamorous plumbing you assemble yourself, not the model.

## Markdown, HTML, and Rediscovering the Web

The back third turns to a shift in how agents are told to produce output: away from Markdown and toward HTML. Nick brings up Thariq Shihipar's post on the unreasonable effectiveness of HTML, and the two connect it to Cloudflare Code Mode, where forcing the model to write one throwaway TypeScript script instead of many tool calls cut token usage by nearly 90%. Neil's read is that the whole industry is watching people rediscover web development — external stylesheets, image optimization, token budgets as the new bandwidth constraint — and that the right response to repetitive work is often to have the machine write a small script and move on.

Threaded through it all is a real note of supply-chain dread: the self-propagating npm worm Shai-Hulud, and the dead man's switch that would wipe a home directory if it detected you rotating your GitHub token. It is a good reminder that the same ecosystem making all this possible can still bite hard.

## Tools, Projects, and References Mentioned

- Ralph Loop and `/goal` - running an agent in a loop against one prompt, now surfaced as a slash command in Codex and Claude
- OpenCode (and OpenCode Go) - the provider-agnostic terminal agent, web server, and open-model tier at the center of Neil's mobile setup
- Pi, Codex, Devin, Warp, and Hermes - the other agents and IDEs the hosts are poking at, from PR-comment automation to Nous Research's agent framework
- Maestro - the YAML-driven mobile end-to-end testing tool Neil used to fix his React Native app
- Cloudflare Code Mode, Flue, and Astro - the Cloudflare-flavored thread on typed SDKs, sandboxed TypeScript agents, and Fred Schott's team
- Readwise Reader, Obsidian, CouchDB, Tailscale, and Raindrop.io - the personal-knowledge and networking plumbing behind both hosts' automations
- Shai-Hulud - the npm supply-chain worm and its credential-rotation dead man's switch

## Related Listening

- [They're All Markdown Files](000-theyre-all-markdown-files.md)
- [Cleaning the Fridge: The Hero's Journey](001-cleaning-the-fridge-the-heros-journey.md)
