import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  TrafficCone,
  Trash2,
  Droplets,
  Zap,
  CloudSun,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { aiChatResponses } from "../data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: TrafficCone, label: "Traffic Update", prompt: "What's the current traffic situation in the city?" },
  { icon: Trash2, label: "Waste Schedule", prompt: "When is the next waste collection in my area?" },
  { icon: Droplets, label: "Water Supply", prompt: "Any water supply issues or alerts today?" },
  { icon: Zap, label: "Power Status", prompt: "Are there any electricity outages or alerts?" },
  { icon: CloudSun, label: "City Weather", prompt: "What's the weather forecast for the city?" },
  { icon: AlertTriangle, label: "File Complaint", prompt: "How do I file a complaint about a city issue?" },
  { icon: Calendar, label: "City Schedule", prompt: "What city services are scheduled this week?" },
];

// Mock AI response generator — replace with real OpenAI API call
async function getMockAIResponse(message: string): Promise<string> {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 1200 + Math.random() * 800));

  const msg = message.toLowerCase();
  if (msg.includes("traffic") || msg.includes("road") || msg.includes("congestion") || msg.includes("drive")) {
    return aiChatResponses.traffic;
  }
  if (msg.includes("waste") || msg.includes("garbage") || msg.includes("bin") || msg.includes("collection") || msg.includes("trash")) {
    return aiChatResponses.waste;
  }
  if (msg.includes("water") || msg.includes("pipe") || msg.includes("supply") || msg.includes("leak")) {
    return aiChatResponses.water;
  }
  if (msg.includes("electric") || msg.includes("power") || msg.includes("outage") || msg.includes("light")) {
    return aiChatResponses.electricity;
  }
  if (msg.includes("weather") || msg.includes("rain") || msg.includes("temperature") || msg.includes("forecast")) {
    return aiChatResponses.weather;
  }
  if (msg.includes("complaint") || msg.includes("report") || msg.includes("issue") || msg.includes("problem")) {
    return aiChatResponses.complaint;
  }
  if (msg.includes("schedule") || msg.includes("when") || msg.includes("timing") || msg.includes("hours")) {
    return aiChatResponses.schedule;
  }
  // Generic smart response
  return `🤖 I've processed your query: **"${message}"**\n\nAs your Smart City AI Assistant, I can provide real-time insights on:\n- 🚦 **Traffic** conditions & routing\n- 🗑️ **Waste** collection schedules\n- 💧 **Water** supply & alerts\n- ⚡ **Power** grid status\n- 🌤️ **Weather** forecasts\n- 📋 **Complaint** filing & tracking\n\nTry asking more specifically about any of these services, and I'll provide detailed information from our city's sensor network!`;
}

function formatMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
    .replace(/\n/g, "<br />");
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: aiChatResponses.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await getMockAIResponse(text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ I'm experiencing connection issues with the city's data network. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ id: "welcome", role: "assistant", content: aiChatResponses.default, timestamp: new Date() }]);
  };

  const cardBg = isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200";
  const inputBg = isDark ? "bg-slate-800 border-white/10 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400";

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 gap-4">
      {/* Header */}
      <div className={`rounded-2xl p-4 border flex items-center justify-between flex-shrink-0 ${cardBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              CityAI Assistant
              <span className="inline-flex items-center gap-1 text-xs bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                <Sparkles className="w-2.5 h-2.5" /> GPT-4
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online · Powered by OpenAI
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto flex-shrink-0 pb-1">
        {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-50 ${
              isDark ? "bg-slate-900/60 border-white/10 text-slate-400" : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className={`flex-1 rounded-2xl border overflow-y-auto p-4 space-y-4 min-h-0 ${cardBg}`}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-white"
                  : "bg-gradient-to-br from-purple-400 to-pink-600 text-white"
              }`}
            >
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : user?.avatar}
            </div>
            {/* Bubble */}
            <div className={`max-w-[80%] group ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-sm"
                    : isDark
                    ? "bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5"
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                  className="text-xs leading-relaxed"
                />
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500" />
                    )}
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-500 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? "bg-slate-800 border border-white/5" : "bg-slate-100"}`}>
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-xs text-slate-400">CityAI is analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        className={`flex items-center gap-3 p-3 rounded-2xl border flex-shrink-0 ${cardBg}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about traffic, waste, water, weather, complaints..."
          disabled={loading}
          className={`flex-1 bg-transparent outline-none text-sm ${isDark ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"} disabled:opacity-50`}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/30 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-600 flex-shrink-0">
        🔒 Responses are AI-generated using city sensor data · Replace with live OpenAI API key for production
      </p>
    </div>
  );
}
