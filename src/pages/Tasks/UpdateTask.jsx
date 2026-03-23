import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskById, updateTask } from '../../api/task.api';
import { useProjectList } from '../../hooks/useProjects';
import { useUserList } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../../components/common/Card';
import { cn } from '../../utils';
import './UpdateTask.css';

// Validation utilities
const validateTaskForm = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title?.trim()) {
    errors.title = 'Task title is required';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Task title must be at least 3 characters';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Task title must not exceed 100 characters';
  }

  // Description validation
  if (formData.description && formData.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  // Due date validation
  if (formData.due_date) {
    const dueDate = new Date(formData.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }

  return errors;
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH': return '#dc2626';
    case 'MEDIUM': return '#f59e0b';
    case 'LOW': return '#10b981';
    default: return '#6b7280';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'TODO': return '#f59e0b';
    case 'IN_PROGRESS': return '#3b82f6';
    case 'COMPLETED': return '#10b981';
    case 'BLOCKED': return '#dc2626';
    default: return '#6b7280';
  }
};

const UpdateTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { projects } = useProjectList();
  const { users } = useUserList();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    due_date: '',
    assigned_to: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [taskLoading, setTaskLoading] = useState(true);
  const [initialTask, setInitialTask] = useState(null);

  // Load task data
  useEffect(() => {
    const loadTask = async () => {
      try {
        setTaskLoading(true);
        const response = await getTaskById(id);
        const taskData = response.data || response;
        
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          priority: taskData.priority || 'MEDIUM',
          status: taskData.status || 'TODO',
          due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
          assigned_to: taskData.assigned_to || ''
        });
        
        setInitialTask(taskData);
      } catch (err) {
        console.error('Error loading task:', err);
        navigate('/tasks');
      } finally {
        setTaskLoading(false);
      }
    };

    if (id) {
      loadTask();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldErrors = validateTaskForm(formData);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));
  };

  const validateForm = () => {
    const newErrors = validateTaskForm(formData);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allFields = ['title', 'description', 'due_date'];
    setTouched(allFields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {}));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date || null,
        // Only include assigned_to if user is manager/admin
        ...(user?.role === 'MANAGER' || user?.role === 'ADMIN') && formData.assigned_to && {
          assigned_to: formData.assigned_to
        }
      };

      await updateTask(id, taskData);
      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error('Task update error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Failed to update task. Please try again.';
      
      if (err.response?.status === 400) {
        const validationErrors = err.response?.data;
        
        if (typeof validationErrors === 'string') {
          errorMessage = validationErrors;
        } else if (validationErrors?.message) {
          errorMessage = validationErrors.message;
          
          // Map field-specific errors
          if (validationErrors.errors) {
            const fieldErrors = {};
            if (Array.isArray(validationErrors.errors)) {
              validationErrors.errors.forEach(error => {
                if (typeof error === 'string') {
                  if (error.toLowerCase().includes('title')) {
                    fieldErrors.title = error;
                  } else if (error.toLowerCase().includes('description')) {
                    fieldErrors.description = error;
                  } else if (error.toLowerCase().includes('due date')) {
                    fieldErrors.due_date = error;
                  }
                }
              });
            }
            setErrors(fieldErrors);
            return;
          }
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tasks/${id}`);
  };

  const hasChanges = () => {
    if (!initialTask) return false;
    
    return (
      formData.title.trim() !== (initialTask.title || '') ||
      formData.description.trim() !== (initialTask.description || '') ||
      formData.priority !== (initialTask.priority || 'MEDIUM') ||
      formData.status !== (initialTask.status || 'TODO') ||
      formData.due_date !== (initialTask.due_date ? initialTask.due_date.split('T')[0] : '') ||
      formData.assigned_to !== (initialTask.assigned_to || '')
    );
  };

  if (taskLoading) {
    return (
      <div className="update-task">
        <Card variant="default" shadow="md" className="loading-card">
          <CardBody className="loading-body">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading task details...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="update-task">
      <Card variant="default" shadow="md" className="page-header">
        <CardBody className="page-header-body">
          <Button className="back-btn" onClick={handleCancel} variant="ghost" size="sm">
            ← Back to Task
          </Button>
          <div className="header-content">
            <CardTitle>Update Task</CardTitle>
            <CardDescription>Modify task details below</CardDescription>
          </div>
        </CardBody>
      </Card>

      {errors.submit && (
        <Card className={cn("form-error alert", styles.errorAlert)} variant="error" shadow="sm">
          <CardBody className="error-body">
            <span className="error-icon">⚠️</span>
            {errors.submit}
          </CardBody>
        </Card>
      )}

      <Card variant="primary" shadow="lg" className="task-form">
        <CardBody className="task-form-body">
          <form onSubmit={handleSubmit} className="task-form-inner">
        <div className="form-section">
          <h2>Task Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title" className="form-label">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.title && errors.title ? 'error' : ''} ${touched.title && !errors.title ? 'success' : ''}`}
                placeholder="Enter task title"
                required
                disabled={loading}
                maxLength={100}
              />
              <div className="field-info">
                <span className="char-count">{formData.title.length}/100</span>
                {touched.title && errors.title && (
                  <span className="error-message">{errors.title}</span>
                )}
                {touched.title && !errors.title && formData.title.length >= 3 && (
                  <span className="success-message">✓ Title looks good</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <div className="priority-options">
                {['LOW', 'MEDIUM', 'HIGH'].map(priority => (
                  <label key={priority} className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span 
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(priority) }}
                    ></span>
                    <span className="priority-text">{priority}</span>
                    <span className="priority-desc">
                      {priority === 'HIGH' && 'Urgent - Immediate attention needed'}
                      {priority === 'MEDIUM' && 'Normal - Standard priority'}
                      {priority === 'LOW' && 'Low - Can be addressed later'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <div className="status-options">
                {['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'].map(status => (
                  <label key={status} className="status-option">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(status) }}
                    ></span>
                    <span className="status-text">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="due_date" className="form-label">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.due_date && errors.due_date ? 'error' : ''} ${touched.due_date && !errors.due_date && formData.due_date ? 'success' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              {touched.due_date && errors.due_date && (
                <span className="error-message">{errors.due_date}</span>
              )}
              {touched.due_date && !errors.due_date && formData.due_date && (
                <span className="success-message">✓ Due date set</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-textarea ${touched.description && errors.description ? 'error' : ''} ${touched.description && !errors.description ? 'success' : ''}`}
                placeholder="Provide detailed information about this task..."
                rows={4}
                maxLength={500}
                disabled={loading}
              />
              <div className="field-info">
                <span className="char-count">{formData.description.length}/500</span>
                {touched.description && errors.description && (
                  <span className="error-message">{errors.description}</span>
                )}
                {touched.description && !errors.description && formData.description.length > 0 && (
                  <span className="success-message">✓ Description added</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
          <div className="form-section">
            <h2>Assignment</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="assigned_to" className="form-label">
                  Assign To <span className="optional">(Optional)</span>
                </label>
                <select
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="">Select user (optional)</option>
                  {users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="field-hint">
                  💡 Leave empty to unassign or keep current assignment
                </div>
              </div>
            </div>
          </div>
          )}

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCancel}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || Object.keys(errors).some(key => errors[key]) || !hasChanges()}
            loading={loading}
            className="submit-btn"
          >
            {loading ? 'Updating Task...' : '💾 Update Task'}
          </Button>
        </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdateTask;
