import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectTasks, updateStatus, deleteTask } from '../../api/task.api';
import { getProjectById } from '../../api/project.api';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../../components/common/Card';
import { cn } from '../../utils';
import './ProjectTasks.css';

const ProjectTasks = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    let filteredTasks = [...tasks];
    
    // Apply search filter
    if (filters.search) {
      filteredTasks = filteredTasks.filter(task =>
        task.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => 
        task.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply priority filter
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority?.toLowerCase() === filters.priority.toLowerCase()
      );
    }
    
    return filteredTasks;
  }, [tasks, filters]);

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      
      // Fetch project tasks using GET /tasks/project/{id}
      const tasksData = await getProjectTasks(projectId);
      setTasks(tasksData);
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch project tasks";
      setError(errorMessage);
      console.error("Error fetching project tasks:", err);
      console.error("Error response:", err?.response);
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateStatus(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      setError("Failed to update task status");
      console.error("Error updating task status:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleAssignTask = (taskId) => {
    navigate(`/tasks/${taskId}/assign`);
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = () => {
    if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
      navigate(`/projects/${projectId}/tasks/create`);
    } else {
      alert("Only Managers and Admins can create tasks");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'active': case 'in_progress': return '#3b82f6';
      case 'pending': case 'todo': return '#f59e0b';
      case 'on-hold': case 'blocked': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const canCreateTask = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="project-tasks">
        <Card variant="default" shadow="md" className="loading-card">
          <CardBody className="loading-body">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading project tasks...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-tasks">
        <Card variant="error" shadow="md" className="error-card">
          <CardBody className="error-body">
            <div className="error-container">
              <p>{error}</p>
              <Button onClick={fetchProjectAndTasks} variant="primary" size="md">Retry</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-tasks">
        <div className="not-found">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/projects')}>Back to Projects</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-tasks">
      <div className="page-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate(`/projects/${projectId}`)}>
            ← Back to Project
          </button>
          <h1>{project.name} - Tasks</h1>
          <p>Manage all tasks for this project</p>
        </div>
        
        {canCreateTask && (
          <button className="create-btn" onClick={handleCreateTask}>
            <span>+</span>
            Create Task
          </button>
        )}
      </div>

      <div className="project-info">
        <div className="info-card">
          <h2>Project Overview</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Status:</label>
              <span className="status-badge">{project.status?.replace('_', ' ')}</span>
            </div>
            <div className="info-item">
              <label>Total Tasks:</label>
              <span>{tasks.length}</span>
            </div>
            <div className="info-item">
              <label>Start Date:</label>
              <span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>End Date:</label>
              <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Priority:</label>
          <select 
            value={filters.priority} 
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="tasks-section">
        <h2>Tasks ({filteredTasks.length})</h2>
        
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div key={task.id || task.task_id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-badges">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <p className="task-description">
                {task.description || 'No description available'}
              </p>
              
              <div className="task-meta">
                <div className="meta-item">
                  <span className="meta-label">Assigned to:</span>
                  <span className="meta-value">{task.assigned_to_name || task.assignee?.name || 'Unassigned'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Due Date:</span>
                  <span className="meta-value">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                  </span>
                </div>
              </div>
              
              <div className="task-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewTask(task.id || task.task_id)}
                  title="View Task Details"
                >
                  <span>👁️</span>
                  View
                </button>
                
                {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
                  <>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditTask(task.id || task.task_id)}
                      title="Edit Task"
                    >
                      <span>✏️</span>
                      Edit
                    </button>
                    
                    <button 
                      className="action-btn assign-btn"
                      onClick={() => handleAssignTask(task.id || task.task_id)}
                      title="Assign Task"
                    >
                      <span>👥</span>
                      Assign
                    </button>
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteTask(task.id || task.task_id)}
                      title="Delete Task"
                    >
                      <span>🗑️</span>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>
              {filters.search || filters.status || filters.priority
                ? "No tasks found matching your criteria"
                : "No tasks in this project yet"
              }
            </h3>
            <p>
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your search terms or filters'
                : canCreateTask
                ? 'Get started by creating your first task for this project'
                : 'Tasks will appear here once they are created'
              }
            </p>
            {canCreateTask && !filters.search && !filters.status && !filters.priority && (
              <button className="create-btn" onClick={handleCreateTask}>
                Create First Task
              </button>
            )}
            {!canCreateTask && !filters.search && !filters.status && !filters.priority && (
              <div className="no-create-message">
                <p>⚠️ Only Managers and Admins can create tasks</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;
