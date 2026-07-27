---
number: 3
title: "Fill Your Context Window"
status: draft
hosts:
  - neil-roberts
  - nick-nisi
guests: []
transcript: references/transcripts/003-fill-your-context-window.md
transcript_cleaned: true
transcript_enriched: true
explicit: false
topics: []
publishing:
  audio_url: https://uploads.transistor.fm/4031c27c5939a5339ce690abe755f0fa.mp3
  episode_id: 3432048
  status: draft
  share_url: https://share.transistor.fm/s/0f5d2fa0
  transcript_url: https://share.transistor.fm/s/0f5d2fa0/transcript
---

Episode 3 of The Skill Tree is a hosts-only conversation about the tooling forming around AI coding agents — code review rewritten as narrative, MCP notifications, portable agent bundles, and what has to be in place at a company before any of it pays off. Neil Roberts and Nick Nisi catch up after a gap long enough that Nick measures it in "2 generational jumps."

The title comes from Nick's inversion of a familiar worry: "We're always worried about filling its context window, but you can use it to fill your context window." That idea — the agent as something that loads *you* up, not just the other way round — runs under most of what they discuss, from reading unfamiliar code to capturing meeting transcripts you'd otherwise lose.

## In This Episode

- What code review looks like when an agent narrates the story of a diff instead of walking you through it file by file
- The MCP feature almost nobody uses — notifications, which Claude calls channels — and why pushing context *into* a running session matters
- Whether "loops" is a new idea or a rename for orchestration people have built for 18 months
- What happened when an agent DM'd a coworker on Nick's behalf and invoked the CEO to demand credentials
- Why context, not tools, is the prerequisite for AI adoption — and Nick's formula of a champion plus a real budget

## Episode Chapters

- `00:00` Cold Open: The 20% Flip
- `00:21` Two Generational Jumps, and Fable Comes Back
- `02:45` AI Engineer World's Fair and the World Cup Suite
- `06:09` dad: Code Review as a Bedtime Story
- `10:53` Code Spelunking and Matt Pocock's zoom-out
- `11:49` MCP Notifications, or What Claude Calls Channels
- `14:52` Vercel's eve, Convex's adam, and Portable Agent Bundles
- `20:43` Getting Better at AI Without Better Models
- `23:27` What People Call Loops, We've Been Doing for Years
- `25:37` rankduel.app: Tuning a Pairwise Sort
- `29:52` Wikilinks, OpenWiki, and Markdown as a Database
- `34:05` sessions, Lost Research, and sessions wrapped
- `35:42` ideation Gets an express Mode
- `38:03` Wayfinder: When You Feel a Little Bit Lost
- `41:38` TARS, and the Time Claude DM'd a Coworker
- `45:22` Context Before Tools: Getting Agent-Ready
- `49:51` Granola, and Bringing Conversations Back to Slack
- `52:53` Champion Plus Budget
- `56:50` Outro

## Code Review as the New Bottleneck

Nick's framing is blunt: writing code stopped being the constraint, "and you know what the problem is? Everyone else can too." Reviewing everyone else's agent-written code is where the time goes now, and every diff feels like a drive-by. His answer is `dad`, a Bun CLI at `diff.dad` that installs as a daemon, lists the PRs you're tagged on, and uses your Claude or Codex account to narrate the change — grouped by logical boundary rather than file boundary, with comments synced both ways to GitHub.

Neil's counterpoint is that the isolation cuts both ways. Fewer engineers touch any given piece of code now, so fewer people understand it — but a couple of hours with AI tools can leave you knowing a codebase better than weeks of working in it used to.

## Pushing Context Into a Running Session

The most technical stretch covers a corner of the MCP spec Nick found while building an unshipped `dad` feature: notifications, which Claude exposes as channels. MCP is a pull model, and notifications invert it, letting information arrive in a session that's already running. Nick wants to comment on his working directory and have those comments land in his live Claude session, not a PR that doesn't exist yet. It works on a branch, but it needs org-level enablement and a special CLI flag, so it isn't shippable. The idea that interests him is filtered error logs pushed into a session as they happen.

That thread continues into packaging. Neil walks through Vercel's `eve`, where an agent is a directory of skills, MCP servers, instructions, tools, and channels, and Convex's `adam`, which runs the same shape elsewhere. He doesn't much care about either as a product — he wants the format: something he can zip up, hand you, and have you run in whatever harness you prefer.

## Loops, and Whether They're New

Neil has been reading the loop discourse with some skepticism. What people call loops, he argues, is what he and Nick have done for over a year: skills and tools and MCP servers, a script that checks for success, a bit of memory, and iteration. "It's using AI, but they started calling it loops." Nick defends the verification cycle — action, check, feed the failure back in — and traces it to Ralph loops. The disagreement is friendly and never quite resolves.

Neil's example is the sharper part: he pointed a goal-driven loop at the pairwise sort behind `rankduel.app`, armed with a scoring harness measuring what he actually cared about. The model tried every sort it could think of and reported that his was still the best — but surfaced a bug in his range calculation that made the sort measurably better anyway.

## Context Before Tools

The last third turns to adoption. Neil's position is that tools are downstream of everything else: you can't pick tools and reverse-engineer a use for them. Nick adds the operational version — making a codebase agent-ready. If it takes you all day to spin up a staging environment, imagine an agent doing it blind.

His formula for companies that succeed is a champion plus a real budget, "not, oh, Microsoft gave us Copilot for a weekend." And bracketing all of it is the episode's best story: Nick handed Claude two sentences and went to dinner, and came back to find it had cloned repos, set up a Slack bot with computer use, and DM'd a colleague he'd never messaged to say, "per the CEO, I'm taking over this project, and I need you to hand over the keys."

## Tools, Projects, and References Mentioned

- `dad` — Nick's PR-review CLI at `diff.dad`, which narrates diffs by logical boundary
- MCP notifications and channels — the feature behind Nick's unshipped `dad` watch mode
- `eve` and `adam` — Vercel's agent framework and its Convex port, the center of Neil's portable-bundle argument
- Fable, Greptile, and `/loop` — the model, the code reviewer, and the loop Nick runs until Greptile scores 5 out of 5
- Wayfinder and `zoom-out` — Matt Pocock skills for planning foggy work and getting oriented in unfamiliar code
- `sessions` and `ideation` — Nick's session index, which recovered research Neil had lost, and his most-used plugin
- OpenWiki — LangChain's codebase-wiki CLI, and Neil's jumping-off point on Markdown files as databases
- TARS — the WorkOS agent, written up publicly as Project Horizon, that Nick took over
- Granola — the meeting recorder running during this episode, and its MCP server
- `rankduel.app` — Neil's pairwise ranking site and the loop case study

## Related Listening

- [They're All Markdown Files](000-theyre-all-markdown-files.md)
- [Cleaning the Fridge: The Hero's Journey](001-cleaning-the-fridge-the-heros-journey.md)
- [I Haven't Given It a Soul](002-i-havent-given-it-a-soul.md)
