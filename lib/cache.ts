import { type CombinationResult } from "./combinations";

const MAX_CACHE_SIZE = 10_000;
const cache = new Map<string, CombinationResult>();
const discoveredBy = new Map<string, boolean>();

function makeKey(a: string, b: string): string {
  return [a, b].sort().join("+");
}

export function getCached(a: string, b: string): CombinationResult | null {
  return cache.get(makeKey(a, b)) ?? null;
}

export function setCache(a: string, b: string, result: CombinationResult): boolean {
  const k = makeKey(a, b);
  const isNew = !cache.has(k);

  // Evict oldest entries if cache is full
  if (isNew && cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }

  cache.set(k, result);
  if (isNew && result.isValid) {
    discoveredBy.set(result.result, true);
  }
  return isNew;
}

export function isFirstDiscovery(resultName: string): boolean {
  return !discoveredBy.has(resultName);
}
