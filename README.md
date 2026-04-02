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

## Deploy Your Own

Two steps. No local setup needed.

### Step 1: Give Claude Code the Nexlayer plugin

```bash
npx @nexlayer/mcp-install
```

This lets Claude Code deploy apps to the cloud for you.

### Step 2: Tell Claude to ship it

Open [Claude Code](https://claude.ai/code) and say:

> *"Deploy https://github.com/sasdeployer/infinite-orbit to Nexlayer"*

That's it. Claude will clone the repo, build the Docker image, push it, and deploy it. You'll get a live URL in under 2 minutes.

### What Claude does behind the scenes

You don't need to know any of this — Claude handles it. But if you're curious:

- Reads the `nexlayer.yaml` config file in the repo
- Builds a Docker image from the `Dockerfile`
- Pushes it to Nexlayer's container registry
- Deploys two containers: your game on a CPU, the AI model on a GPU
- Connects them over a private network
- Gives you a public `https://your-app.nexlayer.ai` URL

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

### After it's deployed, you can keep talking to Claude:

| What you want | Say this |
|---|---|
| Check if it's working | *"Check the status of my deployment"* |
| Something broke | *"Show me the logs for the app pod"* |
| Use your own domain | *"Set up infiniteorbit.app as my custom domain"* |
| SSL not working | *"My site shows a certificate error, fix it"* |
| SSH into a container | *"Open a shell into the ollama-gpu pod"* |
| Pod won't start | *"The GPU pod is pending, tell me why"* |
| Restart it | *"Rolling restart the app deployment"* |
| Take it down | *"Delete my infinite-orbit deployment"* |

---

## Make It Your Own

This project was built entirely in one Claude Code session. Fork it and keep going:

1. Fork this repo
2. Open it in [Claude Code](https://claude.ai/code)
3. Claude reads `CLAUDE.md` and knows the full architecture
4. Tell it what you want:
   - *"Add a combination for Solar Sails"*
   - *"Change the color scheme to red and orange"*
   - *"Add a leaderboard"*
   - *"Make it track the ISS instead of Artemis"*
   - *"Deploy my fork to Nexlayer"*

---

## Why No Database? Why No Embeddings?

Most AI apps work like this: user input → embedding model → vector database → retrieval → LLM → response. That's a lot of infrastructure for a game.

Infinite Orbit skips all of it. Here's the trick:

```
Player combines two elements
        ↓
   Hash map lookup (O(1), instant)
   83 hardcoded combos cover the core game
        ↓ miss?
   In-memory cache lookup (O(1), instant)
   Every combo anyone has ever tried
        ↓ miss?
   LLM generates a new element (one-shot, ~1 second)
   Result gets cached forever
        ↓
   The LLM never answers the same question twice
```

The LLM isn't retrieving knowledge — it's **creating** it. It doesn't need to remember anything. It doesn't need context about what other players discovered. It just needs to be creative when given two physics concepts. One prompt, one answer, cached forever.

**The game gets smarter as people play.** Every novel combination a player tries becomes a cached answer for the next player. The knowledge graph grows from exploration — no training, no fine-tuning, no vector database. Just a hash map that fills up over time.

This is why the whole thing runs on a single Map with a 10k cap. No Postgres. No Redis. No Pinecone. The deterministic layer (hardcoded combos) handles the known universe. The LLM handles the unknown. And the cache turns unknowns into knowns.

**For CS students:** this is the [cache-aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) with an LLM as the fallback data source instead of a database. It's also a neat example of how you can build an AI product where inference cost approaches zero over time — because the cache hit rate only goes up.

---

## How It's Built

**Game:** Next.js 16, TypeScript, Tailwind CSS. Tap-tap mobile-first interaction, glassmorphic cards, animated CSS star field, SVG trajectory visualization with real milestone tracking.

**AI:** Llama 3.1 8B running on Ollama on a GPU pod. Called only for novel combinations. All outputs sanitized (alphanumeric filter on names, emoji validation, description length cap) and rate-limited (20 req/min per IP).

**Live NASA tracking:** Two real data sources, zero API keys needed:
- **JPL Horizons API** — computed spacecraft ephemeris (Orion's distance from Earth and Moon in km)
- **DSN Now XML feed** — real-time Deep Space Network status (which antenna at Goldstone/Madrid/Canberra is talking to Orion, signal strength, round-trip light time)
- **Simulated fallback** — interpolated trajectory model based on published Artemis II flight plan, used when APIs are unavailable

**Security:** Rate limiting, input length + character validation, LLM output sanitization, security headers (X-Frame-Options DENY, nosniff, referrer policy, permissions policy). No API keys, no secrets, no `.env` required.

<details>
<summary><strong>Full file structure</strong> (click to expand)</summary>

```
infinite-orbit/
├── app/
│   ├── layout.tsx              # Root layout, fonts, OG metadata
│   ├── page.tsx                # Main page
│   ├── icon.svg                # Favicon
│   ├── globals.css             # All styles + animations
│   ├── api/combine/route.ts    # POST: combine two elements
│   ├── api/tracking/route.ts   # GET: live Artemis II tracking
│   └── og/route.tsx            # Dynamic OG image (1200x630)
├── components/                 # 11 React components
├── lib/
│   ├── combinations.ts         # 83 hardcoded element combinations
│   ├── cache.ts                # In-memory cache (10k cap)
│   ├── ollama.ts               # Ollama AI client
│   ├── tracking.ts             # NASA JPL Horizons + DSN
│   ├── game-state.ts           # Game state machine
│   └── constants.ts            # Starting elements, milestones
├── nexlayer.yaml               # Cloud deployment config
├── Dockerfile                  # Production container build
├── CLAUDE.md                   # Guide for Claude Code
└── .env.example                # Environment variables (all optional)
```

</details>

<details>
<summary><strong>Run locally</strong> (click to expand)</summary>

If you want to run it on your machine instead of deploying:

```bash
git clone https://github.com/sasdeployer/infinite-orbit.git
cd infinite-orbit
npm install
npm run dev
```

Requires [Node.js](https://nodejs.org) 18+. For AI combinations, install [Ollama](https://ollama.ai) and run `ollama pull llama3.1:8b`.

</details>

---

## License

MIT — do whatever you want with it.

---

Built with [Claude Code](https://claude.ai/code). Deployed on [Nexlayer](https://nexlayer.com).
