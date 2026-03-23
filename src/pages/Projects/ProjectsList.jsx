import React, { useState, useMemo } from "react";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../../components/common/ProjectCard";
import CreateProject from "./CreateProject";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle } from "../../components/common/Card";
import { cn } from "../../utils";
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
      <Card variant="default" shadow="md" className="projects-header-card">
        <CardHeader className="projects-header">
          <CardTitle>Projects</CardTitle>
          <Button 
            onClick={handleCreateProject}
            variant="primary"
            size="md"
            className="create-project-btn"
          >
            + Create Project
          </Button>
        </CardHeader>
      </Card>

      {/* Enhanced Search and Filters */}
      <Card variant="default" shadow="sm" className="search-filters-card">
        <CardBody className="search-filters">
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
                <Button 
                  onClick={handleClearFilters} 
                  variant="ghost"
                  size="sm"
                  className="clear-all-filters-btn"
                  title="Clear all filters"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Active Filters Display */}
      {(searchQuery || statusFilter !== 'all') && (
        <Card variant="default" shadow="sm" className="active-filters-card">
          <CardBody className="active-filters">
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
          </CardBody>
        </Card>
      )}

      {/* Projects Table */}
      <Card variant="default" shadow="md" className="projects-table-container">
        <CardBody className="projects-table-body">
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
                    <tr key={project.id}>
                      <td>
                        <div className="project-name-cell">
                          <h4>{project.name}</h4>
                          <p>{project.description}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${project.status}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{project.start_date}</td>
                      <td>{project.end_date}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="view-project-btn"
                        >
                          View Details
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
              <Button 
                onClick={handleCreateProject} 
                variant="primary"
                size="md"
                className="create-first-project-btn"
              >
                Create Your First Project
              </Button>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectsList;