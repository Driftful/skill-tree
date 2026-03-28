# New Episode Intake

This document covers the first-pass workflow for starting a new podcast episode before the title, transcript, and metadata are finalized.

## When To Use This

Use this workflow when the user says they want to start a new episode and may not yet have:

- A final title.
- A transcript.
- An MP3 ready for upload.
- Complete guest details.
- Complete directory or topic metadata.

The workflow should still begin immediately.

Episode creation should be highly interactive. The agent should confirm key details with the user as it goes instead of silently filling in assumptions.

## Default Intake Flow

1. Inspect existing `data/episodes/` files and determine the next episode number from the highest `###` prefix, unless the user has already specified an explicit episode number to use.
2. Ask the user to confirm a temporary filename stem for the new episode.
3. Create an episode placeholder in `data/episodes/` using the `###-slug.md` filename pattern.
4. Ask who the hosts were for this recording.
5. Ask whether there were any guests.
6. For each person on the episode, link an existing `data/speakers/` profile or create a new one.
7. Leave unknown fields as `TBD` instead of blocking progress.
8. Do not create or publish the remote hosting entry during intake unless the user explicitly asks for that later.

## Episode Placeholder Guidance

If there is no title yet, use a working title such as `TBD` and ask the user to confirm a temporary filename stem that can be renamed later. Combine that stem with the computed episode number to form the filename. Do not store the slug in front matter.

Example placeholder filenames:

- `000-pilot.md`
- `007-tbd.md`
- `018-working-title.md`

Most episode metadata should be stored in front matter so the file can act as structured state for later passes.

The placeholder should capture at least:

- Episode number.
- Episode title: `TBD` if unknown.
- Status: a draft or planning state that makes it clear the entry is incomplete.
- Hosts: confirmed host list.
- Guests: confirmed guest list.
- Transcript: a `transcript` field pointing to the relative transcript filename, or `TBD` if it does not exist yet.
- Topics: an empty `topics: []` array during initial creation.

If the user already knows a non-default publishing override, the placeholder may also include a nested `publishing:` block. Otherwise omit it until remote sync work actually begins.

During episode creation, do not attempt to locate transcripts, metadata source files, directory entries, tags, topics, or remote hosting IDs. The creation pass should focus only on establishing the episode record and speaker links.
Leave `transcript: TBD` until the transcript file exists, and keep `topics: []` empty during the initial creation pass. Directory references are derived later by index-time lookup rather than stored in episode front matter.
Do not block intake on having an MP3 or embedded audio metadata ready yet. Those happen later, after the local episode metadata is mature enough to drive pre-upload tagging.

Episode placeholders can be front-matter-only. Do not add markdown body filler when there is no substantive narrative content yet.

When show notes exist later, store them in the Markdown body of the episode file rather than a `description` front matter field. The first paragraph of the episode body should act as the summary instead of a dedicated `summary` front matter field.

## Speaker Profile Workflow

For each host or guest:

1. Check whether a matching `data/speakers/` profile already exists.
2. If it exists, reuse it and update it only if new information is available.
3. If it does not exist, run the speaker intake workflow in [Speaker Profile Intake](speaker-profile-intake.md).
4. Create the profile early so the episode can reference a stable speaker record even if some fields remain `TBD`.

New speaker profiles should capture, when known:

- Display name.
- Short bio, or `TBD`.
- Organization or project affiliation, if relevant.
- Links or handles, if known.
- Expertise tags or topics, if known.

As with episodes, keep these structured fields in front matter whenever possible so the episode file can reference speaker records consistently.

## Operating Principle

Do not wait for the transcript, polished title, or opening summary paragraph before creating the episode record. The first pass should establish the episode placeholder and the people records, then future passes can fill in transcript-derived metadata.
Directory entries may be added later during transcript enrichment. Topics are curated only in the separate topic-curation workflow.
Remote episode creation should happen later, only when the local metadata is mature and the user explicitly asks to create or publish the hosted episode.
Once the episode metadata is mature and a local MP3 exists, tag the local file before upload rather than treating embedded audio metadata as a post-upload concern.
Regenerating committed reference indexes is also a later production step after transcript enrichment and metadata finalization, not part of the initial intake pass.
