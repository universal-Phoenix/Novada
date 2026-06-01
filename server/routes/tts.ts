import { Router } from "express";
import { getGeminiClient } from "../services/geminiService";
import { Modality } from "@google/genai";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, error: "Text is required" });
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio returned from Gemini");
    }

    res.json({ ok: true, audio: base64Audio });
  } catch (error: any) {
    console.error("TTS Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    let userMessage = "TTS generation failed.";
    if (error.message?.includes("API_KEY_INVALID")) {
      userMessage = "Invalid API key. Please check your settings.";
    } else if (error.message?.includes("Quota exceeded")) {
      userMessage = "Quota exceeded. Please try again later.";
    }
    
    res.status(500).json({ ok: false, error: userMessage });
  }
});

export default router;
