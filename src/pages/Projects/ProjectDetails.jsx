import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  getProjectById, 
  getMembers, 
  addMembers, 
  removeMember,
  updateProject,
  deleteProject
} from "../../api/project.api";
import { getProjectTasks, getTasks } from "../../api/task.api";
import { getUsers } from "../../api/user.api";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { fetchProjectById, updateProject: updateProjectDetails } = useProjects();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMemberId, setNewMemberId] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [editingProject, setEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // On mount, perform API calls according to specification
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching project data for ID:', id);
        
        // Use the enhanced hook to fetch project details
        const projectData = await fetchProjectById(id);
        console.log('Project API Response:', projectData);
        
        // GET /api/v1/projects/:projectId/tasks (List of tasks) - Handle 404 gracefully
        try {
          const tasksResponse = await getProjectTasks(id);
          console.log('Tasks API Response:', tasksResponse);
          setTasks(tasksResponse.data || tasksResponse || []);
        } catch (taskErr) {
          console.warn('Tasks endpoint not available (404), trying fallback to all tasks');
          // Fallback: Get all tasks and filter by project_id
          try {
            const allTasksResponse = await getTasks();
            const allTasks = allTasksResponse.data || allTasksResponse || [];
            const projectTasks = Array.isArray(allTasks) 
              ? allTasks.filter(task => task.project_id === id)
              : [];
            setTasks(projectTasks);
            console.log('Fallback: Filtered tasks for project:', projectTasks);
          } catch (fallbackErr) {
            console.warn('Fallback also failed, setting empty tasks array');
            setTasks([]); // Set empty tasks array if both endpoints fail
          }
        }
        
        // GET /api/v1/projects/:projectId/members (Team members) - Handle 404 gracefully
        try {
          const membersResponse = await getMembers(id);
          console.log('Members API Response:', membersResponse);
          setMembers(membersResponse.data || membersResponse || []);
        } catch (memberErr) {
          console.warn('Members endpoint not available (404), setting empty members array');
          setMembers([]); // Set empty members array if endpoint doesn't exist
        }
        
        // GET /api/v1/users (for member dropdown)
        try {
          const usersResponse = await getUsers();
          console.log('Users API Response:', usersResponse);
          const usersData = usersResponse.data || usersResponse || [];
          // Ensure usersData is always an array
          setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (usersErr) {
          console.warn('Users endpoint not available, using empty array');
          setUsers([]);
        }
        
        // Set data based on API response structure
        setProject(projectData);
        
      } catch (err) {
        console.error('Error fetching project data:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          url: `/api/v1/projects/${id}`
        });
        
        // Handle different error types with user-friendly messages
        if (err.response?.status === 404) {
          setError('Project not found. Please check the project ID and try again.');
        } else if (err.response?.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view this project.');
        } else {
          setError(`Failed to load project details: ${err.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, fetchProjectById]);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        // Clear the location state
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Handle project editing (Manager only)
  const handleEditProject = useCallback(() => {
    if (!project) return;
    
    setEditForm({
      name: project.name || '',
      description: project.description || '',
      startDate: project.start_date || project.startDate || '',
      endDate: project.end_date || project.endDate || '',
      status: project.status || 'PLANNED'
    });
    setEditingProject(true);
    setError(null);
  }, [project]);

  // Handle project update (Manager only)
  const handleUpdateProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Updating project with data:', editForm);
      console.log('🆔 Project ID:', id);
      
      // Prepare update data - match backend expected format
      const updateData = {
        name: editForm.name?.trim() || '',
        description: editForm.description?.trim() || '',
        startDate: editForm.start_date,  // ✅ FIXED: backend expects startDate
        endDate: editForm.end_date,      // ✅ FIXED: backend expects endDate
        status: editForm.status || 'PLANNED'
      };
      
      console.log('📋 Prepared update data:', updateData);
      
      // Validate required fields
      if (!updateData.name || updateData.name.length < 3) {
        setError('Project name must be at least 3 characters long');
        setLoading(false);
        return;
      }
      
      if (!updateData.description || updateData.description.length < 10) {
        setError('Project description must be at least 10 characters long');
        setLoading(false);
        return;
      }
      
      // Direct API call to PUT /projects/:projectId
      const response = await updateProject(id, updateData);
      console.log('✅ Project update response:', response);
      
      // Update local state
      setProject(response.data || response);
      setEditingProject(false);
      
      // Show success message
      setSuccessMessage('Project updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('❌ Error updating project:', err);
      console.error('🚨 Full Error Response:', {
        status: err.response?.status,
        data: err.response?.data,
        config: err.response?.config
      });
      
      // Enhanced error handling
      let errorMessage = 'Failed to update project. Please try again.';
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (errorData?.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          } else if (typeof errorData.errors === 'object') {
            errorMessage = Object.values(errorData.errors).join(', ');
          }
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = `Validation error: ${JSON.stringify(errorData)}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, editForm]);

  // Handle project deletion (Manager only)
  const handleDeleteProject = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Deleting project:', id);
      
      // DELETE /api/v1/projects/:projectId
      await deleteProject(id);
      console.log('Project deleted successfully');
      
      // Navigate back to projects list
      navigate('/projects');
      
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(`Failed to delete project: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  }, [id, navigate]);
  const handleRemoveMember = useCallback(async (userId) => {
    try {
      setRemovingMemberId(userId);
      
      console.log(' Removing member:', userId);
      console.log(' From project:', id);
      
      await removeMember(id, userId);
      
      console.log(' Member removed successfully');
      
      // Implement optimistic UI updates for member removal so user doesn't see a loading lag
      setMembers(prev => prev.filter(member => 
        (member.user_id !== userId && member.id !== userId)
      ));
      console.log(' Member list updated optimistically');
      
    } catch (err) {
      console.error(' Error removing member:', err);
      console.error(' Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: `/api/v1/projects/${id}/members/${userId}`
      });
      
      // Set specific error messages
      if (err.response?.status === 404) {
        setError('Project or member not found.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to remove members.');
      } else {
        setError(`Failed to remove member: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setRemovingMemberId(null);
    }
  }, [id]);

  // Add an 'Add Member' section with dropdown selection and POST to /api/v1/projects/:projectId/members
  const handleAddMember = useCallback(async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to add as member');
      return;
    }

    // Check if selected users are already members
    const existingMemberIds = Array.isArray(members) ? members.map(member => member.user_id || member.id) : [];
    const newUsers = selectedUsers.filter(userId => !existingMemberIds.includes(userId));
    
    if (newUsers.length === 0) {
      setError('Selected users are already members of this project');
      return;
    }

    try {
      setAddingMember(true);
      setError(null);
      
      console.log('Adding members to project:', id);
      console.log('User IDs:', newUsers);
      
      const response = await addMembers(id, newUsers);
      console.log('Member addition response:', response);
      
      // Refresh members list after adding
      try {
        const updatedMembers = await getMembers(id);
        setMembers(updatedMembers.data || updatedMembers || []);
      } catch (refreshErr) {
        console.warn('Failed to refresh members list:', refreshErr.message);
        // Optimistic update as fallback
        const newMemberDetails = newUsers.map(userId => {
          const user = users.find(u => u.id === userId);
          return {
            id: userId,
            user_id: userId,
            name: user?.name || 'Unknown User',
            email: user?.email || 'unknown@example.com',
            role: 'MEMBER'
          };
        });
        setMembers(prev => [...prev, ...newMemberDetails]);
      }
      
      setSelectedUsers([]);
      console.log('Members added successfully');
      
    } catch (err) {
      console.error('Error adding members:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        requestData: { userIds: newUsers }
      });
      
      // Set specific error messages
      if (err.response?.status === 404) {
        setError('Project not found or member endpoint not available.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to add members.');
      } else if (err.response?.status === 400) {
        setError('Invalid user IDs or members already exist.');
      } else {
        setError(`Failed to add members: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setAddingMember(false);
    }
  }, [id, selectedUsers, members, users]);

  // Check if current user is manager or project creator
  const canManageProject = user?.role === 'MANAGER' || user?.id === project?.created_by;

  // Navigation to create task page with API pre-fetch
  const handleCreateTask = useCallback(() => {
    // Pre-validate project access before navigation
    if (!canManageProject) {
      setError('You do not have permission to create tasks for this project');
      return;
    }
    
    if (!isProjectActive()) {
      setError('Cannot create tasks for inactive or completed projects');
      return;
    }
    
    console.log('Navigating to create task for project:', id);
    // Navigate to project-specific create task page
    navigate(`/projects/${id}/tasks/create`);
  }, [id, canManageProject, navigate, project]);

  // Navigation to project tasks page with API validation
  const handleViewTasks = useCallback(() => {
    // Pre-validate project access
    if (!project) {
      setError('Project information not available');
      return;
    }
    
    console.log('Navigating to project tasks for:', id);
    console.log('Current tasks count:', Array.isArray(tasks) ? tasks.length : 0);
    
    // If tasks endpoint doesn't exist or no tasks, show appropriate message and navigate anyway
    if ((!Array.isArray(tasks) || tasks.length === 0) && !loading) {
      // Still navigate but let the tasks page handle the empty state
      console.log('No tasks available, navigating to tasks page for empty state handling');
      navigate(`/projects/${id}/tasks`);
      return;
    }
    
    // Navigate to project tasks page with existing tasks
    navigate(`/projects/${id}/tasks`);
  }, [id, project, tasks, loading, navigate]);

  // Navigation to member management page with API pre-fetch
  const handleManageMembers = useCallback(() => {
    // Pre-validate project access
    if (!canManageProject) {
      setError('You do not have permission to manage project members');
      return;
    }
    
    console.log('Navigating to member management for project:', id);
    console.log('Current members count:', Array.isArray(members) ? members.length : 0);
    
    // Navigate to project members page
    navigate(`/projects/${id}/members`);
  }, [id, canManageProject, navigate, members]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Get status color for UI
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';  // green
      case 'completed': return '#10b981'; // green  
      case 'planned': return '#6b7280';  // grey
      case 'pending': return '#f59e0b';  // yellow
      case 'on-hold': return '#6b7280'; // grey
      default: return '#6b7280';
    }
  };

  // Check if project is active (not ended)
  const isProjectActive = () => {
    if (!project?.end_date) return true;
    return new Date(project.end_date) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-t-2 border-gray-900 border-t-transparent border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h3>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-container">
      {/* Success Message */}
      {successMessage && (
        <div className="ps-success-notification">
          <div className="ps-success-content">
            <div className="ps-success-icon">✓</div>
            <span className="ps-success-message">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ps-success-close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="ps-header">
        <div className="ps-header-content">
          {/* Back Arrow */}
          <button 
            onClick={() => navigate('/projects')}
            className="ps-back-arrow"
            title="Back to Projects"
          >
            ←
          </button>
          
          <div>
            <h1 className="ps-title">{project.name}</h1>
            <p className="ps-subtitle">{project.description}</p>
          </div>
          {canManageProject && (
            <div className="ps-header-actions">
              <button 
                className="ps-edit-btn" 
                onClick={handleEditProject}
                disabled={editingProject}
              >
                {editingProject ? 'Editing...' : '✏️ Edit Project'}
              </button>
              <button 
                className="ps-assign-btn" 
                onClick={() => navigate(`/projects/${id}/assign-members`)}
                disabled={loading}
              >
                👥 Assign Members
              </button>
              <button 
                className="ps-manage-btn" 
                onClick={() => navigate(`/projects/${id}/manage-members`)}
                disabled={loading}
              >
                📋 Manage Members
              </button>
              <button 
                className="ps-delete-btn" 
                onClick={handleDeleteProject}
                disabled={loading}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingProject && (
        <div className="ps-edit-modal">
          <div className="ps-edit-modal-content">
            <div className="ps-edit-modal-header">
              <h3>Edit Project</h3>
              <button 
                className="ps-close-modal-btn" 
                onClick={() => setEditingProject(false)}
              >
                ×
              </button>
            </div>
            
            <div className="ps-edit-form">
              <div className="ps-form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="ps-form-input"
                />
              </div>

              <div className="ps-form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="ps-form-textarea"
                  rows="3"
                />
              </div>

              <div className="ps-form-row">
                <div className="ps-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                    className="ps-form-input"
                  />
                </div>

                <div className="ps-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                    className="ps-form-input"
                  />
                </div>
              </div>

              <div className="ps-form-group">
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="ps-form-select"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON-HOLD">On Hold</option>
                </select>
              </div>

              <div className="ps-form-actions">
                <button 
                  className="ps-cancel-btn" 
                  onClick={() => setEditingProject(false)}
                >
                  Cancel
                </button>
                <button 
                  className="ps-save-btn" 
                  onClick={handleUpdateProject}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Info Card */}
      <div className="ps-card">
        <div className="ps-grid">
          <div>
            <label>Start Date</label>
            <div>{formatDate(project.start_date)}</div>
          </div>

          <div>
            <label>End Date</label>
            <div>{formatDate(project.end_date)}</div>
          </div>

          <div>
            <label>Status</label>
            <span className="ps-status">{project.status}</span>
          </div>

          <div>
            <label>Created</label>
            <div>{formatDate(project.created_at)}</div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="ps-card">
        <h3 className="ps-section-title">Assign Team Members</h3>

        {/* User Dropdown for Adding Members */}
        {/* <div className="ps-member-management">
          <div className="ps-dropdown-container">
            <label className="ps-dropdown-label">Add Members:</label>
            <select
              multiple
              value={selectedUsers}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedUsers(values);
              }}
              className="ps-multi-select"
              disabled={addingMember || users.length === 0}
            >
              <option value="" disabled>
                {users.length === 0 ? "Loading users..." : "Select users to add..."}
              </option>
              {Array.isArray(users) && users
                .filter(user => {
                  const existingMemberIds = Array.isArray(members) ? members.map(member => member.user_id || member.id) : [];
                  return !existingMemberIds.includes(user.id);
                })
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>
          
          <button 
            onClick={handleAddMember} 
            disabled={addingMember || selectedUsers.length === 0}
            className="ps-add-btn"
          >
            {addingMember ? "Adding..." : `Add ${selectedUsers.length > 0 ? `${selectedUsers.length} Member${selectedUsers.length > 1 ? 's' : ''}` : 'Members'}`}
          </button>
        </div> */}

        {/* Members List */}
        <div className="ps-member-list">
          <div className="ps-member-header">
            <h4 className="ps-member-list-title">Current Members ({Array.isArray(members) ? members.length : 0})</h4>
            {canManageProject && (
              <button 
                onClick={handleManageMembers}
                className="ps-manage-btn"
                title="Manage all project members"
              >
                Manage Members
              </button>
            )}
          </div>
          {/* {Array.isArray(members) && members.length > 0 ? (
            <div className="ps-member-grid">
              {members.map((member) => (
                <div key={member.id || member.user_id} className="ps-member-card">
                  <div className="ps-member-info">
                    <div className="ps-member-avatar">
                      {member.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="ps-member-details">
                      <div className="ps-member-name">
                        {member.name || member.username || "Unknown User"}
                      </div>
                      <div className="ps-member-email">
                        {member.email || 'No email'}
                      </div>
                      <div className="ps-member-role">
                        {member.role || 'MEMBER'}
                      </div>
                    </div>
                  </div>
                  
                  {canManageProject && (
                    <button
                      onClick={() => handleRemoveMember(member.id || member.user_id)}
                      disabled={removingMemberId === (member.id || member.user_id)}
                      className="ps-remove-btn"
                      title="Remove member"
                    >
                      {removingMemberId === (member.id || member.user_id) ? "Removing..." : "×"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="ps-no-members">
              <p>No members assigned to this project yet.</p>
              <p>Use the dropdown above to add team members.</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="ps-card">
        <div className="ps-flex">
          <h3 className="ps-section-title">Tasks</h3>

          <div className="ps-task-actions">
            {canManageProject && (
              <button className="ps-primary-btn" onClick={handleCreateTask}>
                + Create Task
              </button>
            )}
            <button className="ps-secondary-btn" onClick={handleViewTasks}>
              View Tasks
            </button>
          </div>
        </div>

        {Array.isArray(tasks) && tasks.length > 0 ? (
          <div className="ps-task-list">
            {tasks.map((task) => (
              <div key={task.id || task.task_id} className="ps-task-card">
                <div className="ps-task-top">
                  <h4>{task.title || task.name}</h4>
                  <span className="ps-status">{task.status}</span>
                </div>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="ps-empty">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;