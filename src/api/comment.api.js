import API from "./axios";

export const getComments = async (taskId) => {
  const res = await API.get(`/tasks/${taskId}/comments`);
  return res.data;
};

export const addComment = async (taskId, text) => {
  return API.post(`/tasks/${taskId}/comments`, { text });
};

export const deleteComment = async (id) => {
  return API.delete(`/comments/${id}`);
};