import { useState, useEffect } from "react";
import {
  getTasks,
  deleteTask,
  updateStatus,
  createTask as createTaskApi,
  getProjectTasks,
} from "../api/task.api";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createTaskApi(taskData);
      fetchTasks(); // Refresh the tasks list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, removeTask, changeStatus, createTask: addTask };
};

export const useTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createTaskApi(taskData);
      await fetchTasks(); // Refresh the tasks list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, createTask };
};

export const useProjectTasks = (projectId, filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjectTasks = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectTasks(projectId, filters);
      setTasks(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch project tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId, JSON.stringify(filters)]);

  return { tasks, loading, error, refetch: fetchProjectTasks };
};