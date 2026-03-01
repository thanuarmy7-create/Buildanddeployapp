import React, { useState } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Info,
  Sparkles,
  Car,
  Trash2,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { trafficPrediction, wastePrediction } from "../data/mockData";

const radarData = [
  { metric: "Traffic", current: 78, predicted: 83, optimal: 50 },
  { metric: "Waste", current: 72, predicted: 85, optimal: 60 },
  { metric: "Water", current: 65, predicted: 68, optimal: 70 },
  { metric: "Energy", current: 55, predicted: 60, optimal: 65 },
  { metric: "Safety", current: 82, predicted: 85, optimal: 90 },
  { metric: "Air Quality", current: 70, predicted: 73, optimal: 80 },
];

const anomalies = [
  { time: "Mar 4, 09:00", type: "Traffic", severity: "High", desc: "Predicted spike of +18% above normal on East Bridge — likely sports event at nearby stadium.", icon: Car, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { time: "Mar 7, 18:00", type: "Waste", severity: "Medium", desc: "Bin overflow risk at Market Square (98% predicted capacity). Schedule additional collection.", icon: Trash2, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { time: "Mar 8, All Day", type: "Traffic", severity: "Critical", desc: "Weekend traffic surge predicted at +22% citywide — recommend activating alternate routing protocols.", icon: Car, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
];

const insightCards = [
  { title: "Peak Traffic Hours", value: "7–9 AM & 5–7 PM", trend: "+12% vs last week", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", icon: Car },
  { title: "Waste Overflow Risk", value: "3 Zones", trend: "Friday–Sunday", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: Trash2 },
  { title: "AI Model Accuracy", value: "94.2%", trend: "Based on 30-day data", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: Brain },
  { title: "Predicted Savings", value: "$12,400", trend: "Next 30 days", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: TrendingUp },
];

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  const [activeModel, setActiveModel] = useState<"traffic" | "waste">("traffic");

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  const predData = activeModel === "traffic" ? trafficPrediction : wastePrediction;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className={`rounded-2xl p-5 border flex items-center gap-4 ${cardBg}`}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className={`text-sm font-semibold flex items-center gap-2 ${textColor}`}>
            Predictive Analytics Engine
            <span className="inline-flex items-center gap-1 text-xs bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
              <Sparkles className="w-2.5 h-2.5" /> AI-Powered
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${subText}`}>
            Machine learning models trained on 18 months of city data · Updated every 6 hours
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400">Models Active</span>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insightCards.map(({ title, value, trend, color, bg, icon: Icon }) => (
          <div key={title} className={`rounded-2xl p-4 border ${cardBg}`}>
            <div className={`inline-flex p-2 rounded-xl border ${bg} mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className={`text-xs mt-0.5 ${textColor}`}>{title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{trend}</div>
          </div>
        ))}
      </div>

      {/* Prediction Chart */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-sm font-semibold ${textColor}`}>
              {activeModel === "traffic" ? "Traffic Congestion" : "Waste Overflow"} Prediction
            </h3>
            <p className={`text-xs ${subText}`}>Actual vs AI Predicted — Next 10 Days (dotted = forecast)</p>
          </div>
          <div className="flex gap-2">
            {(["traffic", "waste"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveModel(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all capitalize ${
                  activeModel === m
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                    : isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"
                }`}
              >
                {m === "traffic" ? <Car className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
                {m}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={predData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[40, 100]} />
            <Tooltip
              contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
              formatter={(value: number | null, name: string) => [
                value !== null ? `${value}%` : "N/A",
                name === "actual" ? "Actual" : "AI Predicted",
              ]}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ fill: "#06b6d4", r: 4 }}
              connectNulls={false}
              name="actual"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ fill: "#a855f7", r: 3 }}
              name="predicted"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className={`flex items-center gap-2 mt-3 p-3 rounded-xl ${isDark ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-50 border border-purple-100"}`}>
          <Info className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <p className="text-xs text-purple-400">
            {activeModel === "traffic"
              ? "AI predicts a traffic surge on Mar 8 (weekend) — recommend pre-emptive route alerts."
              : "Waste levels predicted to peak mid-week — recommend scheduling extra Friday collections."}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* City Health Radar */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <h3 className={`text-sm font-semibold ${textColor} mb-1`}>City Health Radar</h3>
          <p className={`text-xs ${subText} mb-4`}>Current vs Predicted vs Optimal</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#64748b" }} />
              <Radar name="Current" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
              <Radar name="Predicted" dataKey="predicted" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeDasharray="4 2" />
              <Radar name="Optimal" dataKey="optimal" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Anomalies & Alerts */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h3 className={`text-sm font-semibold ${textColor}`}>AI-Detected Anomalies</h3>
          </div>
          <div className="space-y-3">
            {anomalies.map(({ time, type, severity, desc, icon: Icon, color, bg }, i) => (
              <div key={i} className={`p-3 rounded-xl border ${bg}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className={`text-xs font-medium ${color}`}>{type}</span>
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${bg} ${color} border`}>{severity}</span>
                </div>
                <p className={`text-xs ${subText} leading-snug mb-1`}>{desc}</p>
                <p className="text-xs text-slate-500">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-4`}>AI Model Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { model: "Traffic Prediction", accuracy: 94.2, mae: "3.8%", trained: "Feb 28, 2026" },
            { model: "Waste Overflow Prediction", accuracy: 91.7, mae: "4.5%", trained: "Feb 27, 2026" },
            { model: "Complaint Categorization", accuracy: 96.1, mae: "—", trained: "Mar 1, 2026" },
          ].map(({ model, accuracy, mae, trained }) => (
            <div key={model} className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span className={`text-xs font-medium ${textColor}`}>{model}</span>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Accuracy</span>
                  <span className="text-xs text-green-400 font-medium">{accuracy}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>MAE: {mae}</span>
                <span>{trained}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
