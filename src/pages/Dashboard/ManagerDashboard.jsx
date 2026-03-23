import React, { useState } from "react";
import { useManagerDashboard } from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "./ManagerDashboard.module.css";

const ManagerDashboard = () => {
  const { data, loading, error } = useManagerDashboard();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate manager-specific metrics
  const activeProjects = data?.recentProjects?.filter(p => p.status === 'active')?.length || 0;
  const completionRate = data?.stats?.totalTasks > 0 
    ? Math.round((data.stats.completedTasks / data.stats.totalTasks) * 100) 
    : 0;

  // Team performance timeline
  const teamTimeline = [
    { title: "Team Standup", date: "Daily 9AM", status: "completed" },
    { title: "Sprint Planning", date: "Oct 20", status: "completed" },
    { title: "Performance Review", date: "Oct 30", status: "upcoming" }
  ];

  // Filter projects based on search
  const filteredProjects = data?.recentProjects?.filter(project => 
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewProject = (projectId) => {
    console.log("🔍 Navigating to project details:", projectId);
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    console.log("➕ Opening create project modal");
    navigate("/projects/create");
  };

  if (loading) {
    return (
      <div className={styles['manager-dashboard']}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['manager-dashboard']}>
        <div className={styles.error}>
          <p>Error loading dashboard: {error}</p>
          
          {/* Check if this is a backend syntax error */}
          {(error?.includes('500') || error?.includes('Internal Server Error')) ? (
            <div className={styles['backend-error-info']}>
              <h3>🚨 Backend Database Error Detected</h3>
              <div className={styles['error-details']}>
                <p><strong>Issue:</strong> Backend is using incorrect database syntax</p>
                <div className={styles['code-fix']}>
                  <h4>🔧 Required Backend Fixes:</h4>
                  <div className={styles['code-block']}>
                    <p><strong>❌ WRONG (Current):</strong></p>
                    <pre>{`Project.count()
                        Task.count()
                        Project.find()
                        Task.find()`}</pre>
                    
                    <p><strong>✅ CORRECT (PostgreSQL/Sequelize):</strong></p>
                    <pre>{`Project.count({ where: { manager: managerId } })
                      Task.count({ where: { projectId: projectId } })
                      Project.findAll({ where: { manager: managerId } })
                      Task.findAll({ where: { projectId: projectId } })`}</pre>
                  </div>
                </div>
                
                <div className={styles['endpoints-to-fix']}>
                  <h4>📍 Endpoints That Need Fixing:</h4>
                  <ul>
                    <li><code>GET /api/v1/dashboard/manager</code></li>
                    <li><code>GET /api/v1/projects/manager/:id</code></li>
                    <li><code>GET /api/v1/tasks/project/:id</code></li>
                  </ul>
                </div>
                
                <div className={styles['next-steps']}>
                  <h4>📋 Next Steps:</h4>
                  <ol>
                    <li>Open backend dashboard controller</li>
                    <li>Replace count() with count( where: ... )</li>
                    <li>Replace find() with findAll( where: ... )</li>
                    <li>Test endpoints</li>
                    <li>Restart backend server</li>
                  </ol>
                </div>
              </div>
              
              <button onClick={() => window.location.reload()} className={styles['retry-btn']}>
                🔄 Retry After Backend Fix
              </button>
            </div>
          ) : (
            <div>
              <small style={{color: '#dc2626', display: 'block', marginTop: '1rem'}}>
                💡 Check browser console for more details
              </small>
              <button onClick={() => window.location.reload()} className={styles['error-btn']}>Retry</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles['manager-dashboard']}>
        <div className={styles['no-projects']}>
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  console.log("Rendering Manager Dashboard with data:", data);

  return (
    <div className={styles.managerDashboard}>
      {/* Enhanced Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>Manager Dashboard</h1>
          <p className={styles.dashboardSubtitle}>Managing {activeProjects} active projects with {completionRate}% completion rate</p>
        </div>
        <div className={styles.headerRight}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
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
                <div className={styles.dropdownHeader}>Notifications</div>
                <div className={styles.dropdownContent}>
                  <p className={styles.noNotifications}>No new notifications</p>
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
                <div className={styles.dropdownHeader}>Settings</div>
                <div className={styles.dropdownContent}>
                  <button className={styles.dropdownItem}>Team Settings</button>
                  <button className={styles.dropdownItem}>Project Preferences</button>
                  <button className={styles.dropdownItem}>Reports</button>
                </div>
              </div>
            )}
          </button>
          
          {/* User Profile */}
          <button className={styles.profileButton}>
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'M'}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.totalProjects}`}>
            📁
          </div>
          <div className={styles.statContent}>
            <h3>{data.stats?.totalProjects || 0}</h3>
            <p>Total Projects</p>
            <span className={styles.statChange}>+{activeProjects} active</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.totalTasks}`}>
            📋
          </div>
          <div className={styles.statContent}>
            <h3>{data.stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.greenCard}`}>
          <div className={`${styles.statIcon} ${styles.completedTasks}`}>
            ✅
          </div>
          <div className={styles.statContent}>
            <h3>{data.stats?.completedTasks || 0}</h3>
            <p>Completed Tasks</p>
            <span className={styles.statChange}>{completionRate}% rate</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.teamMembers}`}>
            👥
          </div>
          <div className={styles.statContent}>
            <h3>{data.stats?.teamMembers || 0}</h3>
            <p>Team Members</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.dashboardGrid}>
        {/* Left Column - Projects */}
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Projects</h2>
              <div className={styles.sectionActions}>
                <button 
                  className={styles.viewAllBtn}
                  onClick={() => navigate("/projects")}
                >
                  View All Projects
                </button>
                <button 
                  className={styles.createProjectBtn}
                  onClick={handleCreateProject}
                >
                  + New Project
                </button>
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className={styles.projectsList}>
                {filteredProjects.map((project) => (
                  <div key={project.id || project.project_id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectName}>{project.name}</h3>
                      <span className={`${styles.projectStatus} ${
                        project.status?.toLowerCase() === 'active' ? styles.activeStatus : 
                        project.status?.toLowerCase() === 'completed' ? styles.completedStatus : 
                        project.status?.toLowerCase() === 'pending' ? styles.pendingStatus : ''
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className={styles.projectDescription}>
                      {project.description || 'No description available'}
                    </p>
                    
                    <div className={styles.projectMeta}>
                      <span className={styles.projectDate}>
                        Created: {project.created_at 
                          ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'N/A'
                        }
                      </span>
                      <span className={styles.projectProgress}>
                        {project.task_count || 0} tasks
                      </span>
                    </div>
                    
                    <div className={styles.projectActions}>
                      <button 
                        className={styles.viewProjectBtn}
                        onClick={() => handleViewProject(project.id || project.project_id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>No projects found</h3>
                <p className={styles.emptyDescription}>
                  {searchQuery ? 'No projects match your search' : 'Start by creating your first project'}
                </p>
                <button 
                  className={styles.emptyAction}
                  onClick={() => navigate("/projects/create")}
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Team Timeline & Tips */}
        <div className={styles.rightColumn}>
          {/* Team Timeline */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Team Timeline</h2>
            <div className={styles.timeline}>
              {teamTimeline.map((item, index) => (
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

          {/* Manager Tips */}
          <div className={`${styles.section} ${styles.tipsCard}`}>
            <div className={styles.tipsHeader}>
              <h3 className={styles.tipsTitle}>Manager Tips</h3>
              <div className={styles.tipsIcon}>🎯</div>
            </div>
            <p className={styles.tipsContent}>
              Use <kbd className={styles.kbd}>CMD</kbd> + <kbd className={styles.kbd}>P</kbd> to quickly create new projects and assign team members.
            </p>
            <button className={styles.tipsButton}>
              View Team Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
};

export default ManagerDashboard;