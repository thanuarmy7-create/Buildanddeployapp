import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  ThumbsUp,
  Upload,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Bot,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { complaints as initialComplaints, Complaint, ComplaintCategory, ComplaintStatus } from "../data/mockData";

const CATEGORIES: ComplaintCategory[] = ["Garbage", "Pothole", "Streetlight", "Water Leakage", "Noise", "Other"];

const categoryIcons: Record<ComplaintCategory, string> = {
  Garbage: "🗑️",
  Pothole: "🕳️",
  Streetlight: "💡",
  "Water Leakage": "💧",
  Noise: "🔊",
  Other: "📌",
};

// Mock AI categorization
async function aiCategorize(description: string): Promise<ComplaintCategory> {
  await new Promise((r) => setTimeout(r, 600));
  const d = description.toLowerCase();
  if (d.includes("garbage") || d.includes("trash") || d.includes("waste") || d.includes("litter")) return "Garbage";
  if (d.includes("pothole") || d.includes("road") || d.includes("crack") || d.includes("bump")) return "Pothole";
  if (d.includes("light") || d.includes("lamp") || d.includes("street light") || d.includes("dark")) return "Streetlight";
  if (d.includes("water") || d.includes("pipe") || d.includes("leak") || d.includes("flood")) return "Water Leakage";
  if (d.includes("noise") || d.includes("loud") || d.includes("sound")) return "Noise";
  return "Other";
}

const statusConfig: Record<ComplaintStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  Pending: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", icon: <AlertCircle className="w-3 h-3" /> },
  "In Progress": { color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30", icon: <Wrench className="w-3 h-3" /> },
  Resolved: { color: "text-green-400", bg: "bg-green-500/15 border-green-500/30", icon: <CheckCircle2 className="w-3 h-3" /> },
};

export default function ComplaintsPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState<ComplaintCategory | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // New Complaint Form
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState<ComplaintCategory | "">("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [aiCategory, setAiCategory] = useState<string>("");
  const [categorizing, setCategorizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = complaints.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchCat = filterCategory === "All" || c.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const handleDescBlur = async () => {
    if (formDesc.length < 10) return;
    setCategorizing(true);
    const cat = await aiCategorize(formDesc);
    setAiCategory(cat);
    setFormCategory(cat);
    setCategorizing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newComplaint: Complaint = {
      id: `C${String(complaints.length + 100).padStart(3, "0")}`,
      title: formTitle,
      description: formDesc,
      category: (formCategory as ComplaintCategory) || "Other",
      status: "Pending",
      location: formLocation,
      date: new Date().toISOString().split("T")[0],
      reportedBy: user?.name || "Anonymous",
      imageUrl: formImage || undefined,
      upvotes: 0,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setFormTitle(""); setFormDesc(""); setFormLocation(""); setFormCategory(""); setFormImage(null); setAiCategory("");
    }, 2000);
  };

  const upvote = (id: string) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c));
  };

  const cardBg = isDark ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200";
  const inputCls = isDark
    ? "bg-slate-800 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-400";

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Complaint System</h2>
          <p className="text-xs text-slate-500">{filtered.length} complaints found · AI-powered categorization</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {(["Pending", "In Progress", "Resolved"] as ComplaintStatus[]).map((s) => {
          const count = complaints.filter((c) => c.status === s).length;
          const cfg = statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                filterStatus === s ? cfg.bg : cardBg
              } ${filterStatus === s ? cfg.color : isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              <span className="text-xs">{s}</span>
              <span className="text-lg font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border ${cardBg}`}>
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ComplaintCategory | "All")}
            className={`pl-9 pr-8 py-2 rounded-xl border text-sm outline-none appearance-none ${inputCls}`}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const cfg = statusConfig[c.status];
          return (
            <div
              key={c.id}
              onClick={() => setSelectedComplaint(c)}
              className={`rounded-2xl border p-4 cursor-pointer hover:border-cyan-500/30 transition-all ${cardBg}`}
            >
              <div className="flex items-start gap-3">
                {c.imageUrl && (
                  <img src={c.imageUrl} alt={c.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-xs text-slate-500 font-mono">{c.id}</span>
                      <h3 className={`text-sm font-medium leading-snug ${isDark ? "text-white" : "text-slate-800"}`}>{c.title}</h3>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon} {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.date}</span>
                    <span className={`px-2 py-0.5 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                      {categoryIcons[c.category]} {c.category}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); upvote(c.id); }}
                      className="flex items-center gap-1 hover:text-cyan-400 transition-colors ml-auto"
                    >
                      <ThumbsUp className="w-3 h-3" />{c.upvotes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`text-center py-12 rounded-2xl border ${cardBg}`}>
            <p className="text-slate-500 text-sm">No complaints match your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-slate-500">{selectedComplaint.id}</span>
                <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>{selectedComplaint.title}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedComplaint.imageUrl && (
              <img src={selectedComplaint.imageUrl} alt={selectedComplaint.title} className="w-full h-40 object-cover rounded-xl mb-4" />
            )}
            <p className={`text-sm mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{selectedComplaint.description}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: "Category", value: `${categoryIcons[selectedComplaint.category]} ${selectedComplaint.category}` },
                { label: "Status", value: selectedComplaint.status },
                { label: "Location", value: selectedComplaint.location },
                { label: "Date", value: selectedComplaint.date },
                { label: "Reported By", value: selectedComplaint.reportedBy },
                { label: "Upvotes", value: String(selectedComplaint.upvotes) },
              ].map(({ label, value }) => (
                <div key={label} className={`p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                  <div className="text-slate-500 mb-0.5">{label}</div>
                  <div className={isDark ? "text-white" : "text-slate-800"}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 max-h-[90vh] overflow-y-auto ${isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Report an Issue</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h4 className={`text-base font-semibold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>Complaint Submitted!</h4>
                <p className="text-xs text-slate-500">Your complaint has been registered and will be reviewed shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Title *</label>
                  <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required placeholder="Brief description of the issue" className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Description *</label>
                  <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} onBlur={handleDescBlur} required rows={3} placeholder="Describe the issue in detail..." className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none ${inputCls}`} />
                  {categorizing && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-cyan-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <Bot className="w-3 h-3" /> AI is categorizing your complaint...
                    </div>
                  )}
                  {aiCategory && !categorizing && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-green-400">
                      <Bot className="w-3 h-3" /> AI detected: <strong>{aiCategory}</strong>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as ComplaintCategory)} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{categoryIcons[c]} {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Location *</label>
                  <input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} required placeholder="Street address or landmark" className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Upload Image (Optional)</label>
                  <label className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isDark ? "border-white/10 hover:border-cyan-500/40" : "border-slate-200 hover:border-cyan-400"}`}>
                    {formImage ? (
                      <img src={formImage} alt="preview" className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-500" />
                        <span className="text-xs text-slate-500">Click to upload photo</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-60 shadow-lg shadow-cyan-500/20">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Complaint"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
