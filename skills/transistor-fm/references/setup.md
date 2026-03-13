# Setup

Assume the current working directory is the `transistor-fm` skill root.

## Credentials

1. Copy `.env.example` to `.env`.
2. Set `TRANSISTOR_API_KEY` for live API requests.
3. Leave `TRANSISTOR_API_BASE_URL` at the default unless you explicitly need a different Transistor API host.

## Execution Environment

- For local MP3 work, assume the task needs both live Transistor access and local filesystem access to the audio file.
- If the MP3 lives outside the workspace, request the permissions needed to read that path before starting the preflight.
- `uvx`-managed tools such as `eyeD3` and `mp3chaps2` may also need permission to write under the user's home directory for caches or lock files.
- Verify the live API path with a read-only command before any mutation.

## Sanity Check

```bash
node scripts/transistor-fm.mjs help
node scripts/transistor-fm.mjs episodes help
```

Help output is always available from the built-in command bundle, even before API credentials are configured.

## Live API Checks

Use a read-only command to verify credentials before mutating anything:

```bash
node scripts/transistor-fm.mjs user get
node scripts/transistor-fm.mjs shows list
```
