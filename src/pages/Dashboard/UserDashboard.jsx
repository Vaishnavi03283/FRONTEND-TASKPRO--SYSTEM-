import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { getUserDashboard } from "../../api/dashboard.api";
import { getTasks, updateStatus } from "../../api/task.api";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const { user } = useAuthStore();
  
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTask, setUpdatingTask] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user dashboard data
      const dashboardResult = await getUserDashboard();
      console.log("User Dashboard Data:", dashboardResult);
      
      // Fetch user's assigned tasks
      const tasksResult = await getTasks();
      console.log("User Tasks:", tasksResult);
      
      // Extract tasks array from response
      const tasks = tasksResult?.data?.tasks || tasksResult?.tasks || tasksResult || [];
      
      // Calculate stats from tasks if dashboard stats are not available
      const calculatedStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
        inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        activeProjects: [...new Set(tasks.map(t => t.project_id).filter(Boolean))].length,
        totalUsers: dashboardResult?.stats?.totalUsers || 0
      };
      
      // Use dashboard stats if available, otherwise use calculated stats
      setStats(dashboardResult?.stats || calculatedStats);
      
      // Set recent tasks (first 5)
      setRecentTasks(tasks.slice(0, 5));
      
      console.log("📊 Final stats being set:", dashboardResult?.stats || calculatedStats);
      
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data");
      
      // Set fallback stats on error
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        activeProjects: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return styles.highPriority;
      case 'medium': return styles.mediumPriority;
      case 'low': return styles.lowPriority;
      default: return styles.lowPriority;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return styles.completedStatus;
      case 'in_progress': return styles.inProgressStatus;
      case 'pending': return styles.pendingStatus;
      default: return styles.pendingStatus;
    }
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  // Task Status Update Handler
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setUpdatingTask(taskId);
      
      console.log(`🔄 Updating task ${taskId} status to: ${newStatus}`);
      
      // Call API to update task status
      const response = await updateStatus(taskId, newStatus);
      console.log('✅ Task status updated successfully:', response);
      
      // Show success notification
      addNotification({
        type: 'success',
        message: `Task status updated to ${newStatus.replace('_', ' ')} successfully!`,
        duration: 3000
      });
      
      // Update local state to reflect the change
      setRecentTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
      
      // Update stats based on status change
      setStats(prevStats => {
        const newStats = { ...prevStats };
        
        // Decrease old status count
        const oldTask = recentTasks.find(t => t.id === taskId);
        if (oldTask) {
          switch(oldTask.status) {
            case 'PENDING':
              newStats.pendingTasks = Math.max(0, newStats.pendingTasks - 1);
              break;
            case 'IN_PROGRESS':
              newStats.inProgressTasks = Math.max(0, newStats.inProgressTasks - 1);
              break;
            case 'COMPLETED':
              newStats.completedTasks = Math.max(0, newStats.completedTasks - 1);
              break;
          }
        }
        
        // Increase new status count
        switch(newStatus) {
          case 'PENDING':
            newStats.pendingTasks = (newStats.pendingTasks || 0) + 1;
            break;
          case 'IN_PROGRESS':
            newStats.inProgressTasks = (newStats.inProgressTasks || 0) + 1;
            break;
          case 'COMPLETED':
            newStats.completedTasks = (newStats.completedTasks || 0) + 1;
            break;
        }
        
        return newStats;
      });
      
    } catch (err) {
      console.error('❌ Error updating task status:', err);
      addNotification({
        type: 'error',
        message: 'Failed to update task status. Please try again.',
        duration: 5000
      });
    } finally {
      setUpdatingTask(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.userDashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.userDashboard}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className={styles.errorBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userDashboard}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>User Dashboard</h1>
        <p className={styles.dashboardSubtitle}>View your tasks and progress</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.tasks}`}>
            📋
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.completed}`}>
            ✅
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.completedTasks || 0}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pending}`}>
            ⏳
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.pendingTasks || 0}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.inProgress}`}>
            🔄
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.inProgressTasks || 0}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.projects}`}>
            📁
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.activeProjects || 0}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.users}`}>
            👥
          </div>
          <div className={styles.statContent}>
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Tasks</h2>
          <button 
            onClick={() => navigate('/tasks')}
            className={styles.viewAllBtn}
          >
            View All Tasks
          </button>
        </div>

        {recentTasks.length > 0 ? (
          <div className={styles.tasksList}>
            {recentTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskHeader}>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <span className={`${styles.taskStatus} ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <p className={styles.taskDescription}>
                  {task.description || 'No description available'}
                </p>

                <div className={styles.taskMeta}>
                  <span className={styles.taskProject}>
                    {task.project?.name || 'No Project'}
                  </span>
                  <span>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.taskActions}>
                  <span className={`${styles.priorityBadge} ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  
                  {/* Status Update Buttons */}
                  <div className={styles.statusActions}>
                    {task.status !== 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'PENDING')}
                        disabled={updatingTask === task.id}
                        className={`${styles.statusBtn} ${styles.pendingBtn}`}
                        title="Mark as Pending"
                      >
                        ⏳
                      </button>
                    )}
                    
                    {task.status !== 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')}
                        disabled={updatingTask === task.id}
                        className={`${styles.statusBtn} ${styles.inProgressBtn}`}
                        title="Mark as In Progress"
                      >
                        🔄
                      </button>
                    )}
                    
                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusUpdate(task.id, 'COMPLETED')}
                        disabled={updatingTask === task.id}
                        className={`${styles.statusBtn} ${styles.completedBtn}`}
                        title="Mark as Completed"
                      >
                        ✅
                      </button>
                    )}
                    
                    {updatingTask === task.id && (
                      <div className={styles.updatingSpinner}></div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleViewTask(task.id)}
                    className={styles.viewTaskBtn}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No tasks yet</h3>
            <p className={styles.emptyDescription}>
              You haven't been assigned any tasks yet. Check back later!
            </p>
            <button 
              onClick={() => navigate('/tasks')}
              className={styles.emptyAction}
            >
              Browse Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;