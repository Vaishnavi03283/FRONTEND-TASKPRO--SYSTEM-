import React, { useState, useMemo } from "react";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/common/ProjectCard";
import CreateProject from "./CreateProject";
import { useNavigate } from "react-router-dom";
import "./ProjectsList.css";

const ProjectsList = () => {
  const { projects, addProject, removeProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Enhanced memoized filtered projects with better debugging
  const filteredProjects = useMemo(() => {
    console.log('🔍 Filtering projects:', {
      totalProjects: projects.length,
      searchQuery: searchQuery || 'none',
      statusFilter: statusFilter || 'none'
    });

    if (!Array.isArray(projects)) {
      console.warn('⚠️ Projects is not an array:', projects);
      return [];
    }

    const filtered = projects.filter(project => {
      // Safety checks for project object
      if (!project || typeof project !== 'object') {
        console.warn('⚠️ Invalid project object:', project);
        return false;
      }

      // Enhanced search for project name (case-insensitive)
      const projectName = project.name || project.project_name || '';
      const matchesSearch = !searchQuery || 
        searchQuery.trim() === '' || 
        projectName.toLowerCase().includes(searchQuery.toLowerCase());

      // Enhanced status filter with multiple status formats
      const projectStatus = project.status || '';
      const normalizedStatus = projectStatus.toLowerCase().replace('_', '-');
      const normalizedFilter = statusFilter.toLowerCase().replace('_', '-');
      const matchesStatus = statusFilter === 'all' || normalizedStatus === normalizedFilter;

      const result = matchesSearch && matchesStatus;
      
      // Debug logging for active filters
      if (searchQuery || statusFilter !== 'all') {
        console.log(`📋 Project "${projectName}":`, {
          matchesSearch,
          matchesStatus,
          result,
          projectStatus: projectStatus || 'none',
          searchQuery: searchQuery || 'none',
          statusFilter
        });
      }

      return result;
    });

    console.log('✅ Filtered result:', filtered.length, 'projects');
    return filtered;
  }, [projects, searchQuery, statusFilter]);

  const handleViewProject = (projectId) => {
    console.log("🔍 Viewing project:", projectId);
    navigate(`/projects/${projectId}`);
  };

  const handleAssignProject = (projectId) => {
    console.log("� Viewing project tasks:", projectId);
    navigate(`/projects/${projectId}/tasks`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    console.log('🧹 Search cleared');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
    console.log('🧹 All filters cleared');
  };

  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h2>Projects</h2>
        <button onClick={handleCreateProject} className="create-project-btn">
          + Create Project
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="search-filters">
        <div className="search-section">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search projects by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="clear-search-btn">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Filter by Status:</label>
          <div className="filter-controls">
            <select 
              value={statusFilter} 
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="status-select-dropdown"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="on-hold">On Hold</option>
              <option value="planned">Planned</option>
            </select>
            {(searchQuery || statusFilter !== 'all') && (
              <button 
                onClick={handleClearFilters} 
                className="clear-all-filters-btn"
                title="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="active-filters">
          <span className="filters-label">Active Filters:</span>
          {searchQuery && (
            <span className="filter-tag">
              Search: "{searchQuery}"
              <button onClick={handleClearSearch} className="remove-filter">×</button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="filter-tag">
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <button onClick={() => handleStatusFilter('all')} className="remove-filter">×</button>
            </span>
          )}
        </div>
      )}

      {/* Projects Table */}
      <div className="projects-table-container">
        {filteredProjects.length > 0 ? (
          <div>
            <div className="projects-count">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id || project.project_id}>
                    <td className="project-name">
                      {project.name || 'Unnamed Project'}
                    </td>
                    <td>
                      <span className={`status-badge ${project.status?.toLowerCase()}`}>
                        {project.status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {project.start_date 
                        ? new Date(project.start_date).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td>
                      {project.end_date 
                        ? new Date(project.end_date).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewProject(project.id || project.project_id)}
                      >
                        View
                      </button>
                      <button 
                        className="action-btn assign-btn"
                        onClick={() => handleAssignProject(project.id || project.project_id)}
                      >
                        Tasks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-projects">
            <div className="empty-icon">📁</div>
            <h3>No projects match your search criteria</h3>
            <p>Try adjusting your search terms or filters</p>
            <button 
              onClick={handleCreateProject} 
              className="create-first-project-btn"
            >
              Create Your First Project
            </button>
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <CreateProject 
            onClose={() => setShowModal(false)}
            onSuccess={(newProject) => {
              // Just refresh the projects list instead of trying to add the project again
              // The project is already created in the CreateProject component
              console.log('Project created successfully:', newProject);
              setShowModal(false);
              // Trigger a refresh of the projects list
              window.location.reload(); // Simple refresh for now
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsList;