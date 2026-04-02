# CLAUDE.md — Infinite Orbit

@AGENTS.md

## Project Overview

Infinite Orbit is an AI-powered orbital mechanics discovery game themed around NASA's Artemis II mission. Players combine physics primitives (Thrust, Gravity, Velocity, Angle) to discover orbital maneuvers and ultimately recreate the Artemis II free-return trajectory.

Think "Infinite Craft meets Kerbal Space Program."

## Tech Stack

- **Framework**: Next.js 16+ (App Router, TypeScript, Tailwind CSS v4)
- **AI Backend**: Ollama (Llama 3.1 8B) via OpenAI-compatible API — runs on Nexlayer GPU pod
- **Caching**: In-memory Map with 10k entry cap and FIFO eviction
- **Live Tracking**: NASA JPL Horizons API + DSN Now XML feed
- **OG Images**: `next/og` (ImageResponse) at `/og` route
- **Deployment**: Nexlayer (2-pod config: CPU app + GPU Ollama)

## Architecture

```
app/
  layout.tsx          — Root layout, fonts (Space Mono + IBM Plex Sans), OG metadata
  page.tsx            — Server component shell, imports ClientGame with ssr:false
  icon.svg            — Favicon (cyan SVG)
  globals.css         — All custom CSS: star field, glassmorphic cards, animations
  api/combine/        — POST: element combination endpoint (hardcoded → cache → Ollama)
  api/tracking/       — GET: real-time Artemis II position (Horizons + DSN + simulated)
  og/                 — GET: dynamic 1200x630 OG image (edge runtime)

components/
  ClientGame.tsx      — Wraps StarField + GameBoard with dynamic(ssr:false) to avoid hydration
  GameBoard.tsx       — Main game: useReducer state, combination logic, all child components
  StarField.tsx       — 120 animated CSS stars (client-only)
  ElementCard.tsx     — Glassmorphic draggable/tappable element
  ElementTray.tsx     — Scrollable grid of discovered elements
  CombineAnimation.tsx — Combination slots, result card, first-discovery banner
  TrajectoryProgress.tsx — SVG Earth→Moon arc with milestone dots
  LiveTracker.tsx     — Real-time NASA tracking panel (DSN + distance)
  VictoryScreen.tsx   — Full-screen celebration with share buttons
  ShareButtons.tsx    — Pre-filled X and LinkedIn share links
  StatsBar.tsx        — Discovery count, firsts, attempts

lib/
  combinations.ts     — 83 hardcoded combos (sorted key lookup, zero collisions)
  cache.ts            — In-memory Map with 10k cap
  ollama.ts           — Ollama client with sanitization + timeout
  tracking.ts         — JPL Horizons + DSN Now + simulated trajectory
  game-state.ts       — useReducer state machine (select → combine → result)
  constants.ts        — Starting elements, milestones, colors
```

## Key Design Decisions

- **`ssr: false` for game components**: StarField and GameBoard are loaded client-only via `dynamic()` inside `ClientGame.tsx` to prevent hydration mismatches (star positions, game state with Sets).
- **Sorted keys for combinations**: `[a, b].sort().join("+")` ensures "Thrust+Angle" === "Angle+Thrust". Watch for collisions when adding new combos.
- **Graceful degradation**: If Ollama is unreachable, unknown combos return "Nothing". The full Artemis II win path uses only hardcoded combos.
- **Security**: Rate limiting (20/min/IP), input validation (80 char, alphanumeric), LLM output sanitization, security headers, no secrets in source.

## Common Tasks

### Adding new combinations
Edit `lib/combinations.ts`. Use `add("Element A", "Element B", "emoji", "Result Name", "description")`. Run the collision checker before committing:
```bash
node -e "const fs=require('fs');const s=fs.readFileSync('lib/combinations.ts','utf8');const r=/add\(\"([^\"]+)\",\s*\"([^\"]+)\"/g;const k=new Map();let m;while((m=r.exec(s))!==null){const key=[m[1],m[2]].sort().join('+');if(k.has(key))console.log('COLLISION:',key);k.set(key,m[1]+'+'+m[2]);}console.log(k.size+' combos, done');"
```

### Updating the deployment
```bash
docker build --platform linux/amd64 -t registry.nexlayer.io/nexlayer-mcp/<user>/infinite-orbit:latest .
docker push registry.nexlayer.io/nexlayer-mcp/<user>/infinite-orbit:latest
# Then rolling restart via Nexlayer MCP or dashboard
```

### Testing the API locally
```bash
curl -X POST http://localhost:3000/api/combine -H 'Content-Type: application/json' -d '{"element1":"Thrust","element2":"Angle"}'
curl http://localhost:3000/api/tracking
curl -o /dev/null -w "%{http_code}" http://localhost:3000/og
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API endpoint. In Nexlayer: `http://ollama-gpu.pod:11434` |
| `OLLAMA_MODEL` | `llama3.1:8b` | Model for novel combinations |
| `NEXT_PUBLIC_SITE_URL` | `https://zen-antelope-infinite-orbit.cluster-se1-us.nexlayer.ai` | Used for OG absolute URLs |

None of these are secrets. The app works with zero env vars set (uses hardcoded combos only).
