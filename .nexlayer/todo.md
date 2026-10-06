# infinite-orbit — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Replace the local image tag with the registry image (`nexlayer.yaml`)
      _infinite-orbit:latest is not pullable, so the deploy fails._
- [ ] Pass NEXT_PUBLIC_SITE_URL at build time (`Dockerfile`)
      _NEXT_PUBLIC_* values are baked in during next build. Without it, OG and share URLs may be wrong._
- [ ] Pull the Ollama model on startup (`nexlayer.yaml`)
      _Without this, a fresh Ollama service has no qwen2:0.5b model and combine requests to it fail until the model is pulled._
- [ ] Use mirror.gcr.io/library/node:20-alpine in FROM lines (`Dockerfile`)
      _Docker Hub rate limits can fail the build._

## Needs the human

- [ ] Decide: Is the Ollama GPU service worth its cost, or should combinations come only from the built-in table in lib/combinations.ts?
- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200
- [ ] GET /api/tracking returns 200 with JSON
- [ ] GET /og returns an image/png
- [ ] POST /api/combine with two element names returns a result

---

Machine-readable: `.nexlayer/findings.json`.
