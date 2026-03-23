import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTasks, updateStatus, deleteTask } from "../../api/task.api";
import { getUsers } from "../../api/user.api";
import TaskCard from "../../components/common/TaskCard";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./ManagerTasks.css";

const ManagerTasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  // Filter tasks created by the current manager
  const filteredTasks = useMemo(() => {
    let filteredTasks = [...tasks];

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

    return filteredTasks;
  }, [tasks, searchQuery, statusFilter, priorityFilter, userFilter]);

  useEffect(() => {
    fetchManagerTasks();
    fetchUsers();
  }, []);

  const fetchManagerTasks = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 ManagerTasks: Fetching tasks created by manager:', user.id);
      
      const allTasksResponse = await getTasks();
      const allTasks = Array.isArray(allTasksResponse) ? allTasksResponse : (allTasksResponse?.data || []);
      
      // Filter tasks created by the current manager
      const managerTasks = allTasks.filter(task => task.created_by === user.id);
      
      console.log('✅ ManagerTasks: Found', managerTasks.length, 'tasks created by manager');
      setTasks(managerTasks);
    } catch (err) {
      setError("Failed to fetch your tasks");
      console.error("Error fetching manager tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
  };

  // Get task statistics
  const taskStats = useMemo(() => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };
    return stats;
  }, [tasks]);

  if (loading) {
    return (
      <div className="manager-tasks-page">
        <Card variant="default" shadow="md" className="loading-card">
          <CardBody className="loading-body">
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-tasks-page">
        <Card variant="error" shadow="md" className="error-card">
          <CardBody className="error-body">
            <div className="error">
              <p>{error}</p>
              <Button onClick={fetchManagerTasks} variant="primary" size="md" className="retry-btn">
                Retry
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="manager-tasks-page">
      <Card variant="default" shadow="md" className="manager-tasks-header">
        <CardHeader className="header-content">
          <div className="header-text">
            <CardTitle>My Created Tasks</CardTitle>
            <CardDescription>Manage tasks you have created</CardDescription>
          </div>
          <Button 
            onClick={() => navigate('/tasks/create')} 
            variant="primary" 
            size="md"
            className="create-task-btn"
          >
            + Create Task
          </Button>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{taskStats.total}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{taskStats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{taskStats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{taskStats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
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
                  showProject={true}
                  showCreator={false} // Don't show creator since it's always the manager
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
            <p>
              {tasks.length === 0 
                ? "You haven't created any tasks yet." 
                : "Try adjusting your filters or create a new task."
              }
            </p>
            <button
              onClick={() => navigate("/tasks/create")}
              className="create-task-btn"
            >
              Create Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTasks;
