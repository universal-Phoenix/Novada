import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Toaster, toast } from "sonner";
import {
  Sparkles,
  Mic,
  Send,
  Cpu,
  Image as ImageIcon,
  Video,
  Eye,
  Radio,
  Settings,
  Bot,
  Zap,
  Shield,
  Copy,
  Search,
} from "lucide-react";

function NeonGrid() {
  const group = useRef<any>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.position.z += delta * 5;
    if (group.current.position.z > 4) group.current.position.z = 0;
  });

  const lines = useMemo(() => Array.from({ length: 28 }, (_, i) => i - 14), []);

  return (
    <group ref={group} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -1.8, 0]}>
      {lines.map((i) => (
        <React.Fragment key={i}>
          <mesh position={[i * 0.8, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, 24]} />
            <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={1.6} />
          </mesh>
          <mesh position={[0, 0, i * 0.8]}>
            <boxGeometry args={[24, 0.02, 0.02]} />
            <meshStandardMaterial color="#6a5cff" emissive="#6a5cff" emissiveIntensity={1.3} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

function DragonCore({ active }: { active: boolean }) {
  const ref = useRef<any>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.8;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
    const s = active ? 1.15 + Math.sin(state.clock.elapsedTime * 5) * 0.05 : 1;
    ref.current.scale.setScalar(s);
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <group ref={ref} position={[0, 0.7, 0]}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#00d9ff"
            emissive="#00d9ff"
            emissiveIntensity={2.5}
            roughness={0.1}
            metalness={0.3}
            wireframe
          />
        </mesh>
        <mesh scale={0.65}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffd000"
            emissive="#ff8a00"
            emissiveIntensity={active ? 3.5 : 2}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ active }: { active: boolean }) {
  return (
    <Canvas camera={{ position: [0, 1.6, 6], fov: 55 }}>
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 6, 22]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 2, 2]} intensity={4} color="#00eaff" />
      <pointLight position={[2, 1, -1]} intensity={2} color="#7c4dff" />
      <pointLight position={[-2, 1, 1]} intensity={2} color="#ffb300" />
      <Suspense fallback={null}>
        <Stars radius={80} depth={30} count={1800} factor={3} saturation={0} fade speed={1} />
        <NeonGrid />
        <DragonCore active={active} />
        <Text
          position={[0, 2.6, -1.8]}
          fontSize={0.42}
          color="#d8f8ff"
          anchorX="center"
          anchorY="middle"
        >
          UNIVERSAL DRAGON
        </Text>
        <Text
          position={[0, 2.08, -1.8]}
          fontSize={0.16}
          color="#85a6ff"
          anchorX="center"
          anchorY="middle"
        >
          NOVA SCIENTIFIC CORE · LIVE 3D SYSTEM
        </Text>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.6} intensity={1.7} />
      </EffectComposer>
    </Canvas>
  );
}

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${
        active
          ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.24)]"
          : "border-white/15 bg-white/5 text-zinc-300"
      }`}
    >
      {children}
    </div>
  );
}

export default function UniversalDragon2050() {
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
  const [prompt, setPrompt] = useState("");
  const [activeModule, setActiveModule] = useState("Chat Core");
  const [voiceOn, setVoiceOn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      title: "NOVA CORE OUTPUT",
      text: "hi dragon core online tel me baby",
      image: null as string | null,
    },
  ]);

  const [viewMode, setViewMode] = useState<"analyze" | "history">("analyze");
  const [imageSize, setImageSize] = useState("1K");
  const [imageRatio, setImageRatio] = useState("16:9");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>(null);
  const [chatModel, setChatModel] = useState("gemini");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modules = [
    { name: "Chat Core", icon: Bot },
    { name: "Image Forge", icon: ImageIcon },
    { name: "Temporal Video", icon: Video },
    { name: "Vision Node", icon: Eye },
    { name: "Live Core", icon: Radio },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Analysis copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy analysis.");
    });
  };

  const searchImage = (query: string) => {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    window.open(searchUrl, "_blank");
  };

  const speakAnalysisWithTTS = async (text: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/speech/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "Kore" })
      });

      if (!response.ok) {
        throw new Error("TTS generation failed");
      }

      const data = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audio.play();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "TTS failed");
    } finally {
      setBusy(false);
    }
  };

  const speakText = (text: string) => {
    if (!voiceOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/🜂|⚠|☍/g, ""));
    utter.lang = "ta-IN";
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SR();
    recognition.lang = "ta-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const runPrompt = async () => {
    if (!prompt.trim() || busy) return;
    const currentPrompt = prompt;
    setPrompt("");
    setBusy(true);

    setMessages((prev) => [
      ...prev,
      { role: "master", title: "MASTER INPUT", text: currentPrompt, image: null },
    ]);

    try {
      if (activeModule === "Image Forge") {
        const response = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.GEMINI_API_KEY ? { "x-goog-api-key": process.env.GEMINI_API_KEY } : {})
          },
          body: JSON.stringify({
            prompt: currentPrompt,
            size: imageSize,
            ratio: imageRatio
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Image generation failed");
        }
        const data = await response.json();
        
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            title: "IMAGE FORGE OUTPUT",
            text: "Image generated successfully.",
            image: data.images[0]
          },
        ]);
        speakText("Image generated successfully.");
      } else if (activeModule === "Vision Node") {
        if (!selectedImage || !selectedMimeType) {
          toast.error("Please select an image first.");
          return;
        }
        const response = await fetch("/api/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: selectedImage.split(",")[1],
            mimeType: selectedMimeType,
            prompt: currentPrompt
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Vision analysis failed");
        }
        const data = await response.json();
        const result = data.data;
        
        const objectsText = result.objectsDetected?.map((o: any) => `• ${o.label} (${(o.confidence * 100).toFixed(0)}%)`).join("\n");
        const ocrText = result.formattedOcrText || result.ocrText;
        const text = `Scene: ${result.sceneDescription}\n\nObjects:\n${objectsText}\n\nOCR:\n${ocrText}`;
        
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            title: "VISION NODE OUTPUT",
            text: text,
            image: selectedImage
          },
        ]);
        setSelectedImage(null);
        setSelectedMimeType(null);
        speakText("Vision analysis complete.");
      } else {
        // Default Chat
        const history = messages.map(m => ({ role: m.role === "master" ? "user" : "assistant", content: m.text }));
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: chatModel,
            prompt: currentPrompt,
            history: history.slice(-10),
            options: {
              systemInstruction: "You are Nova, an advanced scientific AI inside Universal Dragon OS. Reply in simple Tamil. Be helpful and intelligent.",
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Chat failed");
        }
        const data = await response.json();
        
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            title: "NOVA CORE OUTPUT",
            text: data.reply,
            image: null
          },
        ]);
        speakText(data.reply);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "An error occurred during processing.";
      toast.error(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          title: "SYSTEM ERROR",
          text: errorMessage,
          image: null
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <Toaster theme="dark" position="top-center" />
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[52vh] overflow-hidden border-b border-cyan-400/10 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="absolute inset-0">
            <Scene active={busy || voiceOn} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,234,255,0.12),transparent_25%),radial-gradient(circle_at_bottom,rgba(124,77,255,0.18),transparent_24%)]" />

          <div className="absolute left-4 top-4 right-4 flex items-start justify-between gap-4">
            <div className="rounded-3xl border border-cyan-300/20 bg-black/30 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10">
                  <Bot className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <div className="text-xl font-black tracking-wide text-cyan-100">NOVA SCIENTIFIC CORE</div>
                  <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">Nova Core • Logic Engine</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl hidden sm:block">
              <div className="flex items-center gap-2">
                <Chip active>GEMINI</Chip>
                <Chip>OPENAI</Chip>
                <Chip>DRAGON</Chip>
                <Chip active>NOVA</Chip>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 hidden sm:block">
            <div className="rounded-[28px] border border-cyan-300/20 bg-black/35 p-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,234,255,0.12)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">2050 Interface</div>
                  <div className="mt-1 text-2xl font-black text-white">Live Tron Grid Background</div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  Core Stable
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                <Chip active>Cosmic</Chip>
                <Chip>Default</Chip>
                <Chip active={voiceOn}>Voice</Chip>
                <Chip>Vision</Chip>
                <Chip>Neon UI</Chip>
                <Chip>Matrix Flow</Chip>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#071327,#050a16)]">
          <div className="border-b border-cyan-300/10 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/65">Universal Dragon</div>
                <div className="mt-1 text-3xl font-black tracking-wide text-white">MASTER CONSOLE</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300"><Settings className="h-5 w-5" /></button>
                <button
                  onClick={() => setVoiceOn((v) => !v)}
                  className={`rounded-2xl border p-3 ${voiceOn ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-white/5 text-zinc-300"}`}
                >
                  {voiceOn ? <Mic className="h-5 w-5" /> : <Mic className="h-5 w-5 opacity-50" />}
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-cyan-300/10 px-4 py-4 sm:px-6 overflow-x-auto custom-scrollbar">
            <div className="flex gap-3 min-w-max">
              {modules.map((item) => {
                const Icon = item.icon;
                const selected = activeModule === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveModule(item.name)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-auto px-4 py-4 sm:px-6 custom-scrollbar">
            {activeModule === "Chat Core" && (
              <div className="mb-4 rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(0,234,255,0.08),rgba(124,77,255,0.08))] p-5 shadow-[0_0_35px_rgba(0,140,255,0.1)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-zinc-300">Select Model:</div>
                  <select 
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 outline-none"
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>
              </div>
            )}

            {activeModule === "Image Forge" && (
              <div className="mb-4 rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(0,234,255,0.08),rgba(124,77,255,0.08))] p-5 shadow-[0_0_35px_rgba(0,140,255,0.1)]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-wide text-cyan-100">{activeModule.toUpperCase()}</div>
                    <div className="text-sm text-zinc-300">
                      Generate high-fidelity cosmic visuals using your AI pipeline.
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <select 
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-200 outline-none"
                  >
                    <option value="1K">1K (Standard)</option>
                    <option value="2K">2K</option>
                    <option value="4K">4K</option>
                  </select>
                  <select 
                    value={imageRatio}
                    onChange={(e) => setImageRatio(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-200 outline-none"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Wide</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                </div>
              </div>
            )}

            {activeModule === "Vision Node" && (
              <div className="mb-4 rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(0,234,255,0.08),rgba(124,77,255,0.08))] p-5 shadow-[0_0_35px_rgba(0,140,255,0.1)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-3xl font-black tracking-wide text-cyan-100">{activeModule.toUpperCase()}</div>
                      <div className="text-sm text-zinc-300">
                        Upload an image for analysis or view history.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewMode("analyze")} className={`px-3 py-1 rounded-full text-xs font-bold ${viewMode === "analyze" ? "bg-cyan-400 text-black" : "bg-white/10 text-white"}`}>Analyze</button>
                    <button onClick={() => setViewMode("history")} className={`px-3 py-1 rounded-full text-xs font-bold ${viewMode === "history" ? "bg-cyan-400 text-black" : "bg-white/10 text-white"}`}>History</button>
                  </div>
                </div>
                {viewMode === "analyze" && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSelectedImage(reader.result as string);
                            setSelectedMimeType(file.type);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-200 outline-none hover:bg-white/10"
                    >
                      {selectedImage ? "Change Image" : "Select Image"}
                    </button>
                    {selectedImage && (
                      <div className="mt-4">
                        <img
                          src={selectedImage}
                          alt="Selected preview"
                          className="h-32 w-32 rounded-xl border border-white/10 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </>
                )}
                {viewMode === "history" && (
                  <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    {messages.filter(m => m.title === "VISION NODE OUTPUT").length === 0 && <p className="text-zinc-500 text-sm">No analysis history.</p>}
                    {messages.filter(m => m.title === "VISION NODE OUTPUT").map((msg, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                        {msg.text.substring(0, 50)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-[24px] border p-4 ${
                    msg.role === "system"
                      ? "border-cyan-300/20 bg-cyan-400/5"
                      : "ml-auto border-fuchsia-300/20 bg-fuchsia-400/10"
                  } max-w-[92%]`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-zinc-400">
                    {msg.role === "system" ? <Cpu className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    {msg.title}
                  </div>
                  <div className="text-lg leading-8 text-white whitespace-pre-wrap">{msg.text}</div>
                  {msg.title === "VISION NODE OUTPUT" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => speakAnalysisWithTTS(msg.text)}
                        className="mt-3 flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
                      >
                        <Mic className="h-3 w-3" />
                        Speak Analysis
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.text)}
                        className="mt-3 flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
                      >
                        <Copy className="h-3 w-3" />
                        Share
                      </button>
                      <button
                        onClick={() => searchImage(msg.text)}
                        className="mt-3 flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/20"
                      >
                        <Search className="h-3 w-3" />
                        Search Image
                      </button>
                    </div>
                  )}
                  {msg.image && (
                    <img src={msg.image} alt="Generated" className="mt-4 rounded-xl border border-white/10 max-w-full h-auto" />
                  )}
                </div>
              ))}
              {busy && (
                <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-400/5 p-4 max-w-[92%]">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-zinc-400 mb-2">
                    <Cpu className="h-4 w-4 animate-pulse" />
                    PROCESSING...
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="border-t border-cyan-300/10 px-4 py-4 sm:px-6">
            <div className="flex gap-3">
              <button 
                onClick={startListening}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors ${
                  listening ? "border-red-400/50 bg-red-400/20 text-red-400" : "border-white/10 bg-white/5 text-zinc-200"
                }`}
              >
                <Mic className={`h-5 w-5 ${listening ? "animate-pulse" : ""}`} />
              </button>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    runPrompt();
                  }
                }}
                className="flex-1 rounded-2xl border border-cyan-300/15 bg-white/5 px-4 text-white outline-none placeholder:text-zinc-500"
                placeholder={activeModule === "Image Forge" ? "Describe the image to forge..." : activeModule === "Vision Node" ? "Ask a question about the image..." : "Type to Dragon Core…"}
                disabled={busy}
              />
              <button
                onClick={runPrompt}
                disabled={busy || !prompt.trim()}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-300 text-slate-900 shadow-[0_0_25px_rgba(253,224,71,0.25)] disabled:opacity-50 disabled:shadow-none transition hover:scale-[1.01]"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
