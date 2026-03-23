import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { getProjectTasks, updateStatus, deleteTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getUsers } from "../../api/user.api";
import TaskCard from "../../components/common/TaskCard";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./TasksList.css";

const TasksList = () => {
  const { user } = useAuth();
  const { tasks: allTasksFromHook } = useTasks();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filteredTasks = [...tasks];

    // Search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // User filter
    if (userFilter !== "all") {
      filteredTasks = filteredTasks.filter(task => task.assigned_user_id === userFilter);
    }

    // Project filter
    if (selectedProject !== "all") {
      filteredTasks = filteredTasks.filter(task => task.project_id === selectedProject);
    }

    return filteredTasks;
  }, [tasks, searchQuery, statusFilter, priorityFilter, userFilter, selectedProject]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tasks based on user role
      let tasksData = [];
      if (user?.role === "MANAGER") {
        // Fetch projects for this manager, then fetch tasks for those projects
        const projectsResponse = await getProjects();
        const managerProjects = projectsResponse.data.filter(project => 
          project.created_by === user.id || project.manager_id === user.id
        );
        
        const taskPromises = managerProjects.map(project => 
          getProjectTasks(project.id).catch(err => {
            console.error(`Error fetching tasks for project ${project.id}:`, err);
            return { data: [] };
          })
        );
        
        const taskResponses = await Promise.all(taskPromises);
        tasksData = taskResponses.flatMap(response => response.data);
      } else {
        // For regular users, fetch their assigned tasks
        tasksData = allTasksFromHook || [];
      }

      setTasks(tasksData);

      // Fetch projects for filter
      const projectsResponse = await getProjects();
      setProjects(projectsResponse.data);

      // Fetch users for filter
      const usersResponse = await getUsers();
      setUsers(usersResponse.data);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, allTasksFromHook]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setUserFilter("all");
    setSelectedProject("all");
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <Card variant="default" shadow="md" className="loading-card">
          <CardBody className="loading-body">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <Card variant="error" shadow="md" className="error-card">
          <CardBody className="error-body">
            <div className="error">
              <p>{error}</p>
              <Button
                onClick={
                  user?.role === "MANAGER"
                    ? fetchData
                    : fetchData
                }
                variant="primary"
                size="md"
              >
                Retry
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <Card variant="default" shadow="md" className="tasks-header">
        <CardHeader className="header-content">
          <div className="header-text">
            <CardTitle>
              {user?.role === "MANAGER"
                ? "My Project Tasks"
                : "Tasks"}
            </CardTitle>
            <CardDescription className="header-subtitle">
              {user?.role === "MANAGER"
                ? "Manage tasks from your projects"
                : "View and manage your tasks"}
            </CardDescription>
          </div>

          {user?.role === "MANAGER" && (
            <Button
              onClick={() => navigate("/tasks/create")}
              variant="primary"
              size="md"
              className="create-task-btn"
            >
              <span className="btn-icon">+</span>
              Create Task
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* Filters Section */}
      <Card variant="default" shadow="sm" className="filters-section">
        <CardHeader className="filters-header">
          <CardTitle>Filters</CardTitle>
          <Button onClick={clearFilters} variant="ghost" size="sm" className="clear-filters-btn">
            Clear All
          </Button>
        </CardHeader>
        <CardBody className="filters-body">
          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="filter-group">
              <label>Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* User Filter */}
            {user?.role === "MANAGER" && (
              <div className="filter-group">
                <label>Assigned User</label>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Project Filter */}
            <div className="filter-group">
              <label>Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tasks Grid */}
      <div className="tasks-content">
        {filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={fetchData}
                userRole={user?.role}
              />
            ))}
          </div>
        ) : (
          <Card variant="default" shadow="sm" className="empty-state">
            <CardBody className="empty-body">
              <div className="empty-content">
                <div className="empty-icon">📋</div>
                <h3>No tasks found</h3>
                <p>
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all" || selectedProject !== "all"
                    ? "Try adjusting your filters or search criteria"
                    : "No tasks available at the moment"}
                </p>
                {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || userFilter !== "all" || selectedProject !== "all") && (
                  <Button onClick={clearFilters} variant="primary" size="md">
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TasksList;