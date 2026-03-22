import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "../../hooks/useAdmin";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

/**
 * AdminDashboard Component
 * Renders real-time system statistics and health status.
 * Restricted to users with the 'ADMIN' role.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { stats, loading, error, refetch } = useAdminStats();
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 1. Role-Based Access Control (RBAC)
  // Ensures only Admins can view this page
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  // 2. Auto-Refresh Logic
  // Refetches data every 10 seconds if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh || loading) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing admin stats...');
      refetch();
    }, 10000); // Reduced to 10 seconds for more real-time updates

    return () => clearInterval(interval);
  }, [autoRefresh, refetch, loading]);

  // 3. Manual Refresh Handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 4. Navigation Handler for Stats Cards
  const handleStatClick = useCallback((statKey) => {
    const routes = {
      users: '/admin/users',
      projects: '/admin/projects', 
      tasks: '/admin/tasks',
      pending: '/admin/tasks?status=pending',
      completed: '/admin/tasks?status=completed'
    };
    
    const route = routes[statKey];
    if (route) {
      console.log(`Navigating to: ${route}`);
      navigate(route);
    }
  }, [navigate]);

  // 5. Timestamp Update
  useEffect(() => {
    if (stats && !loading) {
      setLastUpdated(new Date());
    }
  }, [stats, loading]);

  // --- RENDER STATES ---

  // Loading Skeleton
  if (loading && !stats) {
    return (
      <div className="admin-dashboard-loading">
        <div className="skeleton-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-icon"></div>
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="admin-dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={handleRefresh} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  // Stat Configuration
  const statCards = [
    { icon: "👥", label: "Total Users", value: stats?.totalUsers || 0, color: "#3b82f6", key: "users" },
    { icon: "📁", label: "Active Projects", value: stats?.activeProjects || 0, color: "#6366f1", key: "projects" },
    { icon: "📋", label: "Total Tasks", value: stats?.totalTasks || 0, color: "#8b5cf6", key: "tasks" },
    { icon: "⏳", label: "Pending Tasks", value: stats?.pendingTasks || 0, color: "#eab308", key: "pending" },
    { icon: "✅", label: "Completed Tasks", value: stats?.completedTasks || 0, color: "#22c55e", key: "completed" },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-content">
          <div className="header-text">
            <h1>Admin Dashboard</h1>
            <p>Overall System Statistics & Management</p>
          </div>
          <div className="header-controls">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`refresh-btn ${loading ? "anim-spin" : ""}`}
            >
              {loading ? "⟳" : "🔄"} Refresh
            </button>
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto-refresh (10s)</span>
            </label>
          </div>
        </div>
        </div>

        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </header>

      <div className="stats-grid">
        {statCards.map((card) => (
          <article
            key={card.key}
            className="stat-card"
            style={{ borderTop: `4px solid ${card.color}` }}
            onClick={() => handleStatClick(card.key)}
          >
            <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value.toLocaleString()}</div>
            <div className="stat-action">→ View Details</div>
          </article>
        ))}
      </div>

      <section className="system-health">
        <h3>System Health</h3>
        <div className={`health-status ${stats?.systemHealth?.toLowerCase() || "unknown"}`}>
          <div className="health-indicator"></div>
          <span>{stats?.systemHealth || "Unknown"}</span>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;