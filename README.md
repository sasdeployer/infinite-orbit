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
git clone https://github.com/sasdeployer/infinite-orbit.git
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

This project deploys to [Nexlayer](https://nexlayer.com) with two pods: a **CPU pod** for the Next.js app and a **GPU pod** for Ollama/Llama inference.

### 1. Install the Nexlayer MCP

```bash
npx @nexlayer/mcp-install
```

This gives Claude Code (or any MCP-compatible AI agent) access to Nexlayer's 47 deployment tools — from writing YAML configs to deploying containers, managing domains, and debugging live pods.

### 2. Tell Claude Code What You Want

Once the MCP is installed, just describe what you need in natural language. Claude handles the tool calls. Here are example prompts for each stage:

#### Deploy

| What you want | What to tell Claude |
|---|---|
| First deployment | *"Ship this app to Nexlayer"* |
| Deploy with GPU | *"Deploy this with an Ollama GPU pod for AI inference"* |
| Validate before deploying | *"Check my nexlayer.yaml for errors before deploying"* |
| See what's running | *"Check the status of my deployment"* |
| Read container logs | *"Show me the logs for the app pod"* |
| Tear it down | *"Delete my infinite-orbit deployment"* |

#### Custom Domain

| What you want | What to tell Claude |
|---|---|
| Add your domain | *"Set up infiniteorbit.app as my custom domain"* |
| Check DNS | *"Verify my nameservers are pointed to Nexlayer"* |
| Fix SSL | *"My site shows a certificate error, fix it"* |

#### Debug Live Pods

| What you want | What to tell Claude |
|---|---|
| SSH into a pod | *"Open a shell into the ollama-gpu pod"* |
| Test connectivity | *"Check if the app pod can reach Ollama on port 11434"* |
| Inspect a stuck pod | *"The GPU pod is pending, tell me why"* |
| Check DNS resolution | *"Test if ollama-gpu.pod resolves inside the cluster"* |
| Read a file on a pod | *"Show me /app/server.js on the app pod"* |
| Hot-patch a config | *"Change NODE_ENV to development on the app pod"* |
| Restart a pod | *"Rolling restart the app deployment"* |
| Scale up | *"Scale the app to 3 replicas"* |
| Run a SQL query | *"Query the users table on the postgres pod"* |

#### Account & Keys

| What you want | What to tell Claude |
|---|---|
| Check your auth | *"Show me my Nexlayer JWT token"* |
| Create an API key | *"Generate a new Nexlayer API key"* |
| Report a bug | *"File a bug report about the GPU pod not scheduling"* |

### What Gets Deployed

```
┌─────────────────────────────────────────────────────┐
│  Nexlayer Cluster                                   │
│                                                     │
│  ┌──────────────────────┐  ┌─────────────────────┐  │
│  │  infinite-orbit-app  │  │    ollama-gpu        │  │
│  │  ─────────────────── │  │  ─────────────────── │  │
│  │  Next.js 16          │──│  Ollama + Llama 3.1  │  │
│  │  Port 3000           │  │  Port 11434          │  │
│  │  CPU pod             │  │  GPU pod (NVIDIA)    │  │
│  └──────────────────────┘  └─────────────────────┘  │
│         │                                           │
│         │  Internal DNS: ollama-gpu.pod:11434        │
│         │                                           │
│  ┌──────┴──────────────────────────────────────┐    │
│  │  External: https://your-app.nexlayer.ai     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

| Pod | Image | Resources | Purpose |
|-----|-------|-----------|---------|
| `infinite-orbit-app` | Next.js standalone | CPU | Game server, API, OG images, NASA tracking |
| `ollama-gpu` | `ollama/ollama:latest` | GPU (NVIDIA) | Llama 3.1 8B for AI-generated novel combinations |

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
