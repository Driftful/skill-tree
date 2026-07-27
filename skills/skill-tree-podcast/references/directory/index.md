---
property_indexes:
  - "kind"
generate_usage_pages: true
---

# Directory

This collection contains 91 references in `directory/`.

## Property Indexes

- [kind](./kind/index.md) - concept, framework, organization, product, skill, tool

## Records

- [adam](./adam.md) - A port of Vercel's eve that runs the durable agent runtime entirely on Convex, with event-sourced runs, scheduler-driven queues, live token streams, and human-in-the-loop and no server to host.
- [Agent Zero](./agent-zero.md) - Open source agent framework and computer assistant environment for building and experimenting with autonomous workflows.
- [Amp](./amp.md) - AI coding agent and development tool focused on iterative software workflows and agent-assisted programming.
- [Anthropic](./anthropic.md) - AI company behind Claude, Claude Code, and the skill-related tooling discussed throughout the episode.
- [Apache CouchDB](./couchdb.md) - Document database with sync; the sync backend for Neil's Obsidian instances (LiveSync via the Obsidian MCP).
- [Astro](./astro.md) - Web framework for content-driven sites; its team (Fred Schott) was acquired by Cloudflare.
- [bat-kol](./bat-kol.md) - Claude plugin for drafting messages in a user's own voice across channels like Slack, email, Bluesky, and GitHub.
- [Bun](./bun.md) - JavaScript runtime, bundler, and package manager. Nick's dad CLI is written in it.
- [Case](./case.md) - WorkOS harness repo for dispatching AI agents through a structured pipeline to fix bugs, ship features, and accumulate evidence.
- [Claude Code](./claude-code.md) - Anthropic's agentic coding tool used for code editing, shell work, search, and workflow automation.
- [Claude plugins](./claude-plugins.md) - Claude Code's plugin format, bundling skills, subagents, hooks, MCP servers, and commands into a package that can be installed into a project or user directory.
- [Cloudflare](./cloudflare.md) - Cloud/edge platform company; acquired Astro's team and is the runtime behind Flue and Code Mode.
- [Code Mode](./cloudflare-code-mode.md) - Cloudflare technique that exposes tools/MCP as a typed TypeScript SDK so an agent writes one script instead of many tool calls, cutting token usage dramatically.
- [conference-talk-builder](./conference-talk-builder.md) - Nick Nisi's public talk-writing skill for turning ideas into structured conference talks and slide outlines.
- [Context7](./context7.md) - Documentation retrieval tool for LLMs and AI coding environments, used to bring current reference material into context.
- [Convex](./convex.md) - Reactive backend-as-a-service and database platform for app developers. Neil follows their work closely; adam runs entirely on it.
- [Cursor](./cursor.md) - AI-powered code editor and agentic development environment used for coding, search, and workflow automation.
- [dad](./dad.md) - Nick Nisi's PR-review CLI written in Bun. Installs as a daemon, renders each pull request as a narrative story grouped by logical boundary rather than by file, and syncs comments bidirectionally with GitHub.
- [DeepWiki](./deepwiki.md) - AI-generated repository documentation and codebase exploration tool that produces wiki-style docs and supports question answering over repos.
- [deepwiki-to-skill](./deepwiki-to-skill.md) - Skill that converts DeepWiki repository documentation into a local skill with generated reference files and a progressive-disclosure `SKILL.md`.
- [Deno](./deno.md) - Secure JavaScript and TypeScript runtime created by Ryan Dahl as a successor to Node.
- [Devin](./devin.md) - Cognition's autonomous AI software engineer, used here mainly to address PR comments.
- [Docker](./docker.md) - Container platform; Neil's mobile OpenCode stack runs as a Docker Compose service set.
- [Dojo Toolkit](./dojo.md) - Long-running JavaScript toolkit and framework referenced as an earlier anchor in both hosts' careers.
- [DSPy](./dspy.md) - Framework for programming and evaluating language model systems using declarative composition and optimization workflows.
- [eve](./eve.md) - Vercel's open-source TypeScript agent framework. Each agent is a directory of files mapping to skills, tools, connections, and channels, compiled into a manifest and served on a durable runtime.
- [Excalidraw](./excalidraw.md) - Virtual hand-drawn-style whiteboard for diagrams, suggested here as a way to have an agent draw a codebase for you.
- [Fable](./fable.md) - Anthropic's Claude Fable model, released mid-2026 at the top of the Claude 5 generation. Built for long-running agentic work and carrying additional safety guardrails; pulled shortly after launch and reintroduced weeks later.
- [File Browser](./file-browser.md) - Self-hosted web file manager (single Go binary); Neil uses it as a full-screen file editor on mobile.
- [Flue](./flue.md) - Fred Schott's open-source TypeScript "sandbox agent" framework for building durable AI agents that run on Cloudflare.
- [fzf](./fzf.md) - Command-line fuzzy finder; what Nick's Sessions tool used before moving to a SQLite index.
- [Gemini](./gemini.md) - Google's family of large language models; cited here (as "Gemini 3.1 Pro") as Neil's preferred writing model.
- [GitHub](./github.md) - Code-hosting platform central to both the hosts' background and to the later discussion about sharing AI-generated work.
- [Gong](./gong.md) - Revenue and call-intelligence platform used to record calls and feed transcript-backed workflow automation.
- [Granola](./granola.md) - AI meeting-notes app that records and transcribes without joining calls as a bot. Its MCP server exposes past meeting transcripts to Claude and other agents.
- [Greptile](./greptile.md) - AI code review tool that indexes a repository and reviews pull requests against its context. Ships a CLI alongside its GitHub and GitLab integrations, which Nick loops an agent against until it returns a 5-out-of-5 review.
- [h5ai](./h5ai.md) - PHP web-server directory index/browser (unrelated to AI) that Neil uses to browse generated HTML, Markdown, and PDFs over Tailscale.
- [Hermes](./hermes-agent.md) - Nous Research's open-source self-hosted autonomous agent framework; Nick switched to it from OpenCode.
- [ideation](./ideation.md) - Skill that turns messy brain dumps into structured contracts, PRDs, and implementation specs for agent-assisted development.
- [JS Party](./js-party.md) - Changelog's community JavaScript podcast, which Nick Nisi co-hosted; swyx appeared as a guest several times.
- [Jujutsu](./jujutsu.md) - Git-compatible version-control system that wraps Git while offering a different working model; Nick is an "aspirational Jujutsu user."
- [Maestro](./maestro.md) - YAML-based end-to-end UI testing framework for mobile and web; Neil used it to drive his React Native app's tab flows.
- [Mastra Code](./mastra-code.md) - Agentic coding harness from Mastra for running customizable agents, tools, and model workflows in software projects.
- [MCP](./mcp.md) - The Model Context Protocol, Anthropic's open standard for connecting agents to external tools and data. Surfaced in Claude as "connectors"; its notifications feature is surfaced as "channels."
- [NebraskaJS](./nebraskajs.md) - Nebraska-based JavaScript community and meetup series covering web development and adjacent technical topics.
- [Neovim](./neovim.md) - Extensible modal text editor often used as a low-level, highly customizable development environment.
- [new-post skill](./new-post-skill.md) - Nick Canariato's post-writing skill for turning transcript-backed ideas into blog posts using a large library of narrative frameworks.
- [Notion](./notion.md) - Documentation and knowledge-work tool used here as an output target for Claude-generated summaries and notes.
- [Obsidian](./obsidian.md) - Local-first Markdown knowledge base; synced across Neil's devices via CouchDB and fed by an Obsidian MCP server.
- [octoflow](./octoflow.md) - Claude plugin for Nick C's preferred git workflow, including commit-message conventions and commit interception hooks.
- [OpenAI Codex](./codex.md) - OpenAI's lightweight coding agent that runs in the terminal (and IDEs/cloud), used here for the `/goal` Ralph-loop run.
- [OpenClaw](./openclaw.md) - Peter Steinberger's agent project, referenced across episodes as a benchmark for personal agent setups.
- [OpenCode](./opencode.md) - Open-source, provider-agnostic terminal AI coding agent (TUI/CLI) with a built-in web server and subagent support.
- [OpenCode Go](./opencode-go.md) - Low-cost subscription from the OpenCode team that provides OpenAI-compatible API access to a curated set of open-source coding models, usable by any agent.
- [OpenWiki](./openwiki.md) - LangChain's CLI that generates and maintains agent-facing documentation for a codebase. Runs once to initialize, then a scheduled action diffs commits and opens a pull request with documentation updates. A personal mode adds connectors for Git, Notion, Gmail, X, and Hacker News.
- [Oxfmt](./oxfmt.md) - High-performance JavaScript and TypeScript formatter from the Oxc toolchain, designed as a fast formatter for modern frontend codebases.
- [Oxlint](./oxlint.md) - Fast JavaScript and TypeScript linter from the Oxc toolchain for static analysis and code quality checks.
- [PHP](./php.md) - Server-side scripting language originally created in 1994, widely used for web development.
- [pi.dev](./pi-dev.md) - Low-level coding harness and agent platform for experimenting with custom model-driven development workflows.
- [Playwright](./playwright.md) - Browser automation framework used here to reproduce, verify, and record evidence for UI bug fixes.
- [Raindrop.io](./raindrop.md) - Bookmarking service with an MCP that Nick uses to auto-sort and tag saved links for his Hermes agent.
- [Ralph Loop](./ralph-loop.md) - Agent-in-a-loop technique (coined by Geoffrey Huntley) where an agent re-runs the same prompt each iteration using the filesystem as memory; surfaced as `/goal` in Codex and Claude.
- [rankduel](./rankduel.md) - Neil Roberts's pairwise ranking site. Uses an exhaustive pairwise sort tuned to avoid comparing the same item repeatedly in a row, with a custom scoring harness used to optimize the algorithm.
- [Raycast](./raycast.md) - macOS launcher/productivity tool; where Neil's summarization script previously ran (via iOS Shortcuts).
- [Readwise Reader](./readwise-reader.md) - Read-later / bookmarking app (with CLI and MCP tooling) that pulls article and YouTube-transcript content; the trigger source for Neil's summarization pipeline.
- [Remix](./remix.md) - Full-stack web framework; the "Remix 3 beta" was rebuilt away from React into its own thing.
- [Rough Notation](./rough-notation.md) - JavaScript library for animating hand-drawn-style annotations like highlights, underlines, boxes, and circles in web content.
- [sessions](./sessions.md) - Nick Nisi's search-and-memory index across AI coding sessions, covering Claude Code, Codex, and Pi in one index. Fuzzy-find and resume from the CLI, give agents recall via MCP, and generate usage reports including a Spotify Wrapped-style summary.
- [SitePen](./sitepen.md) - Software consulting and engineering firm closely associated with Dojo and long-running JavaScript work.
- [skill-forge](./skill-forge.md) - Claude plugin for creating and improving skills, with structured orchestration, validation, and evaluation workflows.
- [skill-tree-podcast](./skill-tree-podcast.md) - Podcast production skill for The Skill Tree, covering episode records, transcripts, references, and related publishing workflows.
- [skills](./skills.md) - Reusable Claude Code capabilities defined by `SKILL.md` instructions and supporting files that can be auto-invoked or run directly for specific workflows.
- [Slack](./slack.md) - Team communication platform discussed as a key connector source for bringing thread context into Claude.
- [Slidev](./slidev.md) - Markdown-based presentation tool used to turn transcripts or blog-post material into slide decks.
- [SQLite](./sqlite.md) - Embedded relational database engine; backs the index in Nick's Sessions tool.
- [Tailscale](./tailscale.md) - WireGuard-based mesh VPN with a hostname/SSL service; Neil maps each Docker service to its own Tailscale hostname on port 443.
- [TanStack](./tanstack.md) - Collection of headless, type-safe libraries for web development (Query, Router, Table, Start, and more), created by Tanner Linsley and community.
- [TanStack Start](./tanstack-start.md) - TanStack's full-stack React framework.
- [Tapestry](./tapestry.md) - Iconfactory's unified chronological timeline app for blogs, social feeds, RSS, podcasts, and YouTube channels. Feeds Neil's Docker-based summarization pipeline.
- [TARS](./tars.md) - WorkOS's internal autonomous coding agent, written up publicly as Project Horizon. Event-driven agents spawn from Linear webhooks, run in cloud sandboxes, and reach internal tools through a custom MCP server. Nick Nisi took the project over in mid-2026.
- [Taskmaster AI](./taskmaster-ai.md) - AI project-planning tool that turns product planning artifacts like PRDs into structured executable task workflows.
- [Tessl](./tessl.md) - Package manager and registry for agent skills, including distribution and evaluation-related workflows for reusable skill packages.
- [tmux](./tmux.md) - Terminal multiplexer; Nick built session-management tooling around it to track running agents.
- [Vercel](./vercel.md) - Frontend cloud platform and the company behind the eve agent framework; raised here in the context of platform lock-in.
- [Vim](./vim.md) - Long-running modal text editor and vi successor, referenced here distinctly from Neovim.
- [Visual Studio Code](./visual-studio-code.md) - Open source code editor from Microsoft that serves as a baseline comparison point for modern developer tooling.
- [Warp](./warp.md) - Terminal / agentic development environment; Neil cites its tab and scroll UX as a frustration.
- [Wayfinder](./wayfinder.md) - Matt Pocock's planning skill for work too large to spec in one sitting. Builds a central map of interdependent tickets, spanning grilling, prototype, and research, that grows as questions surface and shrinks as they resolve.
- [Wispr Flow](./wispr-flow.md) - Voice dictation tool used to turn spoken input into text for writing and idea capture workflows.
- [WorkOS](./workos.md) - Developer platform focused on authentication, enterprise features, and related infrastructure APIs.
- [zoom-out](./zoom-out.md) - Matt Pocock skill that steps the agent up one abstraction layer and maps the relevant modules and callers in a codebase's own vocabulary. Run it repeatedly to keep zooming out. Since removed from the skills repo; the link points at the last version before deletion.
