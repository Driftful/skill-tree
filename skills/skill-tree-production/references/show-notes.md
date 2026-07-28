# Show Notes Template

Use this as the reference template for the Markdown body of `references/episodes/*.md`.

The body should be the canonical publisher-facing episode description:

- readable for listeners
- rich enough for SEO
- grounded in the cleaned transcript
- separate from structured front matter

## Editorial Goal

Help a listener decide whether to play the episode.

The default should read like clear production notes, not like a launch post, essay, or marketing page. Keep the body tight, specific, and transcript-backed. Let the transcript carry most of the long-tail SEO depth.

## Skill Preference

If a podcast SEO skill is installed, you may load it for keyword awareness — but this document governs structure and voice.

Generic podcast SEO skills tend to mandate an `#` H1, meta descriptions, schema markup, "Key Takeaways" blocks, and 4,000+ word pages. All of those contradict the rules below, which require `##`-only headings and roughly 300 to 900 words, on the premise that the transcript carries the long-tail SEO depth. Take the keyword and internal-linking guidance; ignore structural advice that conflicts with this document.

## What To Use As Input

- `references/show.md` for show framing, tone, and brand language
- episode front matter for title, optional local summary, hosts, guests, and publishing state
- `references/transcripts/*.md` for themes, quotes, questions, and exact references
- `references/speakers/*.md` for host and guest bios
- `references/directory/*.md` plus approved inline links for tools, projects, articles, and products mentioned

The episode body, not episode front matter `summary`, is the canonical publisher-facing description source.

## What Stays Out Of The Body

Do not treat the body as a dump of all available metadata.

Keep these in front matter instead:

- episode number
- status
- hosts and guests as source-of-truth references
- transcript path
- directory list
- provider IDs and remote URLs

Also:

- do not paste the full transcript into the episode body by default
- do not assign or invent `topics:` here
- do not invent timestamps if they are not available

If timestamps exist:

- keep them in a dedicated `## Episode Chapters` or `## Timestamps` section
- use descriptive labels, because those labels may also be embedded into the MP3 as chapter titles before upload

## Voice And Tone

Prefer:

- plainspoken, concrete language
- short paragraphs and direct statements
- named tools, projects, frameworks, and questions from the transcript
- light interpretation anchored to what was actually said
- section headings that describe the discussion plainly

Avoid:

- rhetorical-question headings unless the episode is explicitly organized around a question
- grand framing about "the moment," "the movement," or "what emerges"
- self-congratulatory launch language or abstract significance claims
- filler transitions that restate what the listener will hear anyway
- boilerplate closers about the show's mission unless they add new information

## Recommended Structure

Aim for roughly 300 to 900 words before any separately rendered transcript block. Go longer only when the episode genuinely needs it.

Preferred section order:

1. Short summary
2. In this episode
3. Optional episode chapters or timestamps
4. Discussion highlights
5. Tools, projects, and references mentioned
6. Optional about the guest or host
7. Optional related episodes

## Writing Rules

- Open with 1 to 2 short paragraphs that name the topic, the people in the conversation, and the practical focus of the episode.
- Use only `##` headings in the episode body. Do not use `#`, and do not use `###` or deeper headings.
- If a section needs sub-structure, use short lead-in sentences, bold labels, or paragraph transitions instead of nested headings.
- Use wording from the transcript when it is memorable, precise, or unusually clear.
- Prefer declarative headings over rhetorical ones.
- Summarize concrete ideas, disagreements, and workflows, not just episode chronology.
- Pull in named tools and projects from the transcript, using their canonical names.
- Keep interpretation modest. Explain what was discussed before claiming why it matters.
- Include a bio section only when a guest or first-time participant needs introduction on the page. Recurring hosts usually do not need full bios in every episode.
- If there are timestamps, make each label descriptive instead of generic.
- If you use `## Episode Chapters`, treat that section as both a listener-facing page element and the canonical source for embedded MP3 chapter labels.
- End cleanly. Do not add a closing paragraph whose only job is to sound important.

## Show Notes Template

```md
<!-- Intro: 1-2 short paragraphs. Lead with the topic, who is in the conversation, and the practical focus. -->

[Episode title] is a conversation about [primary topic], [secondary topic], and [practical focus].

[Host name] and [host/guest name] talk through [core problem], including [specific angle], [specific angle], and [specific angle]. Use transcript language when there is a particularly sharp phrase, claim, or framing worth preserving.

[Optional second paragraph with one or two concrete reasons a listener would care.]

## In This Episode

- [Specific takeaway or question answered]
- [Specific takeaway or question answered]
- [Specific takeaway or question answered]
- [Specific takeaway or question answered]

## Episode Chapters

- `00:00` [Specific, useful chapter label]
- `00:00` [Specific, useful chapter label]
- `00:00` [Specific, useful chapter label]

## Discussion Highlights

## [Plain-language topic or theme]

[1 short paragraph summarizing the discussion. Prefer concrete nouns, named tools, and distinctive phrasing from the transcript.]

> [Optional short quote from transcript.]

## [Plain-language topic or theme]

[1 short paragraph summarizing another major thread.]

## [Plain-language topic or theme]

[1 short paragraph summarizing a third major thread.]

## Tools, Projects, and References Mentioned

- [Tool, project, article, or resource] - [why it came up in the conversation]
- [Tool, project, article, or resource] - [why it came up]
- [Tool, project, article, or resource] - [why it came up]

## About The Guest

[Guest name]

[1-3 sentence bio pulled from `references/speakers/*.md` and lightly adapted for the page.]

## Related Listening

- [Related episode or topic]
- [Related episode or topic]
```

## Best-Fit Adaptation For This Repo

Given the current `skill-tree-podcast` structure, the best default is:

- keep the episode body focused on a short summary, concrete highlights, references, and only the bios that are actually useful
- keep the full transcript in `references/transcripts/*.md`
- use the transcript to enrich the show notes, not to replace them
- when chapter timestamps exist, keep them in the episode body as the canonical source for embedded MP3 chapters
- let directory entries and approved inline links carry the detailed reference layer

This gives you:

- a listener-friendly episode description for publishing
- enough text depth for SEO
- a clean separation between source metadata, narrative notes, and transcript text
