import { Router } from "express";
import { routeChatRequest } from "../services/routerService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { model, prompt, history, options } = req.body;
    const openaiKey = req.headers["x-openai-key"] as string | undefined;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ ok: false, error: "Prompt is required" });
    }

    const result = await routeChatRequest({
      model: model || "gemini",
      prompt,
      history: Array.isArray(history) ? history : [],
      options: { ...options, openaiKey },
    });

    res.json({ ok: true, ...result });
  } catch (error: any) {
    console.error("Chat Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    let userMessage = "Chat request failed.";
    if (error.message?.includes("API_KEY_INVALID")) {
      userMessage = "Invalid API key. Please check your settings.";
    } else if (error.message?.includes("Quota exceeded")) {
      userMessage = "Quota exceeded. Please try again later.";
    }
    
    res.status(500).json({ ok: false, error: userMessage });
  }
});

export default router;
