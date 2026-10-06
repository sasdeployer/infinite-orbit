# infinite-orbit — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/infinite-orbit` on `main`
- **Analyzed** 2026-10-06T22:47:58.799Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| TypeScript | 5 | read from `package.json`, `tsconfig.json` |
| Next.js | 16.2.2 | read from `package.json`, `next.config.ts` |
| React | 19.2.4 | read from `package.json` |
| Tailwind CSS | 4 | read from `package.json` |
| @vercel/og | 0.11.1 | read from `package.json` |
| Playwright | 1.59.1 | read from `package.json` |
| ESLint | 9 | read from `package.json`, `eslint.config.mjs` |
| Docker | node:20-alpine multi-stage | read from `Dockerfile` |

## How Nexlayer will run it

| Service | Reachable | Image | How we know |
| --- | --- | --- | --- |
| `infinite-orbit-app` | public | `infinite-orbit:latest` | read from `nexlayer.yaml` |
| `ollama-gpu` | internal only | `ollama/ollama:latest` | read from `nexlayer.yaml` |

Reachability is inferred from service names and roles, not stated by the
analysis. Check it before relying on it — exposing something that should
be internal is not recoverable by editing this file afterwards.

Networking, HTTPS, and service discovery are handled.

## Secrets

This app needs no secrets to run.

## What the human told us

**Stage.** This is a side project.

Said by a person, not derived from the code. Where this contradicts what
the repo looks like, the person is right about intent and the repo is
right about what exists today.

## Notes from the analysis

- Single stateless pod. The repo has no database, cache or queue, so none are planned.
- The Dockerfile builds with output: standalone and starts with node server.js on port 3000. Build the image from it, or use a node:20-alpine base as listed.
- The pod needs outbound internet access to reach NASA JPL Horizons and DSN endpoints.
- Set HOSTNAME=0.0.0.0 so the standalone server binds to all interfaces.

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
