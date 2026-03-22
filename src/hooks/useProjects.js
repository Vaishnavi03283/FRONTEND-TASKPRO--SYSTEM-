import { useState, useEffect, useCallback } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  getProjectById as getProjectByIdApi,
  updateProject,
} from "../api/project.api";

export const useProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error };
};

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectByIdApi(projectId);
      setProject(data.data || data);
    } catch (err) {
      setError(err.message || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data.data || []);
  };

  const fetchProjectById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectByIdApi(id);
      setCurrentProject(data.data || data);
      return data.data || data;
    } catch (err) {
      setError(err.message || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = async (project) => {
    await createProject(project);
    fetchProjects();
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  const updateProjectDetails = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateProject(id, data);
      setCurrentProject(response.data || response);
      await fetchProjects(); // Refresh the projects list
      return response.data || response;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { 
    projects, 
    currentProject,
    loading,
    error,
    addProject, 
    removeProject,
    fetchProjectById,
    updateProject: updateProjectDetails
  };
};