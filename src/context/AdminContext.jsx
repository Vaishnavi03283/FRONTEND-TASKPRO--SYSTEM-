import { createContext, useContext, useReducer } from "react";

const AdminContext = createContext();

const initialState = { 
  stats: null,
  projects: [],
  tasks: [],
  activeUsers: [],
  allUsers: [],
  loading: {
    stats: false,
    projects: false,
    tasks: false,
    activeUsers: false,
    allUsers: false
  },
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const reducer = (state, action) => {
  switch(action.type){
    case "SET_LOADING": 
      return { 
        ...state, 
        loading: { 
          ...state.loading, 
          [action.key]: action.payload 
        } 
      };
    case "SET_ERROR": 
      return { 
        ...state, 
        error: action.payload,
        loading: { 
          ...state.loading, 
          [action.key]: false 
        } 
      };
    case "CLEAR_ERROR": 
      return { ...state, error: null };
    
    case "SET_STATS": 
      return { 
        ...state, 
        stats: action.payload, 
        error: null,
        loading: { 
          ...state.loading, 
          stats: false 
        } 
      };
    
    case "SET_PROJECTS": 
      return { 
        ...state, 
        projects: action.payload, 
        error: null,
        loading: { 
          ...state.loading, 
          projects: false 
        } 
      };
    
    case "ADD_PROJECT": 
      return { 
        ...state, 
        projects: [action.payload, ...state.projects], 
        error: null 
      };
    
    case "UPDATE_PROJECT": 
      return { 
        ...state, 
        projects: state.projects.map(project => 
          project.id === action.payload.id ? action.payload : project
        ),
        error: null 
      };
    
    case "DELETE_PROJECT": 
      return { 
        ...state, 
        projects: state.projects.filter(project => project.id !== action.payload),
        error: null 
      };
    
    case "SET_TASKS": 
      return { 
        ...state, 
        tasks: action.payload, 
        error: null,
        loading: { 
          ...state.loading, 
          tasks: false 
        } 
      };
    
    case "ADD_TASK": 
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks], 
        error: null 
      };
    
    case "UPDATE_TASK": 
      return { 
        ...state, 
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        error: null 
      };
    
    case "DELETE_TASK": 
      return { 
        ...state, 
        tasks: state.tasks.filter(task => task.id !== action.payload),
        error: null 
      };
    
    case "SET_ACTIVE_USERS": 
      return { 
        ...state, 
        activeUsers: action.payload, 
        error: null,
        loading: { 
          ...state.loading, 
          activeUsers: false 
        } 
      };
    
    case "SET_ALL_USERS": 
      return { 
        ...state, 
        allUsers: action.payload.users || action.payload, 
        pagination: {
          ...state.pagination,
          ...action.payload.pagination
        },
        error: null,
        loading: { 
          ...state.loading, 
          allUsers: false 
        } 
      };
    
    case "UPDATE_USER": 
      return { 
        ...state, 
        allUsers: state.allUsers.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        activeUsers: state.activeUsers.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        error: null 
      };
    
    case "DEACTIVATE_USER": 
      return { 
        ...state, 
        allUsers: state.allUsers.map(user => 
          user.id === action.payload ? { ...user, status: 'INACTIVE' } : user
        ),
        activeUsers: state.activeUsers.filter(user => user.id !== action.payload),
        error: null 
      };
    
    case "ACTIVATE_USER": 
      return { 
        ...state, 
        allUsers: state.allUsers.map(user => 
          user.id === action.payload ? { ...user, status: 'ACTIVE' } : user
        ),
        activeUsers: state.activeUsers.some(user => user.id === action.payload) 
          ? state.activeUsers.map(user => 
              user.id === action.payload ? { ...user, status: 'ACTIVE' } : user
            )
          : [...state.activeUsers, state.allUsers.find(user => user.id === action.payload)],
        error: null 
      };
    
    case "SET_PAGINATION": 
      return { 
        ...state, 
        pagination: { 
          ...state.pagination, 
          ...action.payload 
        } 
      };
    
    default: 
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const value = {
    state,
    dispatch,
    // Action creators for better developer experience
    actions: {
      setLoading: (key, loading) => dispatch({ type: 'SET_LOADING', key, payload: loading }),
      setError: (key, error) => dispatch({ type: 'SET_ERROR', key, payload: error }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
      
      // Stats actions
      setStats: (stats) => dispatch({ type: 'SET_STATS', payload: stats }),
      
      // Projects actions
      setProjects: (projects) => dispatch({ type: 'SET_PROJECTS', payload: projects }),
      addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
      updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
      deleteProject: (projectId) => dispatch({ type: 'DELETE_PROJECT', payload: projectId }),
      
      // Tasks actions
      setTasks: (tasks) => dispatch({ type: 'SET_TASKS', payload: tasks }),
      addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
      updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
      deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
      
      // Users actions
      setActiveUsers: (users) => dispatch({ type: 'SET_ACTIVE_USERS', payload: users }),
      setAllUsers: (users) => dispatch({ type: 'SET_ALL_USERS', payload: users }),
      updateUser: (user) => dispatch({ type: 'UPDATE_USER', payload: user }),
      activateUser: (userId) => dispatch({ type: 'ACTIVATE_USER', payload: userId }),
      deactivateUser: (userId) => dispatch({ type: 'DEACTIVATE_USER', payload: userId }),
      
      // Pagination actions
      setPagination: (pagination) => dispatch({ type: 'SET_PAGINATION', payload: pagination })
    }
  };
  
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
