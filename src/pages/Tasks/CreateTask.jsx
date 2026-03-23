import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createTask, assignTask, assignTaskToMultipleUsers } from '../../api/task.api';
import { getProjects } from '../../api/project.api';
import { getUsers } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../../components/common/Card';
import { cn } from '../../utils';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { user } = useAuth();
  const projectId = id || searchParams.get('projectId') || searchParams.get('id');

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    setValue, 
    watch,
    reset,
    setError 
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      due_date: '',
      project_id: projectId || '',
      assigned_user_ids: [] // Array for multiple user IDs
    }
  });

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  
  // User search states - Updated for multiple selection
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // Array for multiple users
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, user: null });

  // Set project_id from URL params
  useEffect(() => {
    if (projectId) {
      setValue('project_id', projectId);
    }
  }, [projectId, setValue]);

  // Fetch projects and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users for assignment - IMMEDIATE FUNCTIONALITY
        console.log('🔄 Fetching all users from GET /users API...');
        setUsersLoading(true);
        setUsersError(null);
        
        const usersResponse = await getUsers(100); // Fetch up to 100 users to get all available users
        console.log('📊 Users API Response:', usersResponse);
        
        // Handle multiple response structures:
        let usersData = [];
        
        if (usersResponse?.success && usersResponse?.data) {
          // New structure: {success: true, message: '...', data: {...}}
          const innerData = usersResponse.data;
          if (Array.isArray(innerData.data)) {
            usersData = innerData.data; // Extract the actual users array
            console.log('📋 Using nested response structure: success.data.data');
          } else if (Array.isArray(innerData)) {
            usersData = innerData;
            console.log('📋 Using nested response structure: success.data');
          } else {
            console.warn('⚠️ Invalid nested data structure:', innerData);
            usersData = [];
          }
        } else if (usersResponse?.data && Array.isArray(usersResponse.data)) {
          // Paginated structure: {total, page, limit, data: [...]}
          usersData = usersResponse.data;
          console.log('📋 Using paginated response data array');
        } else if (Array.isArray(usersResponse)) {
          // Direct array response
          usersData = usersResponse;
          console.log('📋 Using direct response array');
        } else {
          console.warn('⚠️ Unexpected response structure:', usersResponse);
          usersData = [];
        }
        
        console.log(`👥 Total users retrieved: ${usersData.length}`);
        console.log('📋 Users data:', usersData);
        
        if (usersData.length === 0) {
          console.warn('⚠️ No users found in response');
          setUsersError('No users available. Please check if users are properly configured.');
        }
        
        setUsers(usersData);
        setFilteredUsers(usersData);
        console.log('✅ Users state updated successfully');
        
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load users';
        setUsersError(errorMessage);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setUsersLoading(false);
      }

      // Fetch projects for managers (separate from users loading)
      if (user?.role === 'MANAGER' || user?.role === 'ADMIN') {
        try {
          const projectsResponse = await getProjects();
          const projectsData = projectsResponse.data || projectsResponse || [];
          setProjects(projectsData);
          console.log('📁 Projects loaded:', projectsData.length);
        } catch (error) {
          console.error('❌ Error fetching projects:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  // Filter users based on search term - REAL-TIME FILTERING
  useEffect(() => {
    if (!Array.isArray(users)) {
      console.log('⚠️ Users is not an array, setting empty filtered users');
      setFilteredUsers([]);
      return;
    }
    
    // First filter by role - ONLY show users with role "USER"
    const roleFilteredUsers = users.filter(user => {
      const userRole = user.role?.toUpperCase();
      return userRole === 'USER'; // Strictly only users with role "USER"
    });
    
    console.log(`👥 Filtered ${roleFilteredUsers.length} users with role "USER" from ${users.length} total users`);
    
    // Then filter by search term if provided
    if (!userSearchTerm) {
      setFilteredUsers(roleFilteredUsers);
      return;
    }
    
    const term = userSearchTerm.toLowerCase();
    const filtered = roleFilteredUsers.filter(user => {
      const userName = user.name?.toLowerCase() || '';
      const userEmail = user.email?.toLowerCase() || '';
      return userName.includes(term) || userEmail.includes(term);
    });
    
    console.log(`🎯 Filtered ${filtered.length} users from ${users.length} total`);
    setFilteredUsers(filtered);
  }, [users, userSearchTerm]);

  // Handle user selection - Multiple selection support
  const handleUserSelect = (user) => {
    console.log('🔗 Toggling user selection:', user.name, `(${user.email})`);
    console.log('📋 User ID:', user.id);
    console.log('📊 Current selectedUsers:', selectedUsers.map(u => ({ id: u.id, name: u.name })));
    
    // Check if user is already selected (compare by ID)
    const isSelected = selectedUsers.some(selectedUser => selectedUser.id === user.id);
    console.log('🔍 Is user already selected?', isSelected);
    
    let updatedSelectedUsers;
    if (isSelected) {
      // Remove user from selection
      updatedSelectedUsers = selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
      console.log('❌ User removed from selection');
    } else {
      // Add user to selection
      updatedSelectedUsers = [...selectedUsers, user];
      console.log('✅ User added to selection');
    }
    
    console.log('📊 Updated selectedUsers:', updatedSelectedUsers.map(u => ({ id: u.id, name: u.name })));
    
    // Update state
    setSelectedUsers(updatedSelectedUsers);
    
    // Update form value with user IDs
    const userIds = updatedSelectedUsers.map(user => user.id);
    setValue('assigned_user_ids', userIds);
    
    console.log('📊 Form assigned_user_ids:', userIds);
    console.log('📊 New selectedUsers state:', updatedSelectedUsers.map(u => u.name));
    
    // Force a re-render by updating state
    setTimeout(() => {
      console.log('🔄 State after update:', selectedUsers.map(u => ({ id: u.id, name: u.name })));
    }, 100);
  };

  // Handle right-click context menu
  const handleContextMenu = (e, user) => {
    e.preventDefault();
    console.log('🖱️ Right-click on user:', user.name);
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      user: user
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, user: null });
  };

  // Handle random selection
  const handleRandomSelection = (count) => {
    console.log(`🎲 Randomly selecting ${count} users from ${filteredUsers.length} available users`);
    
    // Shuffle and select random users
    const shuffled = [...filteredUsers].sort(() => Math.random() - 0.5);
    const randomUsers = shuffled.slice(0, Math.min(count, filteredUsers.length));
    
    console.log('🎲 Randomly selected users:', randomUsers.map(u => u.name));
    
    // Update selected users
    setSelectedUsers(randomUsers);
    setValue('assigned_user_ids', randomUsers.map(u => u.id));
    
    closeContextMenu();
  };

  // Select all users
  const handleSelectAll = () => {
    console.log('🔘 Selecting all users:', filteredUsers.length);
    setSelectedUsers(filteredUsers);
    setValue('assigned_user_ids', filteredUsers.map(u => u.id));
    closeContextMenu();
  };

  // Clear all selections
  const handleClearAll = () => {
    console.log('🗑️ Clearing all selections');
    setSelectedUsers([]);
    setValue('assigned_user_ids', []);
    closeContextMenu();
  };

  // Get random users function - Fisher-Yates shuffle algorithm
  const getRandomUsers = (users, count) => {
    const arr = [...users];

    // Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count);
  };

  // Handle assign random users button click
  const handleAssignRandomUsers = async (count) => {
    console.log(`🎲 Assigning ${count} random users with role "USER"`);
    
    try {
      // Fetch all users from API
      const usersResponse = await getUsers(100);
      console.log('📊 Users API Response:', usersResponse);
      
      // Handle multiple response structures
      let usersData = [];
      
      if (usersResponse?.success && usersResponse?.data) {
        const innerData = usersResponse.data;
        if (Array.isArray(innerData.data)) {
          usersData = innerData.data;
        } else if (Array.isArray(innerData)) {
          usersData = innerData;
        } else {
          usersData = [];
        }
      } else if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (Array.isArray(usersResponse)) {
        usersData = usersResponse;
      } else {
        usersData = [];
      }
      
      // Filter users by role "USER" only
      const userRoleUsers = usersData.filter(user => {
        const userRole = user.role?.toUpperCase();
        return userRole === 'USER';
      });
      
      console.log(`👥 Found ${userRoleUsers.length} users with role "USER" from ${usersData.length} total users`);
      
      if (userRoleUsers.length === 0) {
        console.warn('⚠️ No users with role "USER" found');
        return;
      }
      
      // Get random users
      const randomUsers = getRandomUsers(userRoleUsers, Math.min(count, userRoleUsers.length));
      console.log('🎲 Randomly selected users:', randomUsers.map(u => u.name));
      
      // Update selected users
      setSelectedUsers(randomUsers);
      setValue('assigned_user_ids', randomUsers.map(u => u.id));
      
      console.log(`✅ Successfully assigned ${randomUsers.length} random users to task`);
      
    } catch (error) {
      console.error('❌ Error fetching users for random assignment:', error);
    }
  };

  // Handle input focus - SHOW ALL USERS with API refresh
  const handleUserInputFocus = async () => {
    console.log('🎯 Search input focused - showing all users');
    setShowUserDropdown(true);
    
    // If users are not loaded yet, try to fetch them
    if (!usersLoading && users.length === 0) {
      console.log('🔄 No users loaded, fetching from API...');
      try {
        setUsersLoading(true);
        const usersResponse = await getUsers(100);
        console.log('📊 Users API Response on focus:', usersResponse);
        
        // Handle multiple response structures:
        let usersData = [];
        
        if (usersResponse?.success && usersResponse?.data) {
          // New structure: {success: true, message: '...', data: {...}}
          const innerData = usersResponse.data;
          if (Array.isArray(innerData.data)) {
            usersData = innerData.data; // Extract the actual users array
            console.log('📋 Using nested response structure: success.data.data');
          } else if (Array.isArray(innerData)) {
            usersData = innerData;
            console.log('📋 Using nested response structure: success.data');
          } else {
            console.warn('⚠️ Invalid nested data structure:', innerData);
            usersData = [];
          }
        } else if (usersResponse?.data && Array.isArray(usersResponse.data)) {
          // Paginated structure: {total, page, limit, data: [...]}
          usersData = usersResponse.data;
          console.log('📋 Using paginated response data array');
        } else if (Array.isArray(usersResponse)) {
          // Direct array response
          usersData = usersResponse;
          console.log('📋 Using direct response array');
        } else {
          console.warn('⚠️ Unexpected response structure:', usersResponse);
          usersData = [];
        }
        
        setUsers(usersData);
        setFilteredUsers(usersData);
        console.log(`✅ Loaded ${usersData.length} users on focus`);
      } catch (error) {
        console.error('❌ Error fetching users on focus:', error);
        setUsersError('Failed to load users. Please try again.');
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setUsersLoading(false);
      }
    } else {
      // Show existing users
      if (Array.isArray(users)) {
        console.log(`📋 Displaying all ${users.length} users from GET /users API`);
        setFilteredUsers(users);
      } else {
        console.log('⚠️ Users not available, setting empty array');
        setFilteredUsers([]);
      }
    }
  };

  // Handle input change - REAL-TIME SEARCH FILTER with multiple selection support
  const handleUserInputChange = (e) => {
    const value = e.target.value;
    console.log('🔍 Search input changed:', value);
    setUserSearchTerm(value);
    setShowUserDropdown(true);
    
    // Don't clear selections when searching - keep dropdown open for multiple selection
  };

  // Get project members for assignment dropdown
  const projectMembers = React.useMemo(() => {
    // Ensure we always return an array
    if (!Array.isArray(users)) return [];
    
    if (!watch('project_id')) return users;
    
    const selectedProject = projects.find(p => p.id === watch('project_id'));
    if (!selectedProject?.members) return users;
    
    const memberIds = selectedProject.members.map(m => m.id || m.user_id);
    return users.filter(u => memberIds.includes(u.id));
  }, [watch('project_id'), projects, users]);

  const onSubmit = async (data) => {
    try {
      setSubmitSuccess(false);

      // Validate user is logged in
      if (!user || !user.id) {
        throw new Error('User not authenticated or user ID missing');
      }

      // Validate project ID
      if (!data.project_id) {
        throw new Error('Project ID is required');
      }

      // Prepare task data - Updated for multiple users
      const taskData = {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: data.priority,
        status: data.status,
        due_date: data.due_date || null,
        project_id: data.project_id,
        assigned_user_ids: data.assigned_user_ids || [], // Array of user IDs
        created_by: user.id
      };

      console.log('📋 Task data being sent:', taskData);
      console.log('📋 Project ID:', data.project_id);
      console.log('📋 User ID:', user.id);
      console.log('📋 User object:', user);

      // Create task via API
      const response = await createTask(taskData);
      console.log('Task created:', response);

      // Extract task ID
      const taskId =
        response?.data?.task_id ||
        response?.data?.id ||
        response?.id;

      if (!taskId) {
        throw new Error("Task ID not returned from API");
      }

      // ✅ ASSIGN MULTIPLE USERS AFTER TASK CREATION
      if (data.assigned_user_ids && data.assigned_user_ids.length > 0) {
        console.log(`🔗 Assigning task to ${data.assigned_user_ids.length} users:`, data.assigned_user_ids);
        
        try {
          // Try bulk assignment first
          const assignmentResponse = await assignTaskToMultipleUsers(taskId, data.assigned_user_ids);
          console.log('✅ Bulk assignment successful:', assignmentResponse);
          
          // Show success message for bulk assignment
          setSubmitMessage(`Task created and assigned to ${data.assigned_user_ids.length} user${data.assigned_user_ids.length > 1 ? 's' : ''} successfully! Redirecting to project details...`);
          
        } catch (bulkError) {
          console.error('❌ Bulk assignment failed, falling back to individual assignments:', bulkError);
          
          // Fallback to individual assignments
          const assignmentPromises = data.assigned_user_ids.map(userId => 
            assignTask(taskId, userId).catch(err => {
              console.error(`❌ Failed to assign task to user ${userId}:`, err);
              return { userId, error: err };
            })
          );
          
          const assignmentResults = await Promise.allSettled(assignmentPromises);
          
          // Log assignment results
          const successfulAssignments = assignmentResults.filter(result => result.status === 'fulfilled').length;
          const failedAssignments = assignmentResults.filter(result => result.status === 'rejected').length;
          
          console.log(`✅ Successfully assigned task to ${successfulAssignments} users`);
          if (failedAssignments > 0) {
            console.log(`❌ Failed to assign task to ${failedAssignments} users`);
          }
          
          // Show detailed success/failure message
          if (successfulAssignments > 0 && failedAssignments === 0) {
            setSubmitMessage(`Task created and assigned to ${successfulAssignments} user${successfulAssignments > 1 ? 's' : ''} successfully! Redirecting to project details...`);
          } else if (successfulAssignments > 0 && failedAssignments > 0) {
            setSubmitMessage(`Task created! Assigned to ${successfulAssignments} user${successfulAssignments > 1 ? 's' : ''} successfully, ${failedAssignments} assignment${failedAssignments > 1 ? 's' : ''} failed. Redirecting to project details...`);
          } else {
            setSubmitMessage(`Task created but failed to assign to any users. Redirecting to project details...`);
          }
        }
      } else {
        setSubmitMessage('Task created successfully! Redirecting to project details...');
      }
      console.log('Task created successfully:', response);

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      reset();
      
      // Navigate back to project details page after successful task creation
      setTimeout(() => {
        if (projectId) {
          console.log(`🔗 Navigating to project details page: /projects/${projectId}`);
          navigate(`/projects/${projectId}`, { 
            state: { message: submitMessage || 'Task created successfully!' }
          });
        } else {
          console.log('🔗 No project ID, navigating to tasks page: /tasks');
          navigate('/tasks');
        }
      }, 2000);

    } catch (err) {
      console.error('❌ Error creating task:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error headers:', err.response?.headers);
      
      // Log the task data that was sent for debugging
      console.error('❌ Task data that failed:', taskData);
      
      // Handle API errors
      if (err.response?.data?.message) {
        setError('api', { message: err.response.data.message });
      } else if (err.response?.data?.error) {
        setError('api', { message: err.response.data.error });
      } else if (err.response?.data) {
        setError('api', { message: JSON.stringify(err.response.data) });
      } else {
        setError('api', { message: 'Failed to create task. Please try again.' });
      }
      setSubmitSuccess(false);
    }
  };

  const handleCancel = () => {
    console.log('❌ Cancel clicked - navigating back to project details');
    if (projectId) {
      console.log(`🔗 Navigating to project details page: /projects/${projectId}`);
      navigate(`/projects/${projectId}`);
    } else {
      console.log('🔗 No project ID, navigating to tasks page: /tasks');
      navigate('/tasks');
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="create-task-container">
      <Card variant="default" shadow="md" className="create-task-header">
        <CardBody className="create-task-header-body">
          <Button onClick={handleCancel} variant="ghost" size="sm" className="back-btn">
            ← Back
          </Button>
          <CardTitle className="page-title">Create New Task</CardTitle>
        </CardBody>
      </Card>

      <Card variant="primary" shadow="lg" className="create-task-form">
        <CardBody className="create-task-form-body">
          {submitSuccess && (
            <div className={cn("success-message", styles.successAlert)}>
              <div className="success-icon">✓</div>
              <p>{submitMessage || 'Task created successfully! Redirecting...'}</p>
            </div>
          )}

          {errors.api && (
            <div className={cn("error-message", styles.errorAlert)}>
              <div className="error-icon">⚠</div>
              <p>{errors.api.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title Field */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Task Title <span className="required">*</span>
              </label>
            <input
              type="text"
              id="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
              {...register('title', {
                required: 'Task title is required',
                minLength: {
                  value: 3,
                  message: 'Task title must be at least 3 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Task title must not exceed 100 characters'
                }
              })}
            />
            {errors.title && (
              <span className="field-error">{errors.title.message}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Enter task description (optional)"
              rows="4"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must not exceed 500 characters'
                }
              })}
            />
            {errors.description && (
              <span className="field-error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-row">
            {/* Priority Field */}
            <div className="form-group">
              <label htmlFor="priority" className="form-label">
                Priority <span className="required">*</span>
              </label>
              <select
                id="priority"
                className={`form-select ${errors.priority ? 'error' : ''}`}
                {...register('priority', {
                  required: 'Priority is required'
                })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              {errors.priority && (
                <span className="field-error">{errors.priority.message}</span>
              )}
            </div>

            {/* Status Field */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                className={`form-select ${errors.status ? 'error' : ''}`}
                {...register('status', {
                  required: 'Status is required'
                })}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              {errors.status && (
                <span className="field-error">{errors.status.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Due Date Field */}
            <div className="form-group">
              <label htmlFor="due_date" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                className={`form-input ${errors.due_date ? 'error' : ''}`}
                min={today}
                {...register('due_date', {
                  validate: value => {
                    if (!value) return true; // Optional field
                    const selectedDate = new Date(value);
                    const todayDate = new Date(today);
                    return selectedDate >= todayDate || 'Due date cannot be in the past';
                  }
                })}
              />
              {errors.due_date && (
                <span className="field-error">{errors.due_date.message}</span>
              )}
            </div>

            {/* Project Field */}
            <div className="form-group">
              <label htmlFor="project_id" className="form-label">
                Project <span className="required">*</span>
              </label>
              {projectId ? (
                <div className="selected-project">
                  <strong>Project:</strong> {projects.find(p => p.id === projectId)?.name || 'Loading project...'}
                  <input type="hidden" {...register('project_id')} />
                </div>
              ) : (
                <select
                id="assigned_user_id"
                className={`form-select ${errors.assigned_user_id ? 'error' : ''}`}
                {...register('assigned_user_id')}
              >
                <option value="">Unassigned</option>

                {Array.isArray(users) && users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              )}
              {errors.project_id && (
                <span className="field-error">{errors.project_id.message}</span>
              )}
            </div>
          </div>

          {/* Assigned User Field */}
          <div className="form-group">
            <label htmlFor="assigned_user_ids" className="form-label">
              Assigned To
            </label>
            
            {/* Assign Task Button */}
            <div className="user-assign-container">
              <button
                type="button"
                className="assign-task-btn"
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  if (!showUserDropdown && users.length === 0) {
                    handleUserInputFocus(); // Load users if not loaded
                  }
                }}
              >
                <span className="assign-icon">👥</span>
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} selected` 
                  : 'Assign Task to Users'
                }
                <span className="dropdown-arrow">{showUserDropdown ? '▲' : '▼'}</span>
              </button>
              
              <input
                type="hidden"
                {...register('assigned_user_ids')}
              />
              
              {/* Users Table Modal */}
              {showUserDropdown && (
                <div className="users-modal-overlay">
                  <div className="users-modal-container">
                    <div className="users-modal-header">
                      <h3>👥 Select Users (Role: USER Only) - Right-click for options</h3>
                      <button
                        type="button"
                        className="modal-close-btn"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="users-search-section">
                      <input
                        type="text"
                        className="users-search-input"
                        placeholder="Search users by name or email... (Select 0, 1, or multiple users as needed)"
                        value={userSearchTerm}
                        onChange={handleUserInputChange}
                        onFocus={handleUserInputFocus}
                      />
                      <div className="search-results-info">
                        {userSearchTerm ? `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found matching "${userSearchTerm}"` : `Showing ALL ${users.length} user${users.length !== 1 ? 's' : ''} - Select any number of users (0, 1, 2, 10, etc.)`}
                      </div>
                    </div>
                    
                    {/* Users Table */}
                    <div className="users-table-section">
                      {usersLoading ? (
                        <div className="loading-state">
                          <div className="spinner"></div>
                          <p>Loading users...</p>
                        </div>
                      ) : usersError ? (
                        <div className="error-state">
                          <span className="error-icon">⚠️</span>
                          <p>{usersError}</p>
                        </div>
                      ) : (
                        <div className="users-table-wrapper">
                          <table className="users-table">
                            <thead>
                              <tr>
                                <th className="select-col">
                                  <input
                                    type="checkbox"
                                    className="select-all-checkbox"
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={() => {
                                      if (selectedUsers.length === filteredUsers.length) {
                                        // Deselect all
                                        setSelectedUsers([]);
                                        setValue('assigned_user_ids', []);
                                        console.log('❌ Deselected all users');
                                      } else {
                                        // Select all
                                        setSelectedUsers(filteredUsers);
                                        const userIds = filteredUsers.map(user => user.id);
                                        setValue('assigned_user_ids', userIds);
                                        console.log('✅ Selected all users:', userIds);
                                      }
                                    }}
                                    disabled={filteredUsers.length === 0}
                                  />
                                  <div className="select-all-label">Select All</div>
                                </th>
                                <th className="sr-no-col">Sr. No.</th>
                                <th className="name-col">Name</th>
                                <th className="email-col">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                  <tr 
                                    key={user.id} 
                                    className={selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'selected-row' : ''}
                                    onContextMenu={(e) => handleContextMenu(e, user)}
                                  >
                                    <td className="select-col">
                                      <input
                                        type="checkbox"
                                        className="user-checkbox"
                                        checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                                        onChange={() => handleUserSelect(user)}
                                      />
                                    </td>
                                    <td className="sr-no-col">{index + 1}</td>
                                    <td className="name-col">{user.name}</td>
                                    <td className="email-col">{user.email}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr key="no-users">
                                  <td colSpan="4" className="no-users-row">
                                    {userSearchTerm ? 'No users found matching your search' : 'No users available'}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer with Selection Info and Done Button */}
                    <div className="users-modal-footer">
                      <div className="selection-info">
                        <span className="selection-count">
                          {selectedUsers.length === 0 
                            ? 'No users selected (Task will be unassigned)' 
                            : `${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''} selected`
                          }
                        </span>
                        {selectedUsers.length > 0 && (
                          <span className="selected-users-list">
                            {selectedUsers.slice(0, 3).map(user => user.name).join(', ')}
                            {selectedUsers.length > 3 && ` +${selectedUsers.length - 3} more`}
                          </span>
                        )}
                        {selectedUsers.length === 0 && (
                          <span className="no-selection-hint">
                            You can assign this task later if needed
                          </span>
                        )}
                      </div>
                      <div className="footer-actions">
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="done-btn"
                          onClick={() => {
                            setShowUserDropdown(false);
                            console.log(`✅ Selected ${selectedUsers.length} users for assignment`);
                          }}
                          disabled={selectedUsers.length === 0}
                        >
                          Done ({selectedUsers.length})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Users Display */}
            {selectedUsers.length > 0 && (
              <div className="selected-users-summary">
                <div className="summary-header">
                  <strong>Selected Users ({selectedUsers.length}):</strong>
                  <button
                    type="button"
                    className="clear-selection-btn"
                    onClick={() => {
                      setSelectedUsers([]);
                      setValue('assigned_user_ids', []);
                      setUserSearchTerm('');
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="selected-users-chips">
                  {selectedUsers.map(user => (
                    <div key={user.id} className="user-chip">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                      <button
                        type="button"
                        className="remove-user-btn"
                        onClick={() => handleUserSelect(user)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.assigned_user_ids && (
              <span className="field-error">{errors.assigned_user_ids.message}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            {/* Random Assignment Buttons */}
            <div className="random-assignment-buttons">
              <button
                type="button"
                className="random-btn"
                onClick={() => handleAssignRandomUsers(2)}
                disabled={isSubmitting}
                title="Assign 2 random users with role USER"
              >
                🎲 Assign 2 Random
              </button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleAssignRandomUsers(3)}
                disabled={isSubmitting}
                title="Assign 3 random users with role USER"
                className="random-btn"
              >
                🎲 Assign 3 Random
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleAssignRandomUsers(5)}
                disabled={isSubmitting}
                title="Assign 5 random users with role USER"
                className="random-btn"
              >
                🎲 Assign 5 Random
              </Button>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || submitSuccess}
              loading={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
        </CardBody>
      </Card>

      {/* Context Menu for Right-Click Options */}
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={closeContextMenu}
        >
          <div className="context-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="context-menu-header">
              <strong>{contextMenu.user?.name}</strong>
              <span className="context-menu-role">({contextMenu.user?.role})</span>
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={() => handleUserSelect(contextMenu.user)}>
              <span className="menu-icon">✓</span>
              Select This User
            </div>
            <div className="context-menu-item" onClick={() => handleRandomSelection(1)}>
              <span className="menu-icon">🎲</span>
              Select 1 Random User
            </div>
            <div className="context-menu-item" onClick={() => handleRandomSelection(3)}>
              <span className="menu-icon">🎲</span>
              Select 3 Random Users
            </div>
            <div className="context-menu-item" onClick={() => handleRandomSelection(5)}>
              <span className="menu-icon">🎲</span>
              Select 5 Random Users
            </div>
            <div className="context-menu-item" onClick={() => handleRandomSelection(10)}>
              <span className="menu-icon">🎲</span>
              Select 10 Random Users
            </div>
            <div className="context-menu-divider"></div>
            <div className="context-menu-item" onClick={handleSelectAll}>
              <span className="menu-icon">☑</span>
              Select All Users
            </div>
            <div className="context-menu-item" onClick={handleClearAll}>
              <span className="menu-icon">✕</span>
              Clear All Selections
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
