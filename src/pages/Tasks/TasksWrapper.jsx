import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TaskContext } from '../../context/TaskContext';
import TaskList from '../tasks/TaskList';
import ManagerTasks from './ManagerTasks';
import './TasksWrapper.css';

const TasksWrapper = () => {
  const { user } = useContext(AuthContext);
  const { tasks, loading, error, fetchTasks } = useContext(TaskContext);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [view, setView] = useState('my-tasks'); // 'my-tasks', 'all-tasks', 'project-tasks'
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = () => {
    if (projectId) {
      navigate(`/projects/${projectId}/tasks/create`);
    } else {
      navigate('/tasks/create');
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by view
    if (view === 'my-tasks') {
      filtered = filtered.filter(task => task.assignedTo === user?._id);
    } else if (view === 'project-tasks' && projectId) {
      filtered = filtered.filter(task => task.project === projectId);
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  };

  const renderContent = () => {
    const filteredTasks = getFilteredTasks();

    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      return (
        <ManagerTasks
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onTaskClick={handleTaskClick}
          onCreateTask={handleCreateTask}
          onRefresh={fetchTasks}
          filters={filters}
          onFilterChange={handleFilterChange}
          view={view}
          onViewChange={setView}
          projectId={projectId}
        />
      );
    }

    return (
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
        onRefresh={fetchTasks}
        filters={filters}
        onFilterChange={handleFilterChange}
        projectId={projectId}
      />
    );
  };

  return (
    <div className="tasks-wrapper">
      <div className="tasks-header">
        <h1>
          {projectId ? 'Project Tasks' : 'Tasks'}
        </h1>
        
        <div className="tasks-actions">
          <button
            className="create-task-btn"
            onClick={handleCreateTask}
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="tasks-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchTasks}>Retry</button>
          </div>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default TasksWrapper;
