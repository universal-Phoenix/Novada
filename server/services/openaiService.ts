import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(apiKey?: string): OpenAI {
  if (apiKey) {
    return new OpenAI({ apiKey });
  }
  if (!client) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    client = new OpenAI({ apiKey: key });
  }
  return client;
}

export async function askOpenAI(
  prompt: string,
  history: Array<{ role: string; content: string }> = [],
  options: { systemInstruction?: string; openaiKey?: string } = {}
) {
  const openai = getOpenAIClient(options.openaiKey);
  
  const messages: any[] = [];
  
  if (options.systemInstruction) {
    messages.push({ role: "system", content: options.systemInstruction });
  }

  messages.push(...history.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })));
  messages.push({ role: "user" as const, content: prompt });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
  });

  return response.choices[0]?.message?.content || "No response returned.";
}
