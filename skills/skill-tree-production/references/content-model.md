# Content Model

This skill serves two audiences:
- Listeners (and their agents) discovering relevant episodes, guests, directory entries, and topics.
- Podcast hosts/authors maintaining source content and publishing updates.

## Core Principle

Use progressive disclosure. Keep root `SKILL.md` minimal and navigation-first, and place detailed guidance in child documents.

## Source of Truth Files

These are hand-authored and treated as build inputs:
- `data/show.md`: show-wide metadata and publishing configuration.
- `data/speakers/*.md`: host/guest bios and expertise tags.
- `data/episodes/*.md`: metadata, summaries, tags, and speaker references.
- `data/transcripts/*.md`: full episode transcripts.
- `data/directory/*.md`: reusable named entries for tools, projects, orgs, protocols, coined terms, and other recurring references.
- `data/topics/*.md`: topic definitions (display name and description).

Speaker files are source-of-truth records, not leaf pages.

## Episode File Naming

Episode source files should use a zero-padded numeric prefix followed by the slug:

- `001-some-episode.md`
- `042-agent-memory.md`

Determine the next episode number by inspecting existing files in `data/episodes/` and incrementing the highest `###` prefix. If no episode files exist yet, start at `001`, unless the user explicitly designates a bootstrap or pilot `000` episode.

The episode number should also be represented in front matter so the structured metadata and filename stay aligned.
The slug should be derived from the filename and should not be duplicated in front matter.

## Front Matter First

For both `data/episodes/*.md` and `data/speakers/*.md`, most structured information should live in front matter.

Prefer front matter for fields such as:

- Display name or title.
- Status.
- Hosts, guests, and speaker references.
- Summary or bio.
- Organization, links, and handles.
- Directory references, topics, and expertise areas.
- Transcript references and related source references.
- Publishing-specific IDs, URLs, and override values.

Use the filename as the canonical slug source for all content files. Do not store a separate `slug` field in front matter.

Keep the body optional. Use it for substantive narrative notes, show notes, longer summaries, research notes, or supporting context that does not fit cleanly into structured fields.

For podcast publishing:

- episode Markdown bodies should hold the long-form show notes and the text that will be passed to a hosting provider as the episode description
- episode front matter `summary` is limited to local metadata and MP3 tagging, not a field to send to the hosting provider during remote episode sync
- when present, a `## Episode Chapters` section in the episode body should be treated as the canonical source for embedded MP3 chapter labels
- `data/show.md` should use its Markdown body for the show-level description rather than duplicating that text in front matter
- do not duplicate long-form descriptions into front matter when the Markdown body is the canonical source

For episode placeholders, prefer explicit structured fields such as `summary: TBD`, `transcript: TBD`, `directory: []`, and `topics: []` over extra boolean flags when the missing state is already obvious from the field value itself.

Avoid aggregate completion flags such as `is_publish_ready`. Prefer direct field values that show what is missing.

## Show Metadata

Store show-wide metadata in `data/show.md`.

Use front matter there for structured show fields such as:

- Title.
- Website.
- Host references.
- Categories.
- Publishing provider details such as show IDs, feed URLs, or provider slugs.

Use the Markdown body for the long-form show description.

## Episode Publishing Metadata

Keep episode editorial metadata separate from publishing-system metadata.

Also keep embedded audio metadata separate from hand-authored source metadata.
The MP3 tags are a derived artifact generated from `data/show.md`, episode front matter, the episode Markdown body, and the `## Episode Chapters` section when present.

Episode files may include a nested `publishing:` block for remote-sync state and provider-specific fields that are needed to create, update, or publish the remote episode.

Recommended `publishing:` fields:

- `provider`: current publishing target, such as `transistor`
- `episode_id`: remote episode ID after the first successful create
- `status`: remote publish status when known
- `published_at`: scheduled or published timestamp when known
- `audio_url`: uploaded or final hosted audio URL
- `keywords`: optional publish-target keywords list
- `share_url`: remote share URL when available
- `image_url`: optional episode-specific artwork override
- `email_notifications`: optional per-episode override

Do not add or duplicate these local source fields unless they need explicit override:

- `author`
- `type`
- `explicit`
- `season`
- `video_url`
- `alternate_url`

Operational defaults may be supplied during publishing without being stored in every episode file. Store them locally only when an episode needs a non-default value or a durable override.

Pre-upload audio-tagging defaults may also be supplied operationally rather than stored in every episode file.
For example, show title, album artist, genre, podcast frames, and chapter import behavior should normally be derived at tagging time.

Do not store these as source-of-truth episode metadata:

- `slug`
- `transcript_text`
- duplicated embedded-audio tag fields that can already be derived from show metadata, episode metadata, or the episode body
- read-only provider fields such as `duration`, `media_url`, `embed_html`, or `updated_at`

## Directory vs Topics vs Inline References

Keep these three concepts separate:

- `directory`: reusable named entries that may recur across episodes. This is the cross-episode directory for things like `DeepWiki`, `Claude Code`, `MCP`, `Mastra Code`, or show-specific coined terms.
- inline transcript links: one-off references that are only useful in local context, such as a specific blog post, article, or niche project mention. These stay embedded directly in transcript prose as Markdown links.
- `topics`: a small, controlled vocabulary of high-level themes used for corpus-wide grouping and navigation.

Do not use `topics` for products, companies, repos, articles, or protocol names when a `directory` entry is the more precise fit.
Do not create standalone files for one-off references unless they later prove to be recurring enough to merit promotion into `data/directory/`.

## Generated Outputs

Generated during the build/publish process:
- `directory/index.md`: list of all reusable directory entries.
- `topics/*.index.md`: topic aggregations (episodes + speakers by topic).
- `topics/index.md`: list of all topics.
- `episodes/index.md`: chronological episode list.
- `speakers/index.md`: speakers with appearance counts.
- directory and topic links surfaced from the root `SKILL.md`.

These files are generated by scripts from the source content in `data/`. They are not hand-authored by the agent during normal maintenance work.

## Topic Curation

Topics are curated separately from new-episode intake and transcript enrichment.

Do not assign or propose topics during transcript cleanup, transcript enrichment, or initial episode creation.
Topic creation, merging, splitting, and renaming should happen only during a dedicated corpus-level review across the full episode set.

## Topic Definition vs Aggregation

Keep topic definitions and topic aggregations separate.

Example flow:
`SKILL.md` -> `topics/skill-authoring.index.md` -> `topics/skill-authoring.md` + related episodes.

## Topic Definition

A topic is:

- high-level enough to organize multiple episodes
- precise enough to be clearly distinct from neighboring topics
- stable enough to support long-lived navigation and aggregation

A topic is not:

- a product or company
- a person
- a single article or blog post
- a single repo, protocol, or tool name

## Open Decision

Topic naming for source vs generated files remains open. Candidate patterns:
- `{slug}.md` and `{slug}.index.md`
- `{slug}/definition.md` and `{slug}/index.md`
- `{slug}.md` and `_{slug}.md`
