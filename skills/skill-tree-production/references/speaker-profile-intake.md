# Speaker Profile Intake

This document covers how to create or enrich a `data/speakers/` profile for a host or guest when the available information is incomplete.

## Goal

Create a useful speaker record as early as possible, while grounding it in real research instead of guesswork.

Speaker profile creation should be highly interactive. The agent should check assumptions with the user throughout the process, especially during identification and disambiguation.

## When To Use This

Use this workflow whenever:

- A host or guest does not yet have a `data/speakers/` profile.
- An existing profile is too sparse for episode production needs.
- The user provides only a name, handle, or partial identity.

## Intake Workflow

1. Start with the user-provided identifier for the person.
2. Check whether a matching `data/speakers/` profile already exists.
3. If there is no confident match, begin research to identify the person.
4. If multiple plausible matches exist, ask the user to disambiguate before continuing.
5. Once identity is confirmed, summarize the likely match for the user and confirm before writing a new profile.
6. Continue research to populate the profile, including a proactive attempt to identify the speaker's public GitHub profile.
7. Create or update the `data/speakers/` profile with verified information and clearly mark anything still unknown as `TBD`.

## Disambiguation Rule

Do not guess when identity is ambiguous.

Ask the user for clarification when:

- Multiple people share the same name.
- The available links or handles point to more than one plausible person.
- The show context suggests several possible matches.
- The research confidence is low.

Useful disambiguation questions include:

- Which company, project, or community is this person associated with?
- Do you have a website, GitHub, LinkedIn, X handle, or other public link for them?
- Is this the same person who worked on a specific tool, repo, or company?

After the user clarifies, continue the research pass instead of stopping at the question.

## Research Guidance

Prefer high-signal public sources that help confirm identity and expertise, such as:

- Personal websites.
- Company or project profile pages.
- GitHub profiles and repositories.
- Conference or event speaker bios.
- Public social profiles when they clearly match the person.
- Prior podcast or article bios.

Use research to confirm, when available:

- Preferred display name.
- Organization, company, or project affiliation.
- Relevant expertise areas.
- A matching public GitHub profile.
- Public links worth including.
- A concise bio grounded in public facts.

Make a deliberate GitHub lookup for every speaker. If there is a clear public GitHub match, include it. If there is no confident match, omit it rather than guessing.

## Profile Population Guidance

Populate as much of the profile as can be verified. Most speaker metadata should live in front matter so the profile remains easy to query and update over time.

Typical fields include:

- Display name.
- Short bio.
- Organization or project affiliation.
- Links or handles.
- Expertise tags or topics.

Always try to identify the speaker's public GitHub profile during research.
When a speaker has a clearly identifiable public GitHub profile, include it in `links`.
If no confident GitHub match can be verified, leave it out rather than adding a speculative link.

If a field cannot be verified, leave it as `TBD` rather than inventing content.
Derive the slug from the filename rather than storing it in front matter.

## Writing Rule

Summaries and bios should be concise and factual. Prefer verifiable statements over polished marketing language. If the available information is thin, keep the bio short and leave follow-up questions in the profile for later completion.
