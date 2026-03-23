import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { cn } from '../../utils';

// Toast Context
const ToastContext = createContext();

// Toast Types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
};

// Initial State
const initialState = {
  toasts: []
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: []
      };
    
    default:
      return state;
  }
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration: options.duration || 5000,
      title: options.title
    };
    
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    // Auto remove after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
      }, toast.duration);
    }
  }, []);
  
  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);
  
  const clearToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);
  
  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
    success: (message, options) => addToast(message, TOAST_TYPES.SUCCESS, options),
    error: (message, options) => addToast(message, TOAST_TYPES.ERROR, options),
    warning: (message, options) => addToast(message, TOAST_TYPES.WARNING, options),
    info: (message, options) => addToast(message, TOAST_TYPES.INFO, options)
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Component
export const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    const icons = {
      [TOAST_TYPES.SUCCESS]: '✓',
      [TOAST_TYPES.ERROR]: '✕',
      [TOAST_TYPES.WARNING]: '⚠',
      [TOAST_TYPES.INFO]: 'ℹ'
    };
    return icons[toast.type] || icons[TOAST_TYPES.INFO];
  };
  
  return (
    <div className={cn('toast', `toast-${toast.type}`)}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        {toast.title && (
          <div className="toast-title">{toast.title}</div>
        )}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button 
        onClick={onClose}
        className="toast-close"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastProvider;
