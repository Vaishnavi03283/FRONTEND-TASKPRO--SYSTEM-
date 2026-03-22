/**
 * ========================================
 * APPLICATION CONSTANTS
 * Production-ready configuration
 * ========================================
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Status Options
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  PLANNING: 'PLANNING',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

// Route Paths
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected
  DASHBOARD: '/dashboard',
  USER_DASHBOARD: '/user',
  MANAGER_DASHBOARD: '/manager',
  ADMIN_DASHBOARD: '/admin',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',
  CREATE_PROJECT: '/projects/create',
  EDIT_PROJECT: '/projects/:id/edit',
  
  // Tasks
  TASKS: '/tasks',
  TASK_DETAILS: '/tasks/:id',
  CREATE_TASK: '/tasks/create',
  EDIT_TASK: '/tasks/:id/edit',
  
  // Users
  PROFILE: '/profile',
  USERS: '/users',
  USER_DETAILS: '/users/:id',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  PROJECT_DELETED: 'Project deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
  PROJECT_NAME_MIN_LENGTH: 3,
  PROJECT_NAME_MAX_LENGTH: 100,
  TASK_TITLE_MIN_LENGTH: 3,
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,
};

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#06b6d4',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
};

// Application Settings
export const APP_CONFIG = {
  NAME: 'Task Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Complete Task & Project Management System',
  AUTHOR: 'Task Management Team',
  SUPPORT_EMAIL: 'support@taskmanagement.com',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};

// Cache Settings
export const CACHE_CONFIG = {
  DASHBOARD_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  USER_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  PROJECT_CACHE_TIME: 15 * 60 * 1000, // 15 minutes
  TASK_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  REAL_TIME_UPDATES: false,
  FILE_UPLOADS: true,
  EXPORT_DATA: true,
  ADVANCED_SEARCH: true,
  TEAM_COLLABORATION: true,
};

export default {
  API_CONFIG,
  TASK_STATUS,
  PROJECT_STATUS,
  USER_ROLES,
  PRIORITY_LEVELS,
  ROUTES,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  THEME,
  APP_CONFIG,
  CACHE_CONFIG,
  FEATURES,
};
