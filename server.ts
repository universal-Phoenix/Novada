import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";

import chatRouter from "./server/routes/chat";
import imageRouter from "./server/routes/image";
import visionRouter from "./server/routes/vision";
import ttsRouter from "./server/routes/tts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // API routes
  app.get("/api/health", (req, res) => {
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    res.json({ ok: true, service: "universal-dragon" });
  });
  
  app.use("/api/chat", chatRouter);
  app.use("/api/image", imageRouter);
  app.use("/api/vision", visionRouter);
  app.use("/api/speech/tts", ttsRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Universal Dragon server running on http://localhost:${PORT}`);
  });
}

startServer();
