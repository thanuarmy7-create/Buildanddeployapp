import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MessageSquareText,
  AlertTriangle,
  TrafficCone,
  Trash2,
  BarChart3,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/chatbot", label: "AI Assistant", icon: MessageSquareText },
  { path: "/complaints", label: "Complaints", icon: AlertTriangle },
  { path: "/traffic", label: "Traffic Monitor", icon: TrafficCone },
  { path: "/waste", label: "Waste Management", icon: Trash2 },
  { path: "/analytics", label: "Predictive Analytics", icon: BarChart3 },
];

const adminItems = [
  { path: "/admin", label: "Admin Panel", icon: ShieldCheck },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const allNavItems = user?.role === "admin" ? [...navItems, ...adminItems] : navItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-tight">SmartCity</div>
          <div className="text-cyan-400 text-xs">Management Hub</div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{user?.name}</div>
            <div className="flex items-center gap-1">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${user?.role === "admin" ? "bg-yellow-400" : "bg-green-400"}`}
              />
              <span className="text-xs capitalize" style={{ color: user?.role === "admin" ? "#facc15" : "#4ade80" }}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation</p>
        {allNavItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                active
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-cyan-400" : ""}`} />
              <span className="text-sm">{label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400" />}
              {path === "/admin" && (
                <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-md border border-yellow-500/30">
                  Admin
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-60 flex-shrink-0 ${
          isDark ? "bg-slate-900 border-r border-white/10" : "bg-slate-800 border-r border-slate-700"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-slate-900 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className={`flex items-center justify-between px-4 lg:px-6 py-3 border-b flex-shrink-0 ${
            isDark ? "bg-slate-900/80 border-white/10" : "bg-white border-slate-200"
          } backdrop-blur-md`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                {allNavItems.find((n) => n.path === location.pathname)?.label || "SmartCity"}
              </h1>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
