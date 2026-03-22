import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { getProjectTasks, updateStatus, deleteTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import { getUsers } from "../../api/user.api";
import TaskCard from "../../components/common/TaskCard";
import { useNavigate } from "react-router-dom";
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

    if (user?.role === "MANAGER") {
      const managerProjectIds = projects
        .filter(
          (project) =>
            project.manager_id === user.id ||
            project.created_by === user.id
        )
        .map((project) => project.id);

      filteredTasks = filteredTasks.filter((task) =>
        managerProjectIds.includes(task.project_id)
      );
    }

    // Search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.priority?.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // User filter (assigned user)
    if (userFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.assigned_user_id === userFilter
      );
    }

    // Project filter
    if (selectedProject !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.project_id === selectedProject
      );
    }

    return filteredTasks;
  }, [tasks, projects, user, searchQuery, statusFilter, priorityFilter, userFilter, selectedProject]);

  useEffect(() => {
    if (user?.role === "MANAGER") {
      fetchManagerProjectsAndTasks();
    } else {
      fetchAllTasks();
    }
    fetchUsers();
  }, [user]);

  const fetchManagerProjectsAndTasks = useCallback(async () => {
    try {
      setLoading(true);

      const projectsResponse = await getProjects();

      const managerProjects = projectsResponse.filter(
        (project) =>
          project.manager_id === user.id ||
          project.created_by === user.id
      );

      setProjects(managerProjects);

      let allTasks = [];

      for (const project of managerProjects) {
        try {
          const projectTasks = await getProjectTasks(project.id);

          const tasksWithProject = projectTasks.map((task) => ({
            ...task,
            project_name: project.name,
            project_id: project.id,
          }));

          allTasks = [...allTasks, ...tasksWithProject];
        } catch (err) {
          console.error(
            `Error fetching tasks for project ${project.id}:`,
            err
          );
        }
      }

      setTasks(allTasks);
    } catch (err) {
      setError("Failed to fetch projects and tasks");
      console.error("Error fetching manager data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      setTasks(allTasksFromHook || []);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [allTasksFromHook]);

  const fetchUsers = useCallback(async () => {
    try {
      const usersResponse = await getUsers();
      setUsers(usersResponse.data || usersResponse || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateStatus(taskId, { status: newStatus });

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError("Failed to update task status");
      console.error("Error updating task status:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

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
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <div className="error">
          <p>{error}</p>
          <button
            onClick={
              user?.role === "MANAGER"
                ? fetchManagerProjectsAndTasks
                : fetchAllTasks
            }
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="header-content">
          <div className="header-text">
            <h2>
              {user?.role === "MANAGER"
                ? "My Project Tasks"
                : "Tasks"}
            </h2>
            <p className="header-subtitle">
              {user?.role === "MANAGER"
                ? "Manage tasks from your projects"
                : "View and manage your tasks"}
            </p>
          </div>

          {user?.role === "MANAGER" && (
            <button
              onClick={() => navigate("/tasks/create")}
              className="create-task-btn"
            >
              <span className="btn-icon">+</span>
              Create Task
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters</h3>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All
          </button>
        </div>
        
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
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
          <div className="filter-group">
            <label>Assigned To</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          {user?.role === "MANAGER" && (
            <div className="filter-group">
              <label>Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="tasks-content">
        {filteredTasks.length > 0 ? (
          <>
            <div className="tasks-summary">
              <span>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found</span>
            </div>
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showProject={user?.role === "MANAGER"}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  onView={() => handleViewTask(task.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-tasks">
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
            {user?.role === "MANAGER" && (
              <button
                onClick={() => navigate("/tasks/create")}
                className="create-task-btn"
              >
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksList;
