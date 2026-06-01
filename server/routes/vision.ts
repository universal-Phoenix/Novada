import { Router } from "express";
import { getGeminiClient } from "../services/geminiService";
import { Type } from "@google/genai";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ ok: false, error: "Image data is required" });
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        { inlineData: { data: imageBase64, mimeType } },
        { text: prompt || "Analyze this image: perform object detection, OCR (including raw and formatted text), and scene understanding." }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sceneDescription: { type: Type.STRING, description: "Detailed description of the scene." },
            objectsDetected: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1." }
                }
              }
            },
            ocrText: { type: Type.STRING, description: "Raw text extracted from the image." },
            formattedOcrText: { type: Type.STRING, description: "Cleanly formatted text extracted from the image, preserving layout and structure." }
          }
        }
      }
    });

    res.json({ ok: true, data: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("Vision Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    let userMessage = "Vision analysis failed.";
    if (error.message?.includes("API_KEY_INVALID")) {
      userMessage = "Invalid API key. Please check your settings.";
    } else if (error.message?.includes("Quota exceeded")) {
      userMessage = "Quota exceeded. Please try again later.";
    }
    
    res.status(500).json({ ok: false, error: userMessage });
  }
});

export default router;
