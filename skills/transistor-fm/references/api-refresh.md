# API Refresh

Assume the current working directory is the `transistor-fm` skill root.

This workflow refreshes `assets/api.md` and then reconciles `assets/resources.yaml` against the latest reference.

## Refresh The Source Reference

- Fetch `https://r.jina.ai/https://developers.transistor.fm`.
- Replace `assets/api.md` with the fetched markdown exactly.
- Do not paraphrase, reorganize, or selectively trim the reference.

## Read The Normalization Notes

- Open `assets/api-modifications.md` before editing `assets/resources.yaml`.
- Treat that file as the source of truth for any intentional departures from the raw API reference.

## Establish Resource Families

- Derive top-level resource families primarily from the `Resources` section of `assets/api.md`.
- Start from the resource names listed in the resources table of contents, then apply the naming conventions in `assets/api-modifications.md`.
- Use endpoint group headings as a secondary source to validate family names and action placement.
- Use the normalized resource family names as the top-level keys in `assets/resources.yaml`.

## Refresh Actions

- Review every endpoint in `assets/api.md`.
- Ensure each supported capability is represented as an action under the appropriate top-level resource family.
- Use hyphen-lower-case for action names.
- Apply the normalization rules in `assets/api-modifications.md` before deciding whether an endpoint becomes:
  - a new action
  - a variant within an existing action
  - one step in a multi-endpoint action

## Refresh Endpoint Maps

- For each action, list the underlying API calls as an ordered map keyed by `${VERB}:${path}`.
- Preserve call order when one action spans multiple API calls.
- When multiple variants share the same endpoint, distinguish them by adding the differentiating query argument to the endpoint key.
- For each endpoint entry, record:
  - `description`
  - `parameters`
  - `return_type` when the response is documented as a resource or resource array

## Refresh Endpoint Parameters

- Derive parameters from the endpoint `Parameters` table in `assets/api.md`.
- Preserve parameter names exactly as documented.
- Serialize each parameter as a single string:
  - `Type: Description` when the parameter is required
  - `Type?: Description` when the parameter is optional
- If the description cell is blank, use:
  - `Type` for required parameters
  - `Type?` for optional parameters
- For multi-step flows with additional request details outside the parameter table, use the prose if it explicitly describes submitted inputs.

## Refresh Endpoint Return Types

- Derive `return_type` from the endpoint `Response` section in `assets/api.md`.
- Use model names from the documented resources:
  - singular resource responses as `User`, `Show`, `Episode`, `Subscriber`, `ShowAnalytics`, `EpisodesAnalytics`, `EpisodeAnalytics`, `AudioUpload`, `Webhook`
  - array responses as `Show[]`, `Episode[]`, `Subscriber[]`, `Webhook[]`
- If an endpoint does not document a resource or resource-array response, do not add `return_type` in `assets/resources.yaml`.

## Refresh `_models`

- Key `_models` by resource name exactly as it appears in the `Resources` section of `assets/api.md`.
- Within each model, key entries by field name exactly as documented.
- Serialize each documented field as a single string:
  - `Type: Description` when the description cell is populated
  - `Type` when the description cell is blank
- Include documented relationships in the same model object.
- Represent relationship values as plain types:
  - singular relationships as `Show`, `Episode`, `User`
  - array relationships as `Episode[]`, `Subscriber[]`

## Extraction Rules

- Derive structure only from `assets/api.md` plus the explicit conventions in `assets/api-modifications.md`.
- Do not infer undocumented resources, fields, relationships, actions, parameters, or return types.
- Preserve documentation casing in `_models`.
- Preserve the existing structure of `assets/resources.yaml` and update only what the refreshed reference or normalization notes require.

## Completion Check

- Confirm `assets/api.md` matches the fetched source.
- Confirm every endpoint has a corresponding action placement.
- Confirm every action has the correct endpoint map.
- Confirm every endpoint entry has the expected description and parameter set.
- Confirm every documented resource response has the correct `return_type`.
- Confirm every documented resource model appears under `_models`.
- Confirm `assets/resources.yaml` remains valid YAML.
