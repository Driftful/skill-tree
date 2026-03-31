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

This collection contains 2 references in `episodes/`.

## Records

- [000: They're All Markdown Files](./000-theyre-all-markdown-files.md) - In this trailer episode of The Skill Tree, Neil Roberts and Nick Nisi talk about why they started the show and the kinds of AI workflow conversations they want to have. The discussion centers on skills as reusable Markdown-backed instructions, transcript-first publishing, and the tools they keep returning to in day-to-day work.
- [001: Cleaning the Fridge: The Hero's Journey](./001-cleaning-the-fridge-the-heros-journey.md) - Episode 1 of The Skill Tree is a conversation with Nick Cannariato about how people actually use Claude skills once they move past the toy stage. Neil Roberts and Nick Nisi talk with him about narrative frameworks for talks and blog posts, connector-heavy research workflows, skill generation, memory systems, and the strange mix of control, curiosity, and frustration that makes AI-assisted work productive.
