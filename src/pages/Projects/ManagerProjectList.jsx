import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { projectAPI } from '../../api/project.api';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../../components/common/Card';
import { cn } from '../../utils';
import './ManagerProjectList.css';

const ManagerProjectList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, [filterStatus, currentPage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await projectAPI.getProjects(params);
      setProjects(response.data.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId) => {
    console.log('🔗 Navigating to project details for project:', projectId);
    
    try {
      // Fetch single project details using GET /projects/:projectId
      console.log('📡 Fetching project details...');
      const projectDetails = await projectAPI.getProjectById(projectId);
      console.log('✅ Project details fetched:', projectDetails);
      
      // Navigate to project details page
      navigate(`/projects/${projectId}`, { 
        state: { 
          projectDetails: projectDetails,
          fromRecentProjects: true 
        } 
      });
    } catch (error) {
      console.error('❌ Error fetching project details:', error);
      // Still navigate even if API call fails
      navigate(`/projects/${projectId}`);
    }
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    
    try {
      const response = await projectAPI.createProject(createForm);
      const newProject = response.data.data || response.data;
      setProjects([newProject, ...projects]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'active'
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditProject = (projectId, e) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        setProjects(projects.filter(project => project.project_id !== projectId));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete project');
      }
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'on_hold':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="manager-project-list">
        <Card variant="default" shadow="md" className="loading-card">
          <CardBody className="loading-body">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-project-list">
        <Card variant="error" shadow="md" className="error-card">
          <CardBody className="error-body">
            <div className="error-container">
              <p>{error}</p>
              <Button onClick={fetchProjects} variant="primary" size="md">Retry</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="manager-project-list">
      <Card variant="default" shadow="md" className="project-header">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Manage and track all your projects</CardDescription>
        </CardHeader>
      </Card>

      <div className="project-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <Button className="create-project-btn" onClick={handleCreateProject} variant="primary" size="md">
          <span className="btn-icon">➕</span>
          Create Project
        </Button>
      </div>

      <Card variant="default" shadow="md" className="projects-table-container">
        <CardBody className="projects-table-body">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Status</th>
              <th>Members</th>
              <th>Tasks</th>
              <th>Progress</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.project_id} className="project-row">
                <td className="project-name-cell">
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="members-cell">
                  <span className="member-count">{project.member_count || 0}</span>
                </td>
                <td className="tasks-cell">
                  <span className="task-count">{project.task_count || 0}</span>
                </td>
                <td className="progress-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress || 0}%</span>
                </td>
                <td className="deadline-cell">
                  <span className="deadline-text">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
                  </span>
                </td>
                <td className="actions-cell">
                  <Button 
                    className="action-btn view" 
                    onClick={() => navigate(`/projects/${project.project_id}`)}
                    variant="ghost"
                    size="sm"
                    title="View Project"
                  >
                    👁️
                  </Button>
                  <Button 
                    className="action-btn edit" 
                    onClick={() => navigate(`/projects/${project.project_id}/edit`)}
                    variant="ghost"
                    size="sm"
                    title="Edit Project"
                  >
                    ✏️
                  </Button>
                  <Button 
                    className="action-btn delete" 
                    onClick={(e) => handleDeleteProject(project.project_id, e)}
                    variant="danger"
                    size="sm"
                    title="Delete Project"
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </CardBody>
      </Card>

      {filteredProjects.length === 0 && (
        <Card variant="default" shadow="sm" className="empty-state">
          <CardBody className="empty-body">
            <div className="empty-content">
              <div className="empty-icon">📁</div>
              <h3>No projects found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first project to get started'}
              </p>
              <Button className="create-first-btn" onClick={handleCreateProject} variant="primary" size="md">
                Create Your First Project
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="create-form">
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateInputChange}
                  required
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateInputChange}
                  placeholder="Enter project description"
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={createForm.start_date}
                    onChange={handleCreateInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={createForm.end_date}
                    onChange={handleCreateInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={createForm.status}
                  onChange={handleCreateInputChange}
                >
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProjectList;
