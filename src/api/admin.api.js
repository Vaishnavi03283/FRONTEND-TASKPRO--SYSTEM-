import API from "./axios";

// Admin Dashboard APIs
export const getAdminStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

export const getAdminProjects = async () => {
  const res = await API.get("/admin/projects");
  return res.data;
};

export const getAdminTasks = async () => {
  const res = await API.get("/admin/tasks");
  return res.data;
};

export const getActiveUsers = async () => {
  const res = await API.get("/admin/active-users");
  return res.data;
};

// Admin User Management with Priority Filters
export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.priority) {
    params.append('priority', filters.priority);
  }
  if (filters.role) {
    params.append('role', filters.role);
  }
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.page) {
    params.append('page', filters.page);
  }
  if (filters.limit) {
    params.append('limit', filters.limit);
  }
  
  const url = params.toString() ? `/admin/users?${params}` : "/admin/users";
  const res = await API.get(url);
  return res.data;
};

// Admin User Actions
export const updateUserRole = async (userId, role) => {
  const res = await API.put(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const deactivateUser = async (userId) => {
  const res = await API.put(`/admin/users/${userId}/deactivate`);
  return res.data;
};

export const activateUser = async (userId) => {
  const res = await API.put(`/admin/users/${userId}/activate`);
  return res.data;
};

// Admin System Actions
export const getSystemHealth = async () => {
  const res = await API.get("/admin/system/health");
  return res.data;
};

export const getSystemLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.level) {
    params.append('level', filters.level);
  }
  if (filters.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    params.append('endDate', filters.endDate);
  }
  if (filters.page) {
    params.append('page', filters.page);
  }
  if (filters.limit) {
    params.append('limit', filters.limit);
  }
  
  const url = params.toString() ? `/admin/logs?${params}` : "/admin/logs";
  const res = await API.get(url);
  return res.data;
};