# Infinite Orbit

**Recreate NASA's Artemis II Moon mission trajectory from first principles.**

An AI-powered orbital mechanics discovery game. Start with 4 physics primitives — Thrust, Gravity, Velocity, Angle — combine them to discover burns, orbits, and transfers, and build your way to the Artemis II free-return trajectory.

**[Play Now](https://zen-antelope-infinite-orbit.cluster-se1-us.nexlayer.ai)** — no sign-up, works on mobile.

---

## How It Works

```
🔥 Thrust + 📐 Angle  →  🚀 Burn
🚀 Burn   + 🔄 Orbit  →  🔁 Hohmann Transfer
...keep combining...    →  🏆 Artemis II Trajectory
                        →  🌟 Mission Complete!
```

- **83 pre-seeded combinations** covering orbital mechanics, Artemis II mission elements, crew members, and easter eggs
- **AI-generated discoveries** for novel combinations via Llama 3.1 8B (runs on GPU)
- **Real-time NASA tracking** — live Orion position from JPL Horizons API + Deep Space Network
- **Victory screen** with pre-filled share buttons for X and LinkedIn

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/infinite-orbit.git
cd infinite-orbit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The game works fully with zero configuration — all core combinations are hardcoded.

### Optional: AI-Generated Combinations

Install [Ollama](https://ollama.ai), pull a model, and the app auto-connects:

```bash
ollama pull llama3.1:8b
# App detects Ollama at localhost:11434 automatically
```

---

## Deploy to Nexlayer

This project is optimized for [Nexlayer](https://nexlayer.com) deployment with two pods: a CPU pod for the Next.js app and a GPU pod for Ollama.

### Quick Deploy

```bash
npx nexlayer deploy
```

This reads `nexlayer.yaml` and deploys both containers. The app pod connects to Ollama via Nexlayer's internal pod DNS (`http://ollama-gpu.pod:11434`).

### What Gets Deployed

| Pod | Image | Resources | Purpose |
|-----|-------|-----------|---------|
| `infinite-orbit-app` | Next.js standalone | CPU | Game server, API, OG images |
| `ollama-gpu` | `ollama/ollama:latest` | GPU (NVIDIA) | Llama 3.1 8B for novel combinations |

### Step-by-Step (with Claude Code + Nexlayer MCP)

1. **Build the Docker image:**
   ```bash
   docker build --platform linux/amd64 -t registry.nexlayer.io/nexlayer-mcp/<user>/infinite-orbit:latest .
   ```

2. **Authenticate and push:**
   ```bash
   # Get JWT via nexlayer_get_jwt_token MCP tool
   docker login registry.nexlayer.io -u 'tokenreview$jwt' -p <your-jwt>
   docker push registry.nexlayer.io/nexlayer-mcp/<user>/infinite-orbit:latest
   ```

3. **Update `nexlayer.yaml`** with your registry path

4. **Validate and deploy:**
   ```bash
   # Via Nexlayer MCP tools:
   nexlayer_validate_yaml    # Check config
   nexlayer_deploy           # Ship it
   ```

5. **Pull the model** into the Ollama pod after it starts:
   ```bash
   # Via nexlayer_debug_shell_open on the ollama-gpu pod:
   ollama pull llama3.1:8b
   ```

---

## Recreate with Claude Code

This entire project was built in a single Claude Code session. To recreate or extend it:

1. Clone this repo
2. Open it with [Claude Code](https://claude.ai/code)
3. Claude will read `CLAUDE.md` and understand the full architecture
4. Ask it to add combinations, change the theme, wire up new data sources, etc.

The `CLAUDE.md` file contains the complete architecture guide, file map, design decisions, and common tasks — everything Claude needs to work on this project effectively.

---

## Project Structure

```
infinite-orbit/
├── app/
│   ├── layout.tsx              # Root layout, fonts, OG metadata
│   ├── page.tsx                # Main page (SSR shell + client game)
│   ├── icon.svg                # Favicon
│   ├── globals.css             # All styles + animations
│   ├── api/combine/route.ts    # POST: combine two elements
│   ├── api/tracking/route.ts   # GET: live Artemis II tracking
│   └── og/route.tsx            # Dynamic OG image (1200x630)
├── components/
│   ├── ClientGame.tsx          # Client-only wrapper (no SSR)
│   ├── GameBoard.tsx           # Main game logic
│   ├── ElementCard.tsx         # Draggable/tappable element
│   ├── ElementTray.tsx         # Scrollable element grid
│   ├── CombineAnimation.tsx    # Combination slots + result
│   ├── TrajectoryProgress.tsx  # SVG Earth→Moon progress arc
│   ├── LiveTracker.tsx         # Real-time NASA tracking
│   ├── VictoryScreen.tsx       # Win screen + share buttons
│   ├── ShareButtons.tsx        # X + LinkedIn share
│   ├── StatsBar.tsx            # Discovery stats
│   └── StarField.tsx           # Animated background
├── lib/
│   ├── combinations.ts         # 83 hardcoded combinations
│   ├── cache.ts                # In-memory cache (10k cap)
│   ├── ollama.ts               # Ollama/Llama client
│   ├── tracking.ts             # JPL Horizons + DSN + simulation
│   ├── game-state.ts           # useReducer state machine
│   └── constants.ts            # Elements, milestones, colors
├── nexlayer.yaml               # Deployment config (2 pods)
├── Dockerfile                  # Multi-stage Next.js build
├── CLAUDE.md                   # Claude Code project guide
└── .env.example                # Environment variables
```

---

## Security

- Rate limiting: 20 requests/min per IP on `/api/combine`
- Input validation: 80 char max, alphanumeric characters only
- LLM output sanitization on all AI-generated content
- Security headers: X-Frame-Options DENY, nosniff, referrer policy
- No secrets in source code — zero API keys required
- `.dockerignore` excludes `.git`, `.env`, `node_modules`

---

## Live Data Sources

| Source | Endpoint | Updates | Auth |
|--------|----------|---------|------|
| JPL Horizons | `ssd.jpl.nasa.gov/api/horizons.api` | Hourly | None |
| DSN Now | `eyes.nasa.gov/dsn/data/dsn.xml` | ~5 seconds | None |
| Simulated | Internal trajectory model | Real-time | N/A |

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript, standalone output)
- **Tailwind CSS v4** (CSS-based config)
- **Ollama + Llama 3.1 8B** (local GPU inference)
- **Nexlayer** (AI-native cloud, CPU + GPU pods)

---

## License

MIT

---

Built with [Claude Code](https://claude.ai/code). Deployed on [Nexlayer](https://nexlayer.com).
