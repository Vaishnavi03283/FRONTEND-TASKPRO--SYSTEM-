import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "../../hooks/useAdmin";
import { AuthContext } from "../../context/AuthContext";
import styles from "./AdminDashboard.module.css";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate admin-specific metrics
  const systemHealth = stats?.systemHealth || 'Healthy';
  const activeUsers = stats?.totalUsers || 0;
  const systemUptime = '99.9%';
  const dataRetention = '30 days';

  // System timeline
  const systemTimeline = [
    { title: "System Backup", date: "Daily 2AM", status: "completed" },
    { title: "Security Scan", date: "Oct 25", status: "upcoming" },
    { title: "Performance Review", date: "Oct 30", status: "planned" }
  ];

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
    <div className={styles.adminDashboard}>
      {/* Enhanced Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          <p className={styles.dashboardSubtitle}>System Overview & Administrative Controls</p>
        </div>
        <div className={styles.headerRight}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users, projects, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          {/* Notifications */}
          <button 
            className={styles.iconButton}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {showNotifications && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>System Notifications</div>
                <div className={styles.dropdownContent}>
                  <p className={styles.noNotifications}>No system alerts</p>
                </div>
              </div>
            )}
          </button>
          
          {/* Settings */}
          <button 
            className={styles.iconButton}
            onClick={() => setShowSettings(!showSettings)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showSettings && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>Admin Settings</div>
                <div className={styles.dropdownContent}>
                  <button className={styles.dropdownItem}>System Configuration</button>
                  <button className={styles.dropdownItem}>User Management</button>
                  <button className={styles.dropdownItem}>Backup & Restore</button>
                  <button className={styles.dropdownItem}>Security Settings</button>
                </div>
              </div>
            )}
          </button>
          
          {/* Refresh Controls */}
          <div className={styles.refreshControls}>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
            >
              {loading ? "⟳" : "🔄"}
            </button>
            <label className={styles.autoRefreshToggle}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Auto</span>
            </label>
          </div>
          
          {/* User Profile */}
          <button className={styles.profileButton}>
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
          </button>
        </div>
      </div>
      
      {lastUpdated && (
        <div className={styles.lastUpdated}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => handleStatClick('users')}>
          <div className={`${styles.statIcon} ${styles.totalUsers}`}>
            👥
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
            <span className={styles.statChange}>+{activeUsers} active</span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => handleStatClick('projects')}>
          <div className={`${styles.statIcon} ${styles.activeProjects}`}>
            📁
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.activeProjects || 0}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => handleStatClick('tasks')}>
          <div className={`${styles.statIcon} ${styles.totalTasks}`}>
            📋
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.healthCard}`}>
          <div className={`${styles.statIcon} ${styles.systemHealth}`}>
            💚
          </div>
          <div className={styles.statContent}>
            <h3>{systemHealth}</h3>
            <p>System Health</p>
            <span className={styles.statChange}>{systemUptime} uptime</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.dashboardGrid}>
        {/* Left Column - System Overview */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>System Overview</h2>
              <button className={styles.viewAllBtn} onClick={() => navigate('/admin/users')}>
                View All Details
              </button>
            </div>
            
            <div className={styles.systemMetrics}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>System Uptime</div>
                <div className={styles.metricValue}>{systemUptime}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Data Retention</div>
                <div className={styles.metricValue}>{dataRetention}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Active Sessions</div>
                <div className={styles.metricValue}>{activeUsers}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Storage Used</div>
                <div className={styles.metricValue}>2.4 TB</div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.quickActions}>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/users')}>
                <span className={styles.actionIcon}>👥</span>
                <span className={styles.actionLabel}>Manage Users</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/projects')}>
                <span className={styles.actionIcon}>📁</span>
                <span className={styles.actionLabel}>View Projects</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/tasks')}>
                <span className={styles.actionIcon}>📋</span>
                <span className={styles.actionLabel}>Task Management</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/reports')}>
                <span className={styles.actionIcon}>📊</span>
                <span className={styles.actionLabel}>Generate Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - System Timeline & Tips */}
        <div className={styles.rightColumn}>
          {/* System Timeline */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Timeline</h2>
            <div className={styles.timeline}>
              {systemTimeline.map((item, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${styles[item.status]}`}></div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineTitle}>{item.title}</h4>
                    <p className={styles.timelineDate}>{item.date}</p>
                    <span className={`${styles.timelineStatus} ${styles[item.status]}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Tips */}
          <div className={`${styles.section} ${styles.tipsCard}`}>
            <div className={styles.tipsHeader}>
              <h3 className={styles.tipsTitle}>Admin Tips</h3>
              <div className={styles.tipsIcon}>🛡️</div>
            </div>
            <p className={styles.tipsContent}>
              Use <kbd className={styles.kbd}>CMD</kbd> + <kbd className={styles.kbd}>A</kbd> to quickly access admin controls and system settings.
            </p>
            <button className={styles.tipsButton}>
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;