export interface OllamaResult {
  result: string;
  emoji: string;
  description: string;
  isValid: boolean;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2:0.5b";

const SYSTEM_PROMPT = `You are the physics engine for a space exploration discovery game. When given two space/physics concepts, you determine what they combine into.

Rules:
- Return a JSON object: {"result": "Name", "emoji": "single_emoji", "description": "One sentence, max 12 words", "isValid": true}
- If the combination doesn't make physical or logical sense, return: {"result": "Nothing", "emoji": "💫", "description": "These don't combine into anything useful", "isValid": false}
- Results should feel grounded in real physics but can be playful. Think Kerbal Space Program meets a physics textbook.
- Orbital mechanics concepts take priority. Space exploration concepts second. General physics third.
- Descriptions should be witty, concise, and teach something real.
- NEVER return harmful, political, or inappropriate content.
- Return ONLY the JSON object, no other text.`;

// Sanitize a string to safe alphanumeric + basic punctuation
function sanitize(s: string, maxLen: number): string {
  return s.replace(/[^\w\s\-'().&,!?°:]/g, "").slice(0, maxLen).trim();
}

// Validate emoji: must be 1-2 codepoints (emoji can be multi-codepoint)
function sanitizeEmoji(s: string): string {
  const match = s.match(/\p{Emoji_Presentation}/u);
  return match ? match[0] : "\u{1F4AB}";
}

export async function queryOllama(element1: string, element2: string): Promise<OllamaResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${OLLAMA_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Combine "${element1}" + "${element2}"` },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.result || !parsed.emoji || !parsed.description) return null;

    return {
      result: sanitize(String(parsed.result), 60),
      emoji: sanitizeEmoji(String(parsed.emoji)),
      description: sanitize(String(parsed.description), 80),
      isValid: parsed.isValid !== false,
    };
  } catch {
    return null;
  }
}
