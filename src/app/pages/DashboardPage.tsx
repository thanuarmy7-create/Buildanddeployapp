import React from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Zap,
  Activity,
  Car,
  Trash2,
  Droplets,
  TrendingUp,
  TrendingDown,
  MessageSquareText,
  ChevronRight,
  Users,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { dashboardStats, trafficHourly, complaints } from "../data/mockData";

const SMART_CITY_BG = "https://images.unsplash.com/photo-1747499967281-c0c5eec9933c?w=1080&q=80";

const statCards = [
  {
    label: "Total Complaints",
    value: dashboardStats.totalComplaints,
    sub: "+12 this week",
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    trend: "up",
  },
  {
    label: "Resolved Today",
    value: dashboardStats.resolvedToday,
    sub: "↑ 8% from yesterday",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    trend: "up",
  },
  {
    label: "Active Alerts",
    value: dashboardStats.activeAlerts,
    sub: "2 critical",
    icon: Zap,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    trend: "down",
  },
  {
    label: "Citizens Satisfied",
    value: dashboardStats.citizensSatisfied,
    sub: "↑ 3% this month",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    trend: "up",
  },
];

const pieData = [
  { name: "Resolved", value: 142, color: "#22c55e" },
  { name: "In Progress", value: 68, color: "#f59e0b" },
  { name: "Pending", value: 38, color: "#ef4444" },
];

const recentActivity = [
  { icon: AlertTriangle, color: "text-orange-400", msg: "New complaint: Water leakage on Elm Street", time: "2 min ago" },
  { icon: CheckCircle2, color: "text-green-400", msg: "Complaint C006 resolved: Pothole on Highway 12", time: "15 min ago" },
  { icon: Trash2, color: "text-yellow-400", msg: "Bin alert: Market Square bin is 100% full", time: "32 min ago" },
  { icon: Car, color: "text-red-400", msg: "Severe congestion on East Bridge detected", time: "45 min ago" },
  { icon: Droplets, color: "text-blue-400", msg: "Water pressure normalized in West Suburb", time: "1 hr ago" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Hero Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-40 lg:h-52 flex items-end"
        style={{ backgroundImage: `url(${SMART_CITY_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        <div className="relative p-6">
          <p className="text-cyan-400 text-xs uppercase tracking-wider mb-1">Welcome back</p>
          <h2 className="text-white text-xl font-bold">{user?.name} 👋</h2>
          <p className="text-slate-300 text-sm mt-1">
            {user?.role === "admin"
              ? "You have 7 active alerts requiring attention."
              : "Your city is running. Here's today's overview."}
          </p>
        </div>
        {/* Live badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-xs">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg, trend }) => (
          <div key={label} className={`rounded-2xl p-4 border ${cardBg}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl border ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
            </div>
            <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
            <div className={`text-xs mt-0.5 ${subText}`}>{label}</div>
            <div className="text-xs text-slate-500 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Chart */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-semibold ${textColor}`}>Traffic Density Today</h3>
              <p className={`text-xs ${subText}`}>Hourly city-wide traffic load</p>
            </div>
            <Link to="/traffic" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trafficHourly}>
              <defs>
                <linearGradient id="downtown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                labelStyle={{ color: isDark ? "#94a3b8" : "#64748b" }}
              />
              <Area type="monotone" dataKey="downtown" stroke="#06b6d4" fill="url(#downtown)" strokeWidth={2} name="Downtown" />
              <Area type="monotone" dataKey="bridge" stroke="#f59e0b" fill="url(#bridge)" strokeWidth={2} name="Bridge" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints Pie */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-semibold ${textColor}`}>Complaint Status</h3>
              <p className={`text-xs ${subText}`}>Total: 248</p>
            </div>
          </div>
          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie data={pieData} cx={65} cy={65} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className={`text-xs ${subText}`}>{name}</span>
                </div>
                <span className={`text-xs font-medium ${textColor}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className={`rounded-2xl p-5 border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${textColor}`}>Recent Activity</h3>
            <span className="text-xs text-slate-500">Live updates</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map(({ icon: Icon, color, msg, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg bg-white/5 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${textColor} leading-snug`}>{msg}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats + Quick Actions */}
        <div className="space-y-4">
          {/* City Services Status */}
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textColor} mb-3`}>City Services Status</h3>
            {[
              { label: "Traffic Management", status: "Operational", ok: true },
              { label: "Waste Collection", status: "3 Bins Full", ok: false },
              { label: "Water Supply", status: "2 Alerts Active", ok: false },
              { label: "Street Lighting", status: "Operational", ok: true },
              { label: "Emergency Services", status: "Operational", ok: true },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
                  <span className={`text-xs ${subText}`}>{label}</span>
                </div>
                <span className={`text-xs ${ok ? "text-green-400" : "text-red-400"}`}>{status}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: "/chatbot", icon: MessageSquareText, label: "Ask AI", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                { to: "/complaints", icon: AlertTriangle, label: "File Complaint", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                { to: "/traffic", icon: Car, label: "Traffic Map", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { to: "/waste", icon: Trash2, label: "Waste Status", color: "text-green-400 bg-green-500/10 border-green-500/20" },
              ].map(({ to, icon: Icon, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-semibold ${textColor}`}>Recent Complaints</h3>
          <Link to="/complaints" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {complaints.slice(0, 4).map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-white/3 hover:bg-white/5" : "bg-slate-50 hover:bg-slate-100"} transition-colors`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${subText}`} />
                <div className="min-w-0">
                  <p className={`text-xs font-medium ${textColor} truncate`}>{c.title}</p>
                  <p className="text-xs text-slate-500 truncate">{c.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-500 hidden sm:block">{c.category}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.status === "Resolved"
                      ? "bg-green-500/15 text-green-400"
                      : c.status === "In Progress"
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
