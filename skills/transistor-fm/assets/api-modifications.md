# API Modifications

This file records the normalization decisions that shape `assets/resources.yaml`.
It is intentionally limited to conventions that are not directly recoverable from `references/api.md`.

## Resource Families

- Use one top-level resource key per CLI family.
- When singular and plural API surfaces describe the same family, prefer the plural resource name.
- The canonical resource keys are `user`, `shows`, `episodes`, `subscribers`, and `webhooks`.

## Action Normalization

- Show-level analytics is exposed as `shows analytics`.
- Episode analytics is exposed as `episodes analytics`, whether the underlying endpoint is scoped to a show or to a single episode.
- Audio upload is exposed as `episodes upload`.
- Episode summary is intentionally omitted from the normalized `episodes create` and `episodes update` writable fields, even though the upstream API documents it, so the CLI does not encourage XML-feed summary writes.
- The publish-state endpoint is expressed as three actions: `episodes publish`, `episodes schedule`, and `episodes unpublish`.
- Subscriber creation is exposed as a single `subscribers create` action, even when the underlying API call creates multiple subscribers in one request.
- Subscriber deletion is exposed as a single `subscribers delete` action, whether the underlying API call targets an email address or a subscriber ID.

## Upload Flow

- Upload is modeled as one action even though the API flow is two-step.
- Authorization uses `GET /v1/episodes/authorize_upload`.
- The authorization response returns `upload_url`, `content_type`, and `audio_url`.
- The returned `audio_url` is the reusable value for subsequent episode create and episode update calls.
