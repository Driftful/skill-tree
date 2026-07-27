# Directory: tool

This page lists 26 entries with `kind: tool`.

- [Back to kind index](./index.md)
- [Back to directory](../index.md)

## Entries

- [Bun](../bun.md) - JavaScript runtime, bundler, and package manager. Nick's dad CLI is written in it.
- [Case](../case.md) - WorkOS harness repo for dispatching AI agents through a structured pipeline to fix bugs, ship features, and accumulate evidence.
- [Context7](../context7.md) - Documentation retrieval tool for LLMs and AI coding environments, used to bring current reference material into context.
- [dad](../dad.md) - Nick Nisi's PR-review CLI written in Bun. Installs as a daemon, renders each pull request as a narrative story grouped by logical boundary rather than by file, and syncs comments bidirectionally with GitHub.
- [DeepWiki](../deepwiki.md) - AI-generated repository documentation and codebase exploration tool that produces wiki-style docs and supports question answering over repos.
- [Deno](../deno.md) - Secure JavaScript and TypeScript runtime created by Ryan Dahl as a successor to Node.
- [Excalidraw](../excalidraw.md) - Virtual hand-drawn-style whiteboard for diagrams, suggested here as a way to have an agent draw a codebase for you.
- [File Browser](../file-browser.md) - Self-hosted web file manager (single Go binary); Neil uses it as a full-screen file editor on mobile.
- [fzf](../fzf.md) - Command-line fuzzy finder; what Nick's Sessions tool used before moving to a SQLite index.
- [Granola](../granola.md) - AI meeting-notes app that records and transcribes without joining calls as a bot. Its MCP server exposes past meeting transcripts to Claude and other agents.
- [Greptile](../greptile.md) - AI code review tool that indexes a repository and reviews pull requests against its context. Ships a CLI alongside its GitHub and GitLab integrations, which Nick loops an agent against until it returns a 5-out-of-5 review.
- [h5ai](../h5ai.md) - PHP web-server directory index/browser (unrelated to AI) that Neil uses to browse generated HTML, Markdown, and PDFs over Tailscale.
- [Neovim](../neovim.md) - Extensible modal text editor often used as a low-level, highly customizable development environment.
- [OpenWiki](../openwiki.md) - LangChain's CLI that generates and maintains agent-facing documentation for a codebase. Runs once to initialize, then a scheduled action diffs commits and opens a pull request with documentation updates. A personal mode adds connectors for Git, Notion, Gmail, X, and Hacker News.
- [Oxfmt](../oxfmt.md) - High-performance JavaScript and TypeScript formatter from the Oxc toolchain, designed as a fast formatter for modern frontend codebases.
- [Oxlint](../oxlint.md) - Fast JavaScript and TypeScript linter from the Oxc toolchain for static analysis and code quality checks.
- [PHP](../php.md) - Server-side scripting language originally created in 1994, widely used for web development.
- [Playwright](../playwright.md) - Browser automation framework used here to reproduce, verify, and record evidence for UI bug fixes.
- [Rough Notation](../rough-notation.md) - JavaScript library for animating hand-drawn-style annotations like highlights, underlines, boxes, and circles in web content.
- [sessions](../sessions.md) - Nick Nisi's search-and-memory index across AI coding sessions, covering Claude Code, Codex, and Pi in one index. Fuzzy-find and resume from the CLI, give agents recall via MCP, and generate usage reports including a Spotify Wrapped-style summary.
- [Slidev](../slidev.md) - Markdown-based presentation tool used to turn transcripts or blog-post material into slide decks.
- [TARS](../tars.md) - WorkOS's internal autonomous coding agent, written up publicly as Project Horizon. Event-driven agents spawn from Linear webhooks, run in cloud sandboxes, and reach internal tools through a custom MCP server. Nick Nisi took the project over in mid-2026.
- [Taskmaster AI](../taskmaster-ai.md) - AI project-planning tool that turns product planning artifacts like PRDs into structured executable task workflows.
- [tmux](../tmux.md) - Terminal multiplexer; Nick built session-management tooling around it to track running agents.
- [Vim](../vim.md) - Long-running modal text editor and vi successor, referenced here distinctly from Neovim.
- [Visual Studio Code](../visual-studio-code.md) - Open source code editor from Microsoft that serves as a baseline comparison point for modern developer tooling.
