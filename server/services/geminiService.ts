import { GoogleGenAI, ThinkingLevel } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY:", key ? `Set (length: ${key.length})` : "Not Set");
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export async function askGemini(
  prompt: string,
  history: Array<{ role: string; content: string }> = [],
  options: { useSearch?: boolean; useMaps?: boolean; thinkingMode?: boolean; systemInstruction?: string } = {}
) {
  const client = getGeminiClient();
  
  const historyText = history
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const fullPrompt = historyText ? `${historyText}\nUSER: ${prompt}` : prompt;

  const tools: any[] = [];
  if (options.useSearch) tools.push({ googleSearch: {} });
  if (options.useMaps) tools.push({ googleMaps: {} });

  const config: any = {
    tools: tools.length > 0 ? tools : undefined,
    systemInstruction: options.systemInstruction,
  };

  if (options.thinkingMode) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  }

  const model = options.useMaps ? "gemini-2.5-flash" : "gemini-3-flash-preview";

  const response = await client.models.generateContent({
    model,
    contents: fullPrompt,
    config,
  });

  return response.text || "No response returned.";
}
