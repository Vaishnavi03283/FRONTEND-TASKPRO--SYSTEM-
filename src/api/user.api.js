import API from "./axios";

export const getUsers = async (limit = 100) => {
  // Fetch all users by setting a high limit to get all pages
  const res = await API.get(`/users`);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

export const updateRole = async (id, role) => {
  return API.put(`/users/${id}/role`, { role });
};