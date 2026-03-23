import axios from "axios";
import { mockAPI } from "./mock.api.js";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// Use mock API for development
const useMockAPI = true; // Force use mock API

const mockAPIWrapper = {
  get: async (url) => {
    if (useMockAPI) {
      if (url === '/auth/me') return mockAPI.getCurrentUser();
      if (url === '/projects') return mockAPI.getProjects();
      if (url === '/tasks') return mockAPI.getTasks();
      if (url === '/users') return mockAPI.getUsers();
      throw new Error(`Mock API not implemented for GET ${url}`);
    }
    return API.get(url);
  },
  post: async (url, data) => {
    if (useMockAPI) {
      if (url === '/auth/login') return mockAPI.login(data);
      if (url === '/auth/register') return mockAPI.register(data);
      if (url === '/auth/logout') return mockAPI.logout();
      if (url === '/projects') return mockAPI.createProject(data);
      if (url === '/tasks') return mockAPI.createTask(data);
      throw new Error(`Mock API not implemented for POST ${url}`);
    }
    return API.post(url, data);
  },
  put: async (url, data) => {
    if (useMockAPI) {
      throw new Error(`Mock API not implemented for PUT ${url}`);
    }
    return API.put(url, data);
  },
  delete: async (url) => {
    if (useMockAPI) {
      throw new Error(`Mock API not implemented for DELETE ${url}`);
    }
    return API.delete(url);
  }
};

// Add interceptors for mock wrapper
mockAPIWrapper.interceptors = {
  request: {
    use: (onFulfilled, onRejected) => {
      // Mock implementation
      return;
    }
  },
  response: {
    use: (onFulfilled, onRejected) => {
      // Mock implementation  
      return;
    }
  }
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default mockAPIWrapper;