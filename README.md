# Infinite Orbit

**An AI-powered space game where you combine physics concepts to recreate NASA's Artemis II Moon mission.**

You start with 4 elements — Thrust, Gravity, Velocity, Angle. Tap two together and discover what they create. Chain discoveries until you've built the entire Artemis II free-return trajectory. It even tracks the real Orion spacecraft live via NASA's Deep Space Network.

**[Play it now](https://zen-antelope-infinite-orbit.cluster-se1-us.nexlayer.ai)** — no sign-up, works on your phone.

![Infinite Orbit gameplay](public/screenshot.png)

---

## What You'll Discover

```
🔥 Thrust  + 📐 Angle     →  🚀 Burn
🚀 Burn    + 🔄 Orbit     →  🔁 Hohmann Transfer
🆙 Escape  + 📐 Angle     →  🛤️ Trans-Lunar Injection
🪃 Free Return + 🌒 Flyby →  🏆 Artemis II Trajectory
🏆 Artemis + 🔧 Delta-V   →  🌟 Mission Complete!
```

83 real orbital mechanics concepts, from basic burns to gravity assists. Plus easter eggs — try combining Gravity + Gravity or Burn + Burn.

---

## Run It Yourself

**Prerequisites:** [Node.js](https://nodejs.org) 18+ (just download and install it if you don't have it)

```bash
git clone https://github.com/sasdeployer/infinite-orbit.git
cd infinite-orbit
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). That's it — the game works immediately with all 83 combinations built in.

### Want AI-generated combinations too?

Install [Ollama](https://ollama.ai) (free, runs locally), then:

```bash
ollama pull llama3.1:8b
```

Now when you try a combination that isn't in the built-in list, a local AI invents a new physics concept for you. No API keys, no cloud costs — it runs on your machine.

---

## Deploy to the Cloud

This app is set up to deploy on [Nexlayer](https://nexlayer.com) — an AI-native cloud that can run your Next.js app on CPUs and the AI model on GPUs, side by side.

### Step 1: Install the Nexlayer plugin for Claude Code

```bash
npx @nexlayer/mcp-install
```

This connects Claude Code to Nexlayer's cloud platform. Think of it as giving Claude the ability to deploy, debug, and manage your app in the cloud — all through conversation.

### Step 2: Ask Claude to deploy it

Open [Claude Code](https://claude.ai/code) in this project and say:

> *"Ship this app to Nexlayer"*

Claude will:
- Read the `nexlayer.yaml` config
- Build your Docker image
- Push it to Nexlayer's registry
- Deploy two containers (your app + the AI model)
- Give you a live URL

### That's the whole process. Here are more things you can ask:

**Deploying:**
| What you want | Say this |
|---|---|
| Deploy for the first time | *"Ship this app to Nexlayer"* |
| Check if it's healthy | *"Check the status of my deployment"* |
| See what went wrong | *"Show me the logs for the app pod"* |
| Take it down | *"Delete my infinite-orbit deployment"* |

**Custom domain:**
| What you want | Say this |
|---|---|
| Use your own domain | *"Set up infiniteorbit.app as my custom domain"* |
| Fix SSL issues | *"My site shows a certificate error, fix it"* |

**Debugging (if something breaks):**
| What you want | Say this |
|---|---|
| SSH into a container | *"Open a shell into the ollama-gpu pod"* |
| Figure out why a pod won't start | *"The GPU pod is pending, tell me why"* |
| Test if services can talk to each other | *"Check if the app can reach Ollama on port 11434"* |
| Restart everything | *"Rolling restart the app deployment"* |

### What gets deployed

```
┌─────────────────────────────────────────────────────┐
│  Nexlayer Cloud                                     │
│                                                     │
│  ┌──────────────────────┐  ┌─────────────────────┐  │
│  │  infinite-orbit-app  │  │    ollama-gpu        │  │
│  │  ─────────────────── │  │  ─────────────────── │  │
│  │  Next.js 16          │──│  Ollama + Llama 3.1  │  │
│  │  Port 3000           │  │  Port 11434          │  │
│  │  CPU                 │  │  GPU (NVIDIA)        │  │
│  └──────────────────────┘  └─────────────────────┘  │
│         │                                           │
│         │  They talk via: ollama-gpu.pod:11434       │
│         │                                           │
│  ┌──────┴──────────────────────────────────────┐    │
│  │  Your URL: https://your-app.nexlayer.ai     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

The app pod handles the game, the GPU pod handles AI. They communicate over Nexlayer's internal network. You get a public URL automatically.

---

## Modify It with Claude Code

This project was built entirely in one Claude Code session. You can keep going:

1. Open this project in [Claude Code](https://claude.ai/code)
2. Claude reads `CLAUDE.md` and knows the full architecture
3. Ask it anything:
   - *"Add a combination for Solar Sails"*
   - *"Change the color scheme to red and orange"*
   - *"Add a leaderboard"*
   - *"Make it track the ISS instead of Artemis"*

---

## How It's Built

**Game:** Next.js 16, TypeScript, Tailwind CSS. Tap-tap interaction, glassmorphic cards, animated star field, SVG trajectory visualization.

**AI:** Ollama running Llama 3.1 8B locally. When you combine elements not in the hardcoded list, the AI generates a new physics concept. Sanitized and rate-limited.

**Live tracking:** Pulls real data from two NASA sources:
- **JPL Horizons API** — computed spacecraft position (distance from Earth/Moon)
- **DSN Now XML feed** — which ground antenna is talking to Orion right now

**Security:** Rate limiting, input validation, LLM output sanitization, security headers. No API keys anywhere. No secrets in the repo.

<details>
<summary><strong>Full file structure</strong> (click to expand)</summary>

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
│   ├── GameBoard.tsx           # Main game logic (useReducer)
│   ├── ElementCard.tsx         # Tappable element card
│   ├── ElementTray.tsx         # Scrollable element grid
│   ├── CombineAnimation.tsx    # Combination slots + result
│   ├── TrajectoryProgress.tsx  # SVG Earth→Moon progress arc
│   ├── LiveTracker.tsx         # Real-time NASA tracking panel
│   ├── VictoryScreen.tsx       # Win screen + share buttons
│   ├── ShareButtons.tsx        # Pre-filled X + LinkedIn share
│   ├── StatsBar.tsx            # Discovery stats
│   └── StarField.tsx           # Animated background stars
├── lib/
│   ├── combinations.ts         # 83 hardcoded element combinations
│   ├── cache.ts                # In-memory cache (10k entry cap)
│   ├── ollama.ts               # Ollama AI client with sanitization
│   ├── tracking.ts             # NASA JPL Horizons + DSN + simulation
│   ├── game-state.ts           # Game state machine
│   └── constants.ts            # Starting elements, milestones, colors
├── nexlayer.yaml               # Cloud deployment config
├── Dockerfile                  # Production container build
├── CLAUDE.md                   # Guide for Claude Code
└── .env.example                # Environment variables (all optional)
```

</details>

---

## License

MIT — do whatever you want with it.

---

Built with [Claude Code](https://claude.ai/code). Deployed on [Nexlayer](https://nexlayer.com).
