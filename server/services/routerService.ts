import { askOpenAI } from "./openaiService";
import { askGemini } from "./geminiService";

type ChatInput = {
  model: "openai" | "gemini" | string;
  prompt: string;
  history: Array<{ role: string; content: string }>;
  options?: {
    useSearch?: boolean;
    useMaps?: boolean;
    thinkingMode?: boolean;
    systemInstruction?: string;
    openaiKey?: string;
  };
};

export async function routeChatRequest(input: ChatInput) {
  if (input.model === "openai") {
    const reply = await askOpenAI(input.prompt, input.history, input.options);
    return { reply, modelUsed: "openai" };
  }

  // Default to Gemini
  const reply = await askGemini(input.prompt, input.history, input.options);
  return { reply, modelUsed: "gemini" };
}
