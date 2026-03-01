import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Eye, EyeOff, Loader2, AlertCircle, UserCheck, ShieldCheck } from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("citizen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let success: boolean;
      if (mode === "login") {
        success = await login(email, password, role);
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        success = await signup(name, email, password, role);
      }
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try: citizen@smartcity.com or admin@smartcity.com");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const fillDemo = (demoRole: UserRole) => {
    setRole(demoRole);
    setEmail(demoRole === "admin" ? "admin@smartcity.com" : "citizen@smartcity.com");
    setPassword("password123");
    setMode("login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
          : "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)",
      }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/30 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>SmartCity Hub</h1>
          <p className="text-cyan-500 text-sm mt-1">AI-Powered City Management Platform</p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl p-6 border shadow-2xl ${
            isDark
              ? "bg-slate-900/80 border-white/10 backdrop-blur-xl"
              : "bg-white border-slate-200"
          }`}
        >
          {/* Mode Toggle */}
          <div className={`flex rounded-xl p-1 mb-6 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm transition-all capitalize ${
                  mode === m
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : isDark ? "text-slate-400 hover:text-white" : "text-slate-600"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Role Toggle */}
          <div className="flex gap-3 mb-5">
            {([
              { r: "citizen" as UserRole, label: "Citizen", Icon: UserCheck, color: "text-green-400", activeBg: "bg-green-500/20 border-green-500/40" },
              { r: "admin" as UserRole, label: "Admin", Icon: ShieldCheck, color: "text-yellow-400", activeBg: "bg-yellow-500/20 border-yellow-500/40" },
            ] as const).map(({ r, label, Icon, color, activeBg }) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm transition-all ${
                  role === r
                    ? `${activeBg} ${color}`
                    : isDark ? "border-white/10 text-slate-500 hover:border-white/20" : "border-slate-200 text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className={`block text-xs mb-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                    isDark
                      ? "bg-slate-800 border-white/10 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>
            )}
            <div>
              <label className={`block text-xs mb-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                  isDark
                    ? "bg-slate-800 border-white/10 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-cyan-500/40 pr-10 ${
                    isDark
                      ? "bg-slate-800 border-white/10 text-white placeholder-slate-500"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo buttons */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className={`text-center text-xs mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Quick Demo Access</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemo("citizen")}
                className="flex-1 py-2 rounded-xl text-xs border border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-all"
              >
                👤 Demo Citizen
              </button>
              <button
                onClick={() => fillDemo("admin")}
                className="flex-1 py-2 rounded-xl text-xs border border-yellow-500/30 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all"
              >
                🛡️ Demo Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
