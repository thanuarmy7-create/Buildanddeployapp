import React, { useState, useEffect } from "react";
import {
  Car,
  AlertTriangle,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { trafficZones, trafficHourly, TrafficZone } from "../data/mockData";

const TRAFFIC_IMG = "https://images.unsplash.com/photo-1771433053081-458d46481c09?w=1080&q=80";

const statusColors: Record<TrafficZone["status"], string> = {
  Clear: "text-green-400",
  Moderate: "text-yellow-400",
  Heavy: "text-orange-400",
  Severe: "text-red-400",
};

const statusBg: Record<TrafficZone["status"], string> = {
  Clear: "bg-green-500/15 border-green-500/30",
  Moderate: "bg-yellow-500/15 border-yellow-500/30",
  Heavy: "bg-orange-500/15 border-orange-500/30",
  Severe: "bg-red-500/15 border-red-500/30",
};

const statusDot: Record<TrafficZone["status"], string> = {
  Clear: "bg-green-400",
  Moderate: "bg-yellow-400",
  Heavy: "bg-orange-400",
  Severe: "bg-red-400 animate-pulse",
};

export default function TrafficPage() {
  const { isDark } = useTheme();
  const [zones, setZones] = useState(trafficZones);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => ({
          ...z,
          density: Math.max(5, Math.min(100, z.density + (Math.random() - 0.5) * 10)),
          avgSpeed: Math.max(5, Math.min(100, z.avgSpeed + (Math.random() - 0.5) * 8)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        density: Math.max(5, Math.min(100, z.density + (Math.random() - 0.5) * 20)),
        avgSpeed: Math.max(5, Math.min(100, z.avgSpeed + (Math.random() - 0.5) * 15)),
      }))
    );
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const getZoneStatus = (density: number): TrafficZone["status"] => {
    if (density >= 85) return "Severe";
    if (density >= 65) return "Heavy";
    if (density >= 35) return "Moderate";
    return "Clear";
  };

  const radialData = zones.slice(0, 4).map((z) => ({
    name: z.name.split(" ")[0],
    value: Math.round(z.density),
    fill: z.density >= 85 ? "#ef4444" : z.density >= 65 ? "#f97316" : z.density >= 35 ? "#eab308" : "#22c55e",
  }));

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${textColor}`}>Live Traffic Monitor</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <p className="text-xs text-slate-500">
              Real-time data · Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Map Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-44"
        style={{ backgroundImage: `url(${TRAFFIC_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-2xl p-4 border ${isDark ? "bg-slate-900/80 border-white/20" : "bg-white/80 border-white/60"} backdrop-blur-md text-center`}>
            <p className="text-xs text-slate-400 mb-1">City Traffic Overview</p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-orange-400">{zones.filter((z) => getZoneStatus(z.density) === "Heavy" || getZoneStatus(z.density) === "Severe").length}</div>
                <div className="text-xs text-slate-500">Congested Zones</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-red-400">{zones.reduce((s, z) => s + z.incidents, 0)}</div>
                <div className="text-xs text-slate-500">Active Incidents</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-cyan-400">{Math.round(zones.reduce((s, z) => s + z.avgSpeed, 0) / zones.length)} km/h</div>
                <div className="text-xs text-slate-500">Avg Speed</div>
              </div>
            </div>
          </div>
        </div>
        {/* Zone dots overlay */}
        {[
          { x: "20%", y: "30%", label: "Downtown", status: zones[0].status },
          { x: "65%", y: "20%", label: "N. Highway", status: zones[1].status },
          { x: "80%", y: "60%", label: "E. Bridge", status: zones[2].status },
          { x: "15%", y: "70%", label: "W. Suburb", status: zones[3].status },
        ].map(({ x, y, label, status }) => (
          <div key={label} className="absolute flex flex-col items-center" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <div className={`w-3 h-3 rounded-full border-2 border-white ${statusDot[status as TrafficZone["status"]]}`} />
            <span className="text-white text-xs mt-1 bg-black/50 px-1.5 rounded-full hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.map((zone) => {
          const status = getZoneStatus(zone.density);
          return (
            <div key={zone.id} className={`rounded-2xl p-4 border ${cardBg}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`text-sm font-medium ${textColor}`}>{zone.name}</h3>
                  <p className="text-xs text-slate-500">{zone.incidents} incident{zone.incidents !== 1 ? "s" : ""}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBg[status]} ${statusColors[status]}`}>
                  {status}
                </span>
              </div>
              {/* Density Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Traffic Density</span>
                  <span className={`text-xs font-medium ${statusColors[status]}`}>{Math.round(zone.density)}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${zone.density}%`,
                      background:
                        zone.density >= 85 ? "#ef4444" :
                        zone.density >= 65 ? "#f97316" :
                        zone.density >= 35 ? "#eab308" :
                        "#22c55e",
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  <span>{Math.round(zone.avgSpeed)} km/h avg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Traffic */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className="mb-4">
            <h3 className={`text-sm font-semibold ${textColor}`}>Hourly Traffic Load</h3>
            <p className={`text-xs ${subText}`}>Today's traffic by zone</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trafficHourly}>
              <defs>
                {["downtown", "highway", "bridge"].map((key, i) => (
                  <linearGradient key={key} id={`g_${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={["#06b6d4", "#22c55e", "#f59e0b"][i]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={["#06b6d4", "#22c55e", "#f59e0b"][i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="downtown" stroke="#06b6d4" fill="url(#g_downtown)" strokeWidth={2} name="Downtown" />
              <Area type="monotone" dataKey="highway" stroke="#22c55e" fill="url(#g_highway)" strokeWidth={2} name="Highway" />
              <Area type="monotone" dataKey="bridge" stroke="#f59e0b" fill="url(#g_bridge)" strokeWidth={2} name="Bridge" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Comparison Bar */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className="mb-4">
            <h3 className={`text-sm font-semibold ${textColor}`}>Zone Comparison</h3>
            <p className={`text-xs ${subText}`}>Current density & avg speed</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zones.map((z) => ({ name: z.name.split(" ")[0], density: Math.round(z.density), speed: Math.round(z.avgSpeed) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="density" fill="#f59e0b" name="Density %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="speed" fill="#06b6d4" name="Speed km/h" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents Table */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-4`}>Active Traffic Incidents</h3>
        <div className="space-y-2">
          {zones.filter((z) => z.incidents > 0).map((z) => (
            <div key={z.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-white/3" : "bg-slate-50"}`}>
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${textColor}`}>{z.name}</p>
                <p className="text-xs text-slate-500">{z.incidents} reported incident{z.incidents !== 1 ? "s" : ""} · Avg speed: {Math.round(z.avgSpeed)} km/h</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBg[getZoneStatus(z.density)]} ${statusColors[getZoneStatus(z.density)]}`}>
                {getZoneStatus(z.density)}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Live</span>
              </div>
            </div>
          ))}
          {zones.every((z) => z.incidents === 0) && (
            <p className="text-center text-xs text-slate-500 py-4">No active incidents 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}