import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Bell,
  MapPin,
  Clock,
  Leaf,
  Recycle,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { wasteBins, wasteCollectionWeekly, WasteBin } from "../data/mockData";

const WASTE_IMG = "https://images.unsplash.com/photo-1758547343136-19d27f9cb57f?w=1080&q=80";

const typeIcons: Record<WasteBin["type"], React.ReactNode> = {
  General: <Trash2 className="w-3.5 h-3.5" />,
  Recyclable: <Recycle className="w-3.5 h-3.5" />,
  Organic: <Leaf className="w-3.5 h-3.5" />,
};

const typeColors: Record<WasteBin["type"], string> = {
  General: "#64748b",
  Recyclable: "#06b6d4",
  Organic: "#22c55e",
};

function getBinStatus(level: number): { label: string; color: string; bg: string; barColor: string } {
  if (level >= 90) return { label: "Critical", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", barColor: "#ef4444" };
  if (level >= 70) return { label: "High", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30", barColor: "#f97316" };
  if (level >= 40) return { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30", barColor: "#eab308" };
  return { label: "Low", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30", barColor: "#22c55e" };
}

const pieTypeData = [
  { name: "General", value: 4, color: "#64748b" },
  { name: "Recyclable", value: 2, color: "#06b6d4" },
  { name: "Organic", value: 2, color: "#22c55e" },
];

export default function WastePage() {
  const { isDark } = useTheme();
  const [bins, setBins] = useState(wasteBins);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<WasteBin["type"] | "All">("All");

  // Simulate IoT updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((b) => ({
          ...b,
          fillLevel: Math.max(0, Math.min(100, b.fillLevel + (Math.random() - 0.3) * 5)),
        }))
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setBins((prev) => prev.map((b) => ({ ...b, fillLevel: Math.max(0, Math.min(100, b.fillLevel + (Math.random() - 0.3) * 10)) })));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const filtered = filter === "All" ? bins : bins.filter((b) => b.type === filter);
  const criticalBins = bins.filter((b) => b.fillLevel >= 90);
  const avgFill = Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length);

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${textColor}`}>Smart Waste Management</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <p className="text-xs text-slate-500">IoT Sensors Active · {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Alerts Banner */}
      {criticalBins.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <Bell className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-red-400">⚠️ {criticalBins.length} bin{criticalBins.length > 1 ? "s" : ""} require immediate attention!</p>
            <p className="text-xs text-slate-500 mt-0.5">{criticalBins.map((b) => b.location).join(" · ")}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Bins", value: bins.length, icon: Package, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
          { label: "Critical Full", value: criticalBins.length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "Avg Fill Level", value: `${avgFill}%`, icon: Trash2, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
          { label: "Collections Today", value: "14", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-2xl p-4 border ${cardBg}`}>
            <div className={`inline-flex p-2 rounded-xl border ${bg} mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["All", "General", "Recyclable", "Organic"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              filter === t
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                : isDark ? "border-white/10 text-slate-400 hover:border-white/20" : "border-slate-200 text-slate-500"
            }`}
          >
            {t !== "All" && typeIcons[t as WasteBin["type"]]}
            {t}
          </button>
        ))}
      </div>

      {/* Bin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((bin) => {
          const st = getBinStatus(bin.fillLevel);
          return (
            <div key={bin.id} className={`rounded-2xl p-4 border ${cardBg} ${bin.fillLevel >= 90 ? "ring-1 ring-red-500/30" : ""}`}>
              {/* Bin Visual */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-slate-500">{bin.id}</span>
                  <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${typeColors[bin.type] ? "" : ""}`} style={{ color: typeColors[bin.type] }}>
                    {typeIcons[bin.type]}
                    {bin.type}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
              </div>

              {/* Fill Level Visual */}
              <div className="flex justify-center mb-3">
                <div className={`relative w-12 h-16 rounded-b-lg rounded-t-sm border-2 overflow-hidden ${isDark ? "border-white/20" : "border-slate-300"}`}>
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-1000 rounded-b-sm"
                    style={{ height: `${bin.fillLevel}%`, background: st.barColor, opacity: 0.7 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${bin.fillLevel > 50 ? "text-white" : textColor}`}>
                      {Math.round(bin.fillLevel)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{bin.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Emptied: {bin.lastEmptied}</span>
                </div>
              </div>

              {bin.fillLevel >= 90 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400 animate-pulse">
                  <Bell className="w-3 h-3" /> Collection Required!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Collection */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border ${cardBg}`}>
          <h3 className={`text-sm font-semibold ${textColor} mb-1`}>Weekly Collection Data</h3>
          <p className={`text-xs ${subText} mb-4`}>Total vs Recycled (tonnes)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={wasteCollectionWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="collected" fill="#64748b" name="Collected (t)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recycled" fill="#06b6d4" name="Recycled (t)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bin Type Distribution */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <h3 className={`text-sm font-semibold ${textColor} mb-1`}>Bin Types</h3>
          <p className={`text-xs ${subText} mb-4`}>Distribution across city</p>
          <div className="flex justify-center">
            <PieChart width={130} height={130}>
              <Pie data={pieTypeData} cx={60} cy={60} innerRadius={35} outerRadius={58} paddingAngle={4} dataKey="value">
                {pieTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {pieTypeData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className={`text-xs ${subText}`}>{name}</span>
                </div>
                <span className={`text-xs font-medium ${textColor}`}>{value} bins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
