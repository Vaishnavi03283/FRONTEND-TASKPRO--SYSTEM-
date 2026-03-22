import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask, assignTask, updateStatus } from "../../api/task.api";
import { getComments, addComment, deleteComment } from "../../api/task.api";
import { getUsers } from "../../api/user.api";
import { useAuth } from "../../hooks/useAuth";
import { useTask } from "../../context/TaskContext";
import "./TaskDetails.css";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, actions } = useTask();
  
  // Debug logging for route parameters
  console.log('🔍 TaskDetails - Route params:', { taskId });
  console.log('🔍 TaskDetails - Full URL:', window.location.href);
  console.log('🔍 TaskDetails - Pathname:', window.location.pathname);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchTaskDetails();
    fetchUsers();
  }, [taskId]);

  const fetchTaskDetails = useCallback(async () => {
    // Check if taskId exists
    if (!taskId) {
      const errorMessage = "Task ID is missing. Please navigate to a valid task.";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Task ID is undefined:", taskId);
      setLoading(false);
      actions.setLoading(false);
      return;
    }

    console.log('🔍 Fetching task details for ID:', taskId);
    
    try {
      setLoading(true);
      setError(null);
      actions.setLoading(true);
      actions.clearError();
      
      const [taskRes, commentsRes] = await Promise.all([
        getTaskById(taskId),
        getComments(taskId)
      ]);
      
      const taskData = taskRes.data || taskRes;
      const commentsData = commentsRes.data || commentsRes || [];
      
      console.log('✅ Task data loaded:', taskData);
      console.log('✅ Comments loaded:', commentsData);
      
      actions.setCurrentTask(taskData);
      setComments(commentsData);
      setEditForm({
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'MEDIUM',
        status: taskData.status || 'TODO',
        due_date: taskData.due_date || ''
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load task details";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Error loading task details:", err);
      console.error("Task ID that failed:", taskId);
    } finally {
      setLoading(false);
      actions.setLoading(false);
    }
  }, [taskId, actions]);

  const fetchUsers = useCallback(async () => {
    try {
      const usersRes = await getUsers();
      setUsers(usersRes.data || usersRes || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch users";
      console.error("Error fetching users:", err);
      // Don't set main error for users fetch failure, just log it
    }
  }, []);

  const handleStatusChange = useCallback(async (newStatus) => {
    try {
      setStatusLoading(true);
      const response = await updateStatus(taskId, { status: newStatus });
      const updatedTask = response.data || response;
      
      // Update current task in context
      actions.updateTask(updatedTask);
      
      // Show success feedback (optional)
      console.log('Task status updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update task status";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Error updating status:", err);
    } finally {
      setStatusLoading(false);
    }
  }, [taskId, actions]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;
    
    try {
      const commentData = {
        content: newComment.trim(),
        user_id: user.id
      };
      const commentRes = await addComment(taskId, commentData);
      const newCommentData = commentRes.data || commentRes;
      
      setComments(prev => [newCommentData, ...prev]);
      setNewComment("");
      console.log('Comment added successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add comment";
      setError(errorMessage);
      console.error("Error adding comment:", err);
    }
  }, [taskId, user.id]);

  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      await deleteComment(taskId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      console.log('Comment deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete comment";
      setError(errorMessage);
      console.error("Error deleting comment:", err);
    }
  }, [taskId]);

  const handleEditTask = useCallback(() => {
    if (!state.currentTask) return;
    
    setIsEditing(true);
    setEditForm({
      title: state.currentTask.title || '',
      description: state.currentTask.description || '',
      priority: state.currentTask.priority || 'MEDIUM',
      status: state.currentTask.status || 'TODO',
      due_date: state.currentTask.due_date || ''
    });
  }, [state.currentTask]);

  const handleSaveEdit = useCallback(async () => {
    try {
      // Validate form
      if (!editForm.title?.trim()) {
        setError("Task title is required");
        return;
      }

      const response = await updateTask(taskId, editForm);
      const updatedTask = response.data || response;
      
      // Update current task in context
      actions.updateTask(updatedTask);
      
      setIsEditing(false);
      setError(null);
      actions.clearError();
      console.log('Task updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update task";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Error updating task:", err);
    }
  }, [taskId, editForm, actions]);

  const handleCancelEdit = useCallback(() => {
    if (state.currentTask) {
      setEditForm({
        title: state.currentTask.title || '',
        description: state.currentTask.description || '',
        priority: state.currentTask.priority || 'MEDIUM',
        status: state.currentTask.status || 'TODO',
        due_date: state.currentTask.due_date || ''
      });
    }
    setIsEditing(false);
    setError(null);
    actions.clearError();
  }, [state.currentTask, actions]);

  const handleDeleteTask = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteTask(taskId);
      
      // Remove from context
      actions.deleteTask(taskId);
      
      navigate("/tasks");
      console.log('Task deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete task";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Error deleting task:", err);
    }
  }, [taskId, actions, navigate]);

  const handleAssignTask = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const response = await assignTask(taskId, userId);
      const updatedTask = response.data || response;
      
      // Update current task in context
      actions.updateTask(updatedTask);
      
      console.log('Task assigned successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to assign task";
      setError(errorMessage);
      actions.setError(errorMessage);
      console.error("Error assigning task:", err);
    } finally {
      setAssignLoading(false);
    }
  }, [taskId, actions]);

  const handleEditFormChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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

  const canEditTask = useMemo(() => {
    return user?.role === 'MANAGER' || user?.role === 'ADMIN' || 
           (state.currentTask?.assigned_user_id === user.id);
  }, [user, state.currentTask]);

  const canDeleteTask = useMemo(() => {
    return user?.role === 'MANAGER' || user?.role === 'ADMIN' || 
           (state.currentTask?.assigned_user_id === user.id);
  }, [user, state.currentTask]);

  const canAssignTask = useMemo(() => {
    return user?.role === 'MANAGER' || user?.role === 'ADMIN';
  }, [user]);

  const statusOptions = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
  const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

  if (loading || state.loading) {
    return (
      <div className="task-details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  const displayError = error || state.error;

  if (displayError) {
    return (
      <div className="task-details-container">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Task</h3>
            <p>{displayError}</p>
            <button onClick={() => {
              setError(null);
              actions.clearError();
              fetchTaskDetails();
            }} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!state.currentTask) {
    return (
      <div className="task-details-container">
        <div className="not-found-container">
          <div className="not-found-content">
            <div className="not-found-icon">📋</div>
            <h3>Task Not Found</h3>
            <p>The task you're looking for doesn't exist.</p>
            <button onClick={() => navigate("/tasks")} className="back-btn">
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      {/* Error Notification */}
      {displayError && (
        <div className="error-notification">
          <div className="error-notification-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{displayError}</span>
            <button 
              onClick={() => {
                setError(null);
                actions.clearError();
              }} 
              className="error-close-btn"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="task-header">
        <div className="header-left">
          <button 
            onClick={() => navigate("/tasks")} 
            className="back-btn"
          >
            ← Back to Tasks
          </button>
          <h1 className="task-title">{state.currentTask.title}</h1>
        </div>
        
        {canEditTask && (
          <div className="header-actions">
            <button 
              onClick={handleEditTask}
              className="action-btn edit-btn"
              title="Edit Task"
            >
              <span>✏️</span>
              Edit
            </button>
            {canAssignTask && (
              <div className="assign-dropdown">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      setAssignLoading(true);
                      handleAssignTask(e.target.value);
                      e.target.value = ''; // Reset select
                    }
                  }}
                  disabled={assignLoading}
                  className="assign-select"
                  value=""
                >
                  <option value="">Assign to...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {canDeleteTask && (
              <button 
                onClick={handleDeleteTask}
                className="action-btn delete-btn"
                title="Delete Task"
              >
                <span>🗑️</span>
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="task-content">
        {/* Main Task Info */}
        <div className="task-main">
          <div className="task-info-card">
            <div className="task-description">
              <h3>Description</h3>
              <p>{state.currentTask.description || 'No description provided'}</p>
            </div>

            <div className="task-meta-grid">
              <div className="meta-item">
                <label>Status:</label>
                <div className="status-selector">
                  <select 
                    value={state.currentTask.status} 
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusLoading || !canEditTask}
                    className="status-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <span 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(state.currentTask.status) }}
                  ></span>
                </div>
              </div>

              <div className="meta-item">
                <label>Priority:</label>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(state.currentTask.priority) }}
                >
                  {state.currentTask.priority}
                </span>
              </div>

              <div className="meta-item">
                <label>Assigned to:</label>
                <span className="assignee-info">
                  {state.currentTask.assigned_to_name || state.currentTask.assignee?.name || 'Unassigned'}
                </span>
              </div>

              <div className="meta-item">
                <label>Created Date:</label>
                <span className="date-info">
                  {state.currentTask.created_at 
                    ? new Date(state.currentTask.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </span>
              </div>

              <div className="meta-item">
                <label>Due Date:</label>
                <span className="date-info">
                  {state.currentTask.due_date 
                    ? new Date(state.currentTask.due_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'No due date'}
                </span>
              </div>

              <div className="meta-item">
                <label>Project:</label>
                <span className="project-info">
                  {state.currentTask.project_name || state.currentTask.project?.name || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>
          
          {/* Add Comment */}
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
              rows={3}
            />
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="add-comment-btn"
            >
              Add Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">
                      <strong>{comment.user?.name || comment.author_name || 'Anonymous'}</strong>
                      <span className="comment-date">
                        {comment.created_at 
                          ? new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''}
                      </span>
                    </div>
                    {(user?.id === comment.user_id || canDeleteTask) && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-comment-btn"
                        title="Delete comment"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="task-edit-modal">
          <div className="task-edit-modal-content">
            <div className="task-edit-modal-header">
              <h3>Edit Task</h3>
              <button 
                className="task-edit-close-btn" 
                onClick={handleCancelEdit}
              >
                ×
              </button>
            </div>
            
            <div className="task-edit-form">
              <div className="task-edit-form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleEditFormChange('title', e.target.value)}
                  className="task-edit-input"
                />
              </div>

              <div className="task-edit-form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  className="task-edit-textarea"
                  rows="3"
                />
              </div>

              <div className="task-edit-form-row">
                <div className="task-edit-form-group">
                  <label>Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => handleEditFormChange('priority', e.target.value)}
                    className="task-edit-select"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="task-edit-form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => handleEditFormChange('status', e.target.value)}
                    className="task-edit-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="task-edit-form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editForm.due_date}
                  onChange={(e) => handleEditFormChange('due_date', e.target.value)}
                  className="task-edit-input"
                />
              </div>

              <div className="task-edit-form-actions">
                <button 
                  className="task-edit-cancel-btn" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button 
                  className="task-edit-save-btn" 
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;