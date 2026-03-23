import API from "./axios";

export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  // Normalize response
  const payload = res.data.data || res.data;

  return {
    token: payload.token,
    user: payload.user,
  };
};

export const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data.data;
};

export const changePassword = async (data) => {
  console.log('API changePassword called with data:', data);
  try {
    const res = await API.put("/auth/change-password", data);
    console.log('API changePassword response:', res);
    console.log('API changePassword response data:', res.data);
    return res.data;
  } catch (error) {
    console.error('API changePassword error:', error);
    console.error('API changePassword error response:', error.response);
    throw error;
  }
};