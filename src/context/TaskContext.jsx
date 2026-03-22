import { createContext, useContext, useReducer } from "react";

const TaskContext = createContext();
const initialState = { 
  tasks: [], 
  currentTask: null, 
  loading: false, 
  error: null 
};

const reducer = (state, action) => {
  switch(action.type){
    case "SET_LOADING": 
      return { ...state, loading: action.payload };
    case "SET_ERROR": 
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR": 
      return { ...state, error: null };
    case "SET_TASKS": 
      return { ...state, tasks: action.payload, error: null };
    case "ADD_TASK": 
      return { ...state, tasks: [action.payload, ...state.tasks], error: null };
    case "UPDATE_TASK": 
      return { 
        ...state, 
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        currentTask: state.currentTask?.id === action.payload.id ? action.payload : state.currentTask,
        error: null 
      };
    case "DELETE_TASK": 
      return { 
        ...state, 
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
        error: null 
      };
    case "SET_CURRENT": 
      return { ...state, currentTask: action.payload, error: null };
    case "CLEAR_CURRENT": 
      return { ...state, currentTask: null };
    default: 
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const value = {
    state,
    dispatch,
    // Action creators for better developer experience
    actions: {
      setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
      setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
      setTasks: (tasks) => dispatch({ type: 'SET_TASKS', payload: tasks }),
      addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
      updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
      deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
      setCurrentTask: (task) => dispatch({ type: 'SET_CURRENT', payload: task }),
      clearCurrentTask: () => dispatch({ type: 'CLEAR_CURRENT' })
    }
  };
  
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export { TaskContext };