import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  BarChart3,
  MapPin,
  ChevronDown,
  Save,
  X,
  TrendingUp,
  ThumbsUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { complaints as initialComplaints, Complaint, ComplaintStatus, ComplaintCategory } from "../data/mockData";
import { useNavigate } from "react-router";

const categoryStats = [
  { name: "Pothole", count: 68, resolved: 52 },
  { name: "Garbage", count: 54, resolved: 41 },
  { name: "Streetlight", count: 38, resolved: 29 },
  { name: "Water", count: 47, resolved: 31 },
  { name: "Noise", count: 22, resolved: 18 },
  { name: "Other", count: 19, resolved: 14 },
];

const CATEGORIES: ComplaintCategory[] = ["Garbage", "Pothole", "Streetlight", "Water Leakage", "Noise", "Other"];

export default function AdminPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState<ComplaintCategory | "All">("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("Pending");

  // Redirect non-admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchCat = filterCategory === "All" || c.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const updateStatus = (id: string) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    setEditingId(null);
  };

  const statusConfig = {
    Pending: { color: "text-red-400", bg: "bg-red-500/15", dot: "bg-red-400", icon: AlertCircle },
    "In Progress": { color: "text-yellow-400", bg: "bg-yellow-500/15", dot: "bg-yellow-400", icon: Clock },
    Resolved: { color: "text-green-400", bg: "bg-green-500/15", dot: "bg-green-400", icon: CheckCircle2 },
  };

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";
  const inputCls = isDark
    ? "bg-slate-800 border-white/10 text-white placeholder-slate-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400";

  const totalResolved = complaints.filter((c) => c.status === "Resolved").length;
  const totalPending = complaints.filter((c) => c.status === "Pending").length;
  const totalInProgress = complaints.filter((c) => c.status === "In Progress").length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Admin Header */}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border ${cardBg}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${textColor}`}>Admin Control Panel</h2>
          <p className={`text-xs ${subText}`}>Manage complaints, update statuses, and view analytics</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          <span className="text-xs text-yellow-400">Admin: {user?.name}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Complaints", value: complaints.length, icon: BarChart3, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
          { label: "Pending", value: totalPending, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "In Progress", value: totalInProgress, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
          { label: "Resolved", value: totalResolved, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
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

      {/* Analytics Chart */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-1`}>Complaints by Category</h3>
        <p className={`text-xs ${subText} mb-4`}>Filed vs Resolved breakdown</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={categoryStats}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }} />
            <Bar dataKey="count" fill="#f59e0b" name="Total" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border ${cardBg}`}>
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or reporter..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none ${inputCls}`}
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ComplaintStatus | "All")}
            className={`pl-3 pr-8 py-2 rounded-xl border text-sm outline-none appearance-none ${inputCls}`}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ComplaintCategory | "All")}
            className={`pl-3 pr-8 py-2 rounded-xl border text-sm outline-none appearance-none ${inputCls}`}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Complaints Table */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className={`px-5 py-3 border-b ${isDark ? "border-white/10" : "border-slate-100"} flex items-center justify-between`}>
          <h3 className={`text-sm font-semibold ${textColor}`}>All Complaints ({filtered.length})</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <TrendingUp className="w-3 h-3" />
            Resolution rate: {Math.round((totalResolved / complaints.length) * 100)}%
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`${isDark ? "bg-white/3" : "bg-slate-50"}`}>
                {["ID", "Title", "Category", "Location", "Reporter", "Upvotes", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-left font-medium ${subText} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const cfg = statusConfig[c.status];
                const StatusIcon = cfg.icon;
                const isEditing = editingId === c.id;

                return (
                  <tr
                    key={c.id}
                    className={`border-t ${isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50"} transition-colors`}
                  >
                    <td className="px-4 py-3 font-mono text-slate-500">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className={`font-medium ${textColor} max-w-[160px] truncate`}>{c.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-500 max-w-[120px]">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.reportedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-400">
                        <ThumbsUp className="w-3 h-3" />{c.upvotes}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                          className={`px-2 py-1 rounded-lg border text-xs outline-none ${inputCls}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                          <StatusIcon className="w-3 h-3" /> {c.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateStatus(c.id)}
                            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(c.id); setNewStatus(c.status); }}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg hover:bg-cyan-500/10 transition-all"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">No complaints match your filters.</div>
          )}
        </div>
      </div>

      {/* Admin Activity Log */}
      <div className={`rounded-2xl p-5 border ${cardBg}`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-4`}>Recent Admin Activity</h3>
        <div className="space-y-2">
          {[
            { action: "Updated complaint C006 → Resolved", admin: "Sarah Admin", time: "10 min ago" },
            { action: "Assigned complaint C004 to Water Dept.", admin: "Sarah Admin", time: "1 hr ago" },
            { action: "Sent notification to Zone-A waste team", admin: "Sarah Admin", time: "2 hrs ago" },
            { action: "Closed 3 duplicate noise complaints", admin: "Sarah Admin", time: "Yesterday" },
          ].map(({ action, admin, time }, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-white/3" : "bg-slate-50"}`}>
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${textColor}`}>{action}</p>
                <p className="text-xs text-slate-500">{admin} · {time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
