import React from "react";
import { useManagerDashboard } from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerDashboard.module.css";

const ManagerDashboard = () => {
  const { data, loading, error } = useManagerDashboard();
  const navigate = useNavigate();

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
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className={styles['manager-dashboard']}>
      <h1 className={styles['dashboard-title']}>Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className={styles['stats-grid']}>
        <div className={styles['stat-card']}>
          <div className={`${styles['stat-icon']} ${styles['stat-icon-projects']}`}>
            📁
          </div>
          <div>
            <h3 className={styles['stat-content']}>{data.stats?.totalProjects || 0}</h3>
            <p className={styles['stat-content-label']}>Total Projects</p>
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={`${styles['stat-icon']} ${styles['stat-icon-tasks']}`}>
            ✅
          </div>
          <div>
            <h3 className={styles['stat-content']}>{data.stats?.totalTasks || 0}</h3>
            <p className={styles['stat-content-label']}>Total Tasks</p>
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={`${styles['stat-icon']} ${styles['stat-icon-completed']}`}>
            ✓
          </div>
          <div>
            <h3 className={styles['stat-content']}>{data.stats?.completedTasks || 0}</h3>
            <p className={styles['stat-content-label']}>Completed Tasks</p>
          </div>
        </div>

        <div className={styles['stat-card']}>
          <div className={`${styles['stat-icon']} ${styles['stat-icon-pending']}`}>
            ⏳
          </div>
          <div>
            <h3 className={styles['stat-content']}>{data.stats?.pendingTasks || 0}</h3>
            <p className={styles['stat-content-label']}>Pending Tasks</p>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className={styles['projects-section']}>
        <div className={styles['section-header']}>
          <h2 className={styles['section-title']}>Recent Projects</h2>
          <div className={styles['section-actions']}>
            <button 
              className={styles['view-projects-btn']}
              onClick={() => navigate("/projects")}
            >
              View All Projects
            </button>
            <button 
              className={styles['create-project-btn']}
              onClick={handleCreateProject}
            >
              + New Project
            </button>
          </div>
        </div>

        {data.recentProjects && data.recentProjects.length > 0 ? (
          <div className={styles['projects-table']}>
            <table>
              <thead>
                <tr>
                  <th className={styles['projects-table-th']}>Project Name</th>
                  <th className={styles['projects-table-th']}>Status</th>
                  <th className={styles['projects-table-th']}>Created Date</th>
                  <th className={styles['projects-table-th']}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentProjects.map((project) => (
                  <tr key={project.id || project.project_id}>
                    <td className={styles['projects-table-td']}>
                      <span className={styles['project-name']}>
                        {project.name}
                      </span>
                    </td>
                    <td className={styles['projects-table-td']}>
                      <span className={`${styles['status-badge']} ${
                        project.status?.toLowerCase() === 'active' ? styles['status-badge-active'] : 
                        project.status?.toLowerCase() === 'completed' ? styles['status-badge-completed'] : 
                        project.status?.toLowerCase() === 'pending' ? styles['status-badge-pending'] : ''
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className={styles['projects-table-td']}>
                      {project.created_at 
                        ? new Date(project.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className={styles['projects-table-td']}>
                      <button 
                        className={styles['view-btn']}
                        onClick={() => handleViewProject(project.id || project.project_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles['no-projects']}>
            <p>No projects found</p>
            <button 
              className={styles['create-project-btn']}
              onClick={() => navigate("/projects/create")}
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ManagerDashboard;