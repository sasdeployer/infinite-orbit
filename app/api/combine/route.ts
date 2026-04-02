import { NextResponse } from "next/server";
import { lookupCombination } from "@/lib/combinations";
import { getCached, setCache, isFirstDiscovery } from "@/lib/cache";
import { queryOllama } from "@/lib/ollama";

// In-memory rate limiter: max 20 requests per minute per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip);
  }
}, 300_000);

const ELEMENT_NAME_RE = /^[a-zA-Z0-9 '\-().&]+$/;
const MAX_ELEMENT_LENGTH = 80;

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limited. Try again in a moment." },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const { element1, element2 } = body;

    if (!element1 || !element2 || typeof element1 !== "string" || typeof element2 !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Length and character validation
    if (element1.length > MAX_ELEMENT_LENGTH || element2.length > MAX_ELEMENT_LENGTH) {
      return NextResponse.json({ error: "Element name too long" }, { status: 400 });
    }
    if (!ELEMENT_NAME_RE.test(element1) || !ELEMENT_NAME_RE.test(element2)) {
      return NextResponse.json({ error: "Invalid element name" }, { status: 400 });
    }

    const e1 = element1.trim();
    const e2 = element2.trim();

    // 1. Check hardcoded combinations
    const hardcoded = lookupCombination(e1, e2);
    if (hardcoded) {
      const isNew = isFirstDiscovery(hardcoded.result);
      setCache(e1, e2, hardcoded);
      return NextResponse.json({ ...hardcoded, isNew });
    }

    // 2. Check server cache
    const cached = getCached(e1, e2);
    if (cached) {
      return NextResponse.json({ ...cached, isNew: false });
    }

    // 3. Query Ollama for novel combinations
    const aiResult = await queryOllama(e1, e2);
    if (aiResult && aiResult.isValid) {
      const isNew = isFirstDiscovery(aiResult.result);
      setCache(e1, e2, aiResult);
      return NextResponse.json({ ...aiResult, isNew });
    }

    // 4. Nothing result
    const nothing = {
      result: "Nothing",
      emoji: "\u{1F4AB}",
      description: aiResult?.description || "These don't combine into anything useful",
      isValid: false,
      isNew: false,
    };
    setCache(e1, e2, nothing);
    return NextResponse.json(nothing);
  } catch {
    return NextResponse.json(
      { result: "Nothing", emoji: "\u{1F4AB}", description: "Something went wrong", isValid: false, isNew: false },
      { status: 500 }
    );
  }
}
