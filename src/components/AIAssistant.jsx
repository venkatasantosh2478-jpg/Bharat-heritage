import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Mic, Loader2, Cpu, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

const AVAILABLE_MODELS = [
  { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", tag: "Ultra Fast · Default", desc: "Fastest response with great multilingual accuracy" },
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", tag: "Deep Reasoning", desc: "Best for complex questions & deep Telugu/regional nuance" },
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", tag: "Lightweight", desc: "Low latency edge-optimized model" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", tag: "Stable", desc: "Reliable production model" },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("by-selected-ai-model") || "gemini-3.8-flash";
  });
  const [showModelPicker, setShowModelPicker] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaskaram & Namaste! 🙏 I am your Bharat Yatra AI Heritage Guide.\n\nAsk me anything in English, Telugu in English (Teluglish), authentic Telugu (తెలుగు), Hindi, or any Indian regional language!",
    },
  ]);
  const recRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("by-selected-ai-model", selectedModel);
  }, [selectedModel]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    const userMsg = { role: "user", text: q };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setBusy(true);

    try {
      let answer = "";
      try {
        const response = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: q,
            model: selectedModel,
            messages: updatedMessages.slice(-8),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.response) {
            answer = data.response;
          }
        }
      } catch {
        // Fallback to client-side base44 invocation if available
      }

      if (!answer) {
        try {
          const res = await base44.integrations?.Core?.InvokeLLM({
            prompt: `You are the official Bharat Yatra AI guide. Answer warmly for a tourist. If user asked in Telugu in English (Teluglish), reply in natural Teluglish and Telugu: ${q}`,
          });
          answer = typeof res === "string" ? res : res?.response || "";
        } catch {
          // Handled below
        }
      }

      const cleanAnswer = String(
        answer ||
          `Namaskaram! 🙏 Regarding "${q}": India has incredible heritage, sacred temples, living traditions, and world-class monuments. You can explore interactive 3D maps, cultural itineraries, and verified guides in Bharat Yatra!`
      )
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .trim();

      setMessages((m) => [...m, { role: "assistant", text: cleanAnswer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Namaskaram! 🙏 Regarding "${q}": You can explore curated heritage sites, cultural events, and verified guides in the menu. Feel free to ask about any specific temple, fort, or city in Telugu or English!`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const [interimVoice, setInterimVoice] = useState("");
  const [voiceNotice, setVoiceNotice] = useState("");

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceNotice("Speech Recognition is not supported in this browser.");
      setTimeout(() => setVoiceNotice(""), 3500);
      return;
    }

    if (listening) {
      if (recRef.current) {
        try {
          recRef.current.stop();
        } catch {}
      }
      setListening(false);
      setInterimVoice("");
      return;
    }

    setVoiceNotice("");
    setInterimVoice("");

    try {
      const rec = new SR();
      rec.lang = "en-IN";
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setListening(true);
      };

      rec.onresult = (e) => {
        let interim = "";
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimVoice(interim);
        }

        if (final) {
          const clean = final.trim();
          setInterimVoice("");
          setInput(clean);
          setListening(false);
          send(clean);
        }
      };

      rec.onerror = (e) => {
        setListening(false);
        setInterimVoice("");
        if (e.error === "not-allowed") {
          setVoiceNotice("Microphone permission denied.");
        } else {
          setVoiceNotice(`Voice error: ${e.error || "Please try again"}`);
        }
        setTimeout(() => setVoiceNotice(""), 3500);
      };

      rec.onend = () => {
        setListening(false);
      };

      recRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      setVoiceNotice("Could not access microphone.");
      setTimeout(() => setVoiceNotice(""), 3500);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 md:bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-xl hover:scale-105 transition-transform"
        aria-label="AI assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-36 md:bottom-24 right-5 z-50 w-[92vw] max-w-sm glass rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header with Model Selector */}
          <div className="px-4 py-2.5 border-b border-border bg-card/90 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Gemini Heritage Guide</span>
              </div>
              
              {/* Model Switch Button */}
              <button
                type="button"
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Click to switch AI Model"
              >
                <Cpu className="w-3 h-3" />
                <span>{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name.replace("Gemini ", "") || "3.8 Flash"}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </div>

            {/* Model Dropdown Menu */}
            {showModelPicker && (
              <div className="p-2 rounded-xl bg-background border border-border shadow-lg space-y-1 mt-1 text-left animate-in slide-in-from-top-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1.5 pb-1">
                  Select AI Reasoning Model
                </div>
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id);
                      setShowModelPicker(false);
                    }}
                    className={`w-full p-1.5 rounded-lg text-left transition-all flex items-start justify-between gap-2 ${
                      selectedModel === m.id
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{m.name}</div>
                      <div className={`text-[10px] ${selectedModel === m.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {m.desc}
                      </div>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0 ${
                      selectedModel === m.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {m.tag.split("·")[0].trim()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Telugu & Multilingual Language Suggestions */}
          <div className="px-3 py-1.5 bg-muted/40 border-b border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider shrink-0">Try:</span>
            <button
              onClick={() => send("Tirupati lo darshanam ela cheyali? Telugu lo cheppandi")}
              className="px-2 py-0.5 rounded-full bg-card border border-border hover:border-primary text-foreground shrink-0 text-[10px] transition-colors"
            >
              🇮🇳 Tirupati guide (Teluglish)
            </button>
            <button
              onClick={() => send("తెలంగాణ మరియు ఆంధ్రప్రదేశ్ ముఖ్యమైన దేవాలయాలు చెప్పండి")}
              className="px-2 py-0.5 rounded-full bg-card border border-border hover:border-primary text-foreground shrink-0 text-[10px] transition-colors"
            >
              తెలుగు దేవాలయాలు
            </button>
            <button
              onClick={() => send("Lepakshi temple history and mystery")}
              className="px-2 py-0.5 rounded-full bg-card border border-border hover:border-primary text-foreground shrink-0 text-[10px] transition-colors"
            >
              Lepakshi mystery
            </button>
          </div>

          <div className="h-64 overflow-y-auto p-3 space-y-2.5 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {selectedModel.includes("pro") ? "Gemini Pro Deep Reasoning…" : "Gemini Thinking…"}
              </div>
            )}
          </div>

          {/* Voice Waveform Live Indicator */}
          {listening && (
            <div className="px-3 py-2 bg-primary/10 border-t border-primary/30 flex items-center justify-between gap-2 text-xs text-primary font-medium animate-pulse">
              <div className="flex items-center gap-2 truncate">
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="truncate">{interimVoice ? `"${interimVoice}"` : "Listening... ask any heritage question"}</span>
              </div>
              <button
                onClick={toggleVoice}
                className="text-[10px] uppercase font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full hover:bg-destructive/20"
              >
                Stop
              </button>
            </div>
          )}

          {voiceNotice && (
            <div className="px-3 py-1.5 bg-destructive/10 border-t border-destructive/20 text-destructive text-[11px] flex items-center gap-1">
              <span>{voiceNotice}</span>
            </div>
          )}

          <div className="p-2.5 border-t border-border flex items-center gap-2 bg-card">
            <button
              onClick={toggleVoice}
              className={`w-9 h-9 grid place-items-center rounded-full shrink-0 transition-all ${
                listening ? "bg-red-500 text-white animate-pulse ring-2 ring-red-400" : "bg-muted text-foreground hover:text-primary"
              }`}
              title={listening ? "Listening... click to stop" : "Ask with microphone (Voice-to-Text)"}
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about temples, crafts, history…"
              className="flex-1 bg-transparent text-sm outline-none px-1 text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => send()}
              disabled={busy || (!input.trim() && !listening)}
              className="w-9 h-9 grid place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}