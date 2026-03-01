import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ChatbotPage from "./pages/ChatbotPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import TrafficPage from "./pages/TrafficPage";
import WastePage from "./pages/WastePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";

/**
 * Higher-order component that wraps a page with authentication check + Layout.
 * Redirects unauthenticated users to /login.
 */
function withLayout(Page: React.ComponentType) {
  return function ProtectedPage() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
      <Layout>
        <Page />
      </Layout>
    );
  };
}

const ProtectedDashboard = withLayout(DashboardPage);
const ProtectedChatbot = withLayout(ChatbotPage);
const ProtectedComplaints = withLayout(ComplaintsPage);
const ProtectedTraffic = withLayout(TrafficPage);
const ProtectedWaste = withLayout(WastePage);
const ProtectedAnalytics = withLayout(AnalyticsPage);
const ProtectedAdmin = withLayout(AdminPage);

export const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  // Protected routes
  { path: "/dashboard", element: <ProtectedDashboard /> },
  { path: "/chatbot", element: <ProtectedChatbot /> },
  { path: "/complaints", element: <ProtectedComplaints /> },
  { path: "/traffic", element: <ProtectedTraffic /> },
  { path: "/waste", element: <ProtectedWaste /> },
  { path: "/analytics", element: <ProtectedAnalytics /> },
  { path: "/admin", element: <ProtectedAdmin /> },

  // Catch-all
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
