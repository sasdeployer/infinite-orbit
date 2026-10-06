# Troubleshooting `infinite-orbit` on Nexlayer

Every tool below takes the same two values. They are already known:

| | |
| --- | --- |
| applicationName | `infinite-orbit` |
| environment | `<environment from the nexlayer_deploy response>` |
| services | `infinite-orbit-app`, `ollama-gpu` |
| inside the debug proxy | `infinite-orbit-infinite-orbit-app-service:3000`, `infinite-orbit-ollama-gpu-service:11434` |

## First move, by symptom

| Symptom | Start with |
| --- | --- |
| Deploy didn't come up, or a service keeps restarting | `nexlayer_check_deployment_status` → `nexlayer_get_deployment_logs` for that service → `nexlayer_get_deployment_events` |
| The site answers but with errors (500s, blank page) | `nexlayer_get_deployment_logs`, then the debug proxy (below) to look inside |
| One service can't reach another | debug proxy → `nexlayer_debug_proxy_exec` / `nexlayer_debug_proxy_http` against the full service name above (never localhost) |
| Status shows more services than `nexlayer.yaml` lists | a leftover from an older config — it keeps running after it leaves the file. Ask the human before removing it. |
| Image won't pull | rebuild and push with `nexlayer_build_and_push_image` (below) |
| Wrong config or env var in production | fix it in the code / `nexlayer.yaml` and redeploy; for an emergency, `nexlayer_debug_file_edit` then `nexlayer_debug_pod_restart` |

## Look inside the running app (debug proxy)

1. `nexlayer_debug_deploy_proxy` with environment `<environment from the nexlayer_deploy response>` and applicationName `infinite-orbit` — once per session; it sleeps when idle.
2. `nexlayer_debug_namespace_info` — the running services and their exact names.
   Inside the proxy, address services by their full name (table above). The
   environment is shared, so a bare `<service>.pod` can reach another app.
3. Then what the symptom needs: `nexlayer_debug_proxy_http` (e.g. `http://infinite-orbit-infinite-orbit-app-service:3000/`), `nexlayer_debug_proxy_exec`, `nexlayer_debug_db_query`, `nexlayer_debug_shell_open`, `nexlayer_debug_file_list` / `nexlayer_debug_file_edit`.
4. After any change inside, restart: `nexlayer_debug_pod_restart` (one service) or `nexlayer_debug_pod_restart_deployment`.

A fix made inside the running app is lost on the next deploy. Put the same
fix in the code or `nexlayer.yaml` before you call it done.

Full guide: `.nexlayer/skills/debug-nexlayer/SKILL.md`.

## Build and push an image

- `nexlayer_build_and_push_image` returns the exact image reference
  (`registry.nexlayer.io/<your user id>/<name>:<tag>`) and the login and push
  commands for this account. Use what it returns.
- Build for `linux/amd64`. Tag immutably (a commit sha or version) — `latest`
  is rejected.
- Base images from Docker Hub go through `mirror.gcr.io/library/…`.
- The app binds `0.0.0.0`; services reach each other at `<service>.pod`;
  browser-facing URLs use `<% URL %>` in `nexlayer.yaml`.

## Done means verified

`nexlayer_check_deployment_status` healthy for every service, and the URL answers with a real page — the `verify` list in `.nexlayer/pipeline.yaml`.
