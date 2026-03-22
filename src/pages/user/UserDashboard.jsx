import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardService from '../../api/dashboardService';
import TaskService from '../../api/taskService';
import styles from '../Dashboard/UserDashboard.module.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Call GET /api/v1/dashboard/user
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/dashboard/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        
        // Set statistics from API response
        setStats(data.stats || {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          pendingTasks: 0,
        });
        
        // Set recent tasks
        setRecentTasks(Array.isArray(data.recentTasks) ? data.recentTasks : []);
        
      } catch (err) {
        setError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
        console.error('Dashboard error:', err);
        // Set empty arrays on error
        setStats({
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          pendingTasks: 0,
        });
        setRecentTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
      toast.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'status-badge completed';
      case 'in_progress': return 'status-badge in-progress';
      case 'pending': return 'status-badge pending';
      default: return 'status-badge default';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'priority-badge high';
      case 'medium': return 'priority-badge medium';
      case 'low': return 'priority-badge low';
      default: return 'priority-badge default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  // Update task status
  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      
      // Refresh data
      const tasksResponse = await TaskService.getTasks({ limit: 5, assignedUser: user.id });
      setRecentTasks(tasksResponse.data || []);
      
      // Refresh stats
      const dashboardResponse = await DashboardService.getUserDashboard();
      setStats(dashboardResponse.data || stats);
      
      showToast('Task status updated successfully!', 'success');
    } catch (err) {
      setError('Failed to update task status: ' + (err.message || 'Unknown error'));
      showToast('Failed to update task status', 'error');
    }
  };

  const renderOverview = () => (
    <div className={styles.overviewSection}>
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card in-progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-value">{stats.inProgressTasks}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">{stats.pendingTasks}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="progress-overview">
            <h3>Task Completion Progress</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%` 
                  }}
                ></div>
              </div>
              <span className="progress-text">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="recent-tasks">
            <h3>Recent Tasks</h3>
            {Array.isArray(recentTasks) && recentTasks.length > 0 ? (
              <div className="task-list">
                {recentTasks.map(task => (
                  <div key={task.task_id || task.id} className="task-item">
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <div className="task-badges">
                        <span className={getStatusBadgeClass(task.status)}>
                          {task.status?.replace('_', ' ')}
                        </span>
                        <span className={getPriorityBadgeClass(task.priority)}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="task-meta">
                      <span className="task-due">Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="task-actions">
                      <select 
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.task_id || task.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      <button 
                        onClick={() => navigate(`/tasks/${task.task_id || task.id}`)}
                        className="btn btn-sm btn-secondary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Tasks Found</h3>
                <p>You don't have any assigned tasks yet</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderTasks = () => (
    <div className="tasks-section">
      <div className="section-header">
        <h3>My Tasks</h3>
        <button onClick={() => navigate('/tasks')} className="btn btn-primary">
          View All Tasks
        </button>
      </div>
      {Array.isArray(recentTasks) && recentTasks.length > 0 ? (
        <div className="task-list">
          {recentTasks.map(task => (
            <div key={task.task_id || task.id} className="task-item">
              <div className="task-header">
                <h4>{task.title}</h4>
                <div className="task-badges">
                  <span className={getStatusBadgeClass(task.status)}>
                    {task.status?.replace('_', ' ')}
                  </span>
                  <span className={getPriorityBadgeClass(task.priority)}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="task-description">
                {task.description}
              </div>
              <div className="task-meta">
                <span className="task-due">Due: {formatDate(task.dueDate)}</span>
              </div>
              <div className="task-actions">
                <select 
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task.task_id || task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <button 
                  onClick={() => navigate(`/tasks/${task.task_id || task.id}`)}
                  className="btn btn-sm btn-secondary"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Tasks Found</h3>
          <p>You don't have any assigned tasks yet</p>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="projects-section">
      <div className="section-header">
        <h3>My Projects</h3>
        <button onClick={() => navigate('/projects')} className="btn btn-primary">
          View All Projects
        </button>
      </div>
      <div className="placeholder-content">
        <p>Project overview coming soon...</p>
        <button onClick={() => navigate('/projects')} className="btn btn-secondary">
          Browse Projects
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userDashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>User Dashboard</h1>
          <p>Welcome back, {user?.name || user?.firstName || 'User'}!</p>
        </div>
        <div className={styles.headerRight}>
          <button onClick={() => navigate('/tasks')} className={styles.btnPrimary}>
            📋 View All Tasks
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError('')} className={styles.errorClose}>×</button>
        </div>
      )}

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'tasks' ? styles.active : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Tasks
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'projects' && renderProjects()}
      </div>
    </div>
  );
};

export default UserDashboard;
