import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminProjects } from '../../hooks/useAdmin';
import { useAdmin } from '../../context/AdminContext';
import './AdminProjects.css';

const AdminProjects = () => {
  const navigate = useNavigate();
  const { projects, loading, error, refetch } = useAdminProjects();
  const { actions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleProjectClick = useCallback((projectId) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  const handleDeleteProject = useCallback(async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // This would call delete API, for now just optimistic update
        actions.deleteProject(projectId);
        console.log('Project deleted:', projectId);
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  }, [actions]);

  const handleEditProject = useCallback((projectId) => {
    navigate(`/projects/${projectId}/edit`);
  }, [navigate]);

  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => project.status === filterStatus);
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
  }, [projects, searchTerm, filterStatus, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';
      case 'completed': return '#059669';
      case 'planned': return '#6b7280';
      case 'on-hold': return '#f59e0b';
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
      <div className="admin-projects-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-projects-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Projects</h3>
        <p>{error}</p>
        <button onClick={refetch} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <h1>All Projects</h1>
        <p>Manage and monitor all projects in the system</p>
      </div>

      {/* Filters and Controls */}
      <div className="projects-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects by name or description..."
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
            <option value="PLANNED">Planned</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON-HOLD">On Hold</option>
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
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="updated_at-desc">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredAndSortedProjects.length > 0 ? (
          filteredAndSortedProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                <span 
                  className="project-status"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.status}
                </span>
              </div>
              
              <p className="project-description">
                {project.description || 'No description available'}
              </p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(project.created_at)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tasks:</span>
                  <span className="meta-value">{project.task_count || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Team:</span>
                  <span className="meta-value">{project.member_count || 0} members</span>
                </div>
              </div>
              
              <div className="project-actions">
                <button
                  onClick={() => handleProjectClick(project.id)}
                  className="view-btn"
                  title="View project details"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEditProject(project.id)}
                  className="edit-btn"
                  title="Edit project"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="delete-btn"
                  title="Delete project"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <div className="empty-icon">📁</div>
            <h3>No Projects Found</h3>
            <p>
              {searchTerm 
                ? 'No projects match your search criteria.' 
                : 'No projects are available in the system.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="projects-summary">
        <div className="summary-item">
          <span className="summary-label">Total Projects:</span>
          <span className="summary-value">{projects.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Filtered Results:</span>
          <span className="summary-value">{filteredAndSortedProjects.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
