import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { getUserDashboard } from "../../api/dashboard.api";
import { getTasks, updateStatus } from "../../api/task.api";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
  // Calculate sprint remaining tasks
  const sprintRemaining = (stats?.totalTasks || 0) - (stats?.completedTasks || 0);
  const completionPercentage = stats?.totalTasks > 0 ? Math.round((stats?.completedTasks / stats?.totalTasks) * 100) : 0;

  // Sprint timeline data
  const sprintTimeline = [
    { title: "Sprint Planning", date: "Oct 20", status: "completed" },
    { title: "Mid-Sprint Review", date: "Oct 25", status: "upcoming" },
    { title: "Sprint Retro", date: "Oct 30", status: "planned" }
  ];

  // Filter tasks based on search
  const filteredTasks = recentTasks.filter(task => 
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Enhanced Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>Your Focus.</h1>
          <p className={styles.dashboardSubtitle}>You have {sprintRemaining} tasks remaining for this sprint.</p>
        </div>
        <div className={styles.headerRight}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
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
                  <button className={styles.dropdownItem}>Profile Settings</button>
                  <button className={styles.dropdownItem}>Preferences</button>
                  <button className={styles.dropdownItem}>Help & Support</button>
                </div>
              </div>
            )}
          </button>
          
          {/* User Profile */}
          <button className={styles.profileButton}>
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className={styles.statsGrid}>
        <Card variant="default" shadow="md" hover className={styles.statCard}>
          <CardBody className={styles.statCardBody}>
            <div className={`${styles.statIcon} ${styles.totalTasks}`}>
              📋
            </div>
            <div className={styles.statContent}>
              <h3>{stats?.totalTasks || 0}</h3>
              <p>Total Tasks</p>
              <span className={styles.statChange}>+{stats?.pendingTasks || 0} pending</span>
            </div>
          </CardBody>
        </Card>

        <Card variant="success" shadow="md" hover className={styles.statCard}>
          <CardBody className={styles.statCardBody}>
            <div className={`${styles.statIcon} ${styles.completedTasks}`}>
              ✅
            </div>
            <div className={styles.statContent}>
              <h3>{stats?.completedTasks || 0}</h3>
              <p>Completed</p>
              <span className={styles.statChange}>{stats?.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% rate</span>
            </div>
          </CardBody>
        </Card>

        <Card variant="warning" shadow="md" hover className={styles.statCard}>
          <CardBody className={styles.statCardBody}>
            <div className={`${styles.statIcon} ${styles.inProgressTasks}`}>
              ⏳
            </div>
            <div className={styles.statContent}>
              <h3>{stats?.inProgressTasks || 0}</h3>
              <p>In Progress</p>
              <span className={styles.statChange}>Active now</span>
            </div>
          </CardBody>
        </Card>

        <Card variant="primary" shadow="md" hover className={styles.statCard}>
          <CardBody className={styles.statCardBody}>
            <div className={`${styles.statIcon} ${styles.activeProjects}`}>
              📁
            </div>
            <div className={styles.statContent}>
              <h3>{stats?.activeProjects || 0}</h3>
              <p>Projects</p>
              <span className={styles.statChange}>This sprint</span>
            </div>
          </CardBody>
        </Card>
      </div>
          </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.dashboardGrid}>
        {/* Left Column - Assigned Tasks */}
        <div className={styles.leftColumn}>
          <Card variant="default" shadow="md" className={styles.section}>
            <CardHeader className={styles.sectionHeader}>
              <CardTitle className={styles.sectionTitle}>Assigned Tasks</CardTitle>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks')}
                className={styles.viewAllBtn}
              >
                View All
              </Button>
            </CardHeader>
            
            <CardBody className={styles.sectionBody}>
              {filteredTasks.length > 0 ? (
                <div className={styles.tasksList}>
                  {filteredTasks.map((task) => (
                    <Card key={task.id} variant="default" shadow="sm" hover className={styles.taskItem}>
                      <CardBody className={styles.taskBody}>
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
                      <span className={styles.taskDate}>
                        {new Date(task.createdAt || task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={styles.taskCategory}>
                        {task.project?.name || 'GENERAL'}
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
                <h3 className={styles.emptyTitle}>No tasks found</h3>
                <p className={styles.emptyDescription}>
                  {searchQuery ? 'No tasks match your search' : 'You haven\'t been assigned any tasks yet'}
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

        {/* Right Column - Sprint Timeline & Tips */}
        <div className={styles.rightColumn}>
          {/* Sprint Timeline */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Sprint Timeline</h2>
            <div className={styles.timeline}>
              {sprintTimeline.map((item, index) => (
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

          {/* Power User Tips */}
          <div className={`${styles.section} ${styles.tipsCard}`}>
            <div className={styles.tipsHeader}>
              <h3 className={styles.tipsTitle}>Power User Tips</h3>
              <div className={styles.tipsIcon}>💡</div>
            </div>
            <p className={styles.tipsContent}>
              Use <kbd className={styles.kbd}>CMD</kbd> + <kbd className={styles.kbd}>K</kbd> to quickly search and navigate to any task or project.
            </p>
            <button className={styles.tipsButton}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;