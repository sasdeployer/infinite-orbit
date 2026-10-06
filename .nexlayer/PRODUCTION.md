# Nexlayer — how `infinite-orbit` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `infinite-orbit` |
| Repo | `https://github.com/sasdeployer/infinite-orbit` on `main` |
| Planned | 2026-10-06T22:45:18.080Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

Infinite Orbit is a single Next.js 16 app (standalone server on port 3000) that serves the game and its API routes and calls NASA JPL Horizons and DSN over the internet. The repo's existing nexlayer.yaml also wires the app to an Ollama GPU service at ollama-gpu.pod:11434. The most important fix for production is the app's image reference: it is a local tag (infinite-orbit:latest) that the platform cannot pull, so it must point to the pushed registry image.

- **services: Keep the repo's two services: the Next.js app (renamed 'app') and the ollama-gpu service on GPU at port 11434** — The existing nexlayer.yaml sets OLLAMA_BASE_URL to ollama-gpu.pod:11434, and lib/ollama.ts exists, so the app expects that service. (`nexlayer.yaml`, `lib/ollama.ts`)
- **build: Build the app from the existing multi-stage Dockerfile and push it as registry.nexlayer.io/YOUR_USER_ID/infinite-orbit-app:planned, replacing the local image tag** — The Dockerfile already builds standalone output and runs node server.js. The yaml's image infinite-orbit:latest cannot be pulled at deploy. (`Dockerfile`, `next.config.ts`, `nexlayer.yaml`)
- **networking: The app is public at path / on port 3000 with HOSTNAME=0.0.0.0 and PORT=3000 set. Ollama is reached only internally via ollama-gpu.pod:11434** — The standalone Next.js server must bind all interfaces to receive routed traffic. (`Dockerfile`, `nexlayer.yaml`)
- **storage: Give the ollama-gpu service a 10Gi volume at /root/.ollama and pin its image to ollama/ollama:0.5.7 instead of latest** — Without a volume, the pulled qwen2:0.5b model is lost on every restart. (`nexlayer.yaml`)
- **keys: No secret keys are needed. NEXT_PUBLIC_SITE_URL is set to <% URL %>** — No key-bearing env vars were found. NEXT_PUBLIC_SITE_URL is read by the code. (`app/layout.tsx`, `app/og/route.tsx`)

### Fix before production

- **Blocker** — Replace the local image tag with the registry image: infinite-orbit:latest is not pullable, so the deploy fails. (`nexlayer.yaml`)
- Pass NEXT_PUBLIC_SITE_URL at build time: NEXT_PUBLIC_* values are baked in during next build. Without it, OG and share URLs may be wrong. (`Dockerfile`)
- Pull the Ollama model on startup: Without this, a fresh Ollama service has no qwen2:0.5b model and combine requests to it fail until the model is pulled. (`nexlayer.yaml`)
- Use mirror.gcr.io/library/node:20-alpine in FROM lines: Docker Hub rate limits can fail the build. (`Dockerfile`)

### Verify after the deploy

1. GET / on the app URL returns 200
2. GET /api/tracking returns 200 with JSON
3. GET /og returns an image/png
4. POST /api/combine with two element names returns a result

### Ask the human

- Is the Ollama GPU service worth its cost, or should combinations come only from the built-in table in lib/combinations.ts?

## The deploy config

This repo already has a `nexlayer.yaml`, and it is the source of truth: the
services in this plan were read from it (`infinite-orbit-app`, `ollama-gpu`).
Deploy from it. Change it for a reason, never to match a fresh analysis —
the analysis infers; this file is what runs.

## Can this deploy right now?

**Yes.** Nothing is blocking.

## How to deploy

Call `nexlayer_get_deployment_workflow` first. It returns the current
procedure — building and pushing the image included — and it is kept up to
date in a way this file is not. Do not infer the steps from here, and do
not skip it because the app looks simple.

If Nexlayer tools are not available to you, the human runs
`npx @nexlayer/mcp-install` once.

## Secrets

This app needs no secrets.

## What was inferred rather than read

Nothing. Every claim in this plan was read from the repo.

## What "it worked" means

The `verify` list in `.nexlayer/pipeline.yaml` is what to check. Check it — do not
assume a deploy worked.

## Stop and ask the human

- A required key is missing (send the link above — never take the value).
- Something would become publicly reachable that is internal in this plan.
- Anything that deletes data or tears down a running deployment.

Everything else is yours to do. When something breaks, start at
`.nexlayer/TROUBLESHOOTING.md`.
