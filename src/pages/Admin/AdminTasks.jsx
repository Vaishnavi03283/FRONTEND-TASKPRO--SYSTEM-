import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTasks } from '../../hooks/useAdmin';
import { useAdmin } from '../../context/AdminContext';
import './AdminTasks.css';

const AdminTasks = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, refetch } = useAdminTasks();
  const { actions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleTaskClick = useCallback((taskId) => {
    navigate(`/tasks/${taskId}`);
  }, [navigate]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        actions.deleteTask(taskId);
        console.log('Task deleted:', taskId);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  }, [actions]);

  const handleEditTask = useCallback((taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  }, [navigate]);

  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, searchTerm, filterStatus, filterPriority, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo': return '#6b7280';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="admin-tasks-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-tasks-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Tasks</h3>
        <p>{error}</p>
        <button onClick={refetch} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-tasks">
      <div className="admin-header">
        <h1>All Tasks</h1>
        <p>Manage and monitor all tasks in the system</p>
      </div>

      {/* Filters and Controls */}
      <div className="tasks-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort);
              setSortOrder(order);
            }}
            className="filter-select"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="status-asc">Status (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-grid">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-badges">
                  <span 
                    className="task-status"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                  <span 
                    className="task-priority"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              
              <p className="task-description">
                {task.description || 'No description available'}
              </p>
              
              <div className="task-meta">
                <div className="meta-item">
                  <span className="meta-label">Project:</span>
                  <span className="meta-value">{task.project_name || 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Assigned:</span>
                  <span className="meta-value">{task.assigned_user_name || 'Unassigned'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(task.created_at)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Due:</span>
                  <span className="meta-value">{formatDate(task.due_date)}</span>
                </div>
              </div>
              
              <div className="task-actions">
                <button
                  onClick={() => handleTaskClick(task.id)}
                  className="view-btn"
                  title="View task details"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="edit-btn"
                  title="Edit task"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-btn"
                  title="Delete task"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <div className="empty-icon">📋</div>
            <h3>No Tasks Found</h3>
            <p>
              {searchTerm 
                ? 'No tasks match your search criteria.' 
                : 'No tasks are available in the system.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="tasks-summary">
        <div className="summary-item">
          <span className="summary-label">Total Tasks:</span>
          <span className="summary-value">{tasks.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Filtered Results:</span>
          <span className="summary-value">{filteredAndSortedTasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
