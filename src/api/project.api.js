import API from "./axios";

export const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await API.post("/projects", data);
  return res.data;
};

export const getProjectById = async (id) => {
  if (!id) {
    throw new Error("Project ID is required");
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Invalid project ID format");
  }
  
  const res = await API.get(`/projects/${id}`);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await API.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await API.delete(`/projects/${id}`);
  return res.data;
};

export const addMembers = async (projectId, userIds) => {
  const res = await API.post(`/projects/${projectId}/members`, { userIds });
  return res.data;
};

export const removeMember = async (projectId, userId) => {
  const res = await API.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};

export const getMembers = async (projectId) => {
  const res = await API.get(`/projects/${projectId}/members`);
  return res.data;
};