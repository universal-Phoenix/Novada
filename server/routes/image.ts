import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { getGeminiClient } from "../services/geminiService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { prompt, size, ratio } = req.body;
    const userApiKey = req.headers["x-goog-api-key"] as string;

    if (!prompt) {
      return res.status(400).json({ ok: false, error: "Prompt is required" });
    }

    // Use user API key if provided, otherwise fallback to server's key
    const client = userApiKey ? new GoogleGenAI({ apiKey: userApiKey }) : getGeminiClient();

    const response = await client.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ text: prompt }],
      config: {
        imageConfig: {
          aspectRatio: ratio as any || "1:1",
          imageSize: size as any || "1K",
        }
      }
    });

    const imageParts = response.candidates?.[0]?.content?.parts?.filter(p => p.inlineData);
    if (!imageParts || imageParts.length === 0) {
      throw new Error("No image returned from Gemini");
    }

    const images = imageParts.map(p => `data:image/png;base64,${p.inlineData?.data}`);
    
    res.json({ ok: true, images });
  } catch (error: any) {
    console.error("Image Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    let userMessage = "Image generation failed.";
    if (error.message?.includes("API_KEY_INVALID")) {
      userMessage = "Invalid API key. Please check your settings.";
    } else if (error.message?.includes("Quota exceeded")) {
      userMessage = "Quota exceeded. Please try again later.";
    }
    
    res.status(500).json({ ok: false, error: userMessage });
  }
});

export default router;
