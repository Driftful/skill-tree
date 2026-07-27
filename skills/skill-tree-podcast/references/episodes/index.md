---
display_title: "${number|pad:3}: $title"
relationships:
  -
    property: "hosts"
    target_collection: "speakers"
    type: "speaker-appearance"
    relation_label: "host"
  -
    property: "guests"
    target_collection: "speakers"
    type: "speaker-appearance"
    relation_label: "guest"
---

# Episodes

This collection contains 4 references in `episodes/`.

## Records

- [000: They're All Markdown Files](./000-theyre-all-markdown-files.md) - In this trailer episode of The Skill Tree, Neil Roberts and Nick Nisi talk about why they started the show and the kinds of AI workflow conversations they want to have. The discussion centers on skills as reusable Markdown-backed instructions, transcript-first publishing, and the tools they keep returning to in day-to-day work.
- [001: Cleaning the Fridge: The Hero's Journey](./001-cleaning-the-fridge-the-heros-journey.md) - Episode 1 of The Skill Tree is a conversation with Nick Cannariato about how people actually use Claude skills once they move past the toy stage. Neil Roberts and Nick Nisi talk with him about narrative frameworks for talks and blog posts, connector-heavy research workflows, skill generation, memory systems, and the strange mix of control, curiosity, and frustration that makes AI-assisted work productive.
- [002: I Haven't Given It a Soul](./002-i-havent-given-it-a-soul.md) - Episode 2 of The Skill Tree is a hosts-only catch-up where Neil Roberts and Nick Nisi trade notes on a fast-moving few weeks in AI coding tools. They dig into the Ralph Loop arriving as a `/goal` command, the personal utilities they are each building around their agents, the industry's drift from Markdown to HTML for agent output, and a genuinely unnerving npm supply-chain worm.
- [003: Fill Your Context Window](./003-fill-your-context-window.md) - Episode 3 of The Skill Tree is a hosts-only conversation about the tooling forming around AI coding agents — code review rewritten as narrative, MCP notifications, portable agent bundles, and what has to be in place at a company before any of it pays off. Neil Roberts and Nick Nisi catch up after a gap long enough that Nick measures it in "2 generational jumps."
