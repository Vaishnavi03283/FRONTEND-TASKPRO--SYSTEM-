// Utility Functions - Production Ready Helpers

/**
 * Merges CSS class names using conditional logic
 * @param {...classes} - Class names to merge
 * @returns {string} - Merged class string
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Formats date to readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
}

/**
 * Debounces function calls
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Generates initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export function getInitials(name) {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gets status color class
 * @param {string} status - Task/project status
 * @returns {string} - CSS class name
 */
export function getStatusColor(status) {
  const statusColors = {
    'COMPLETED': 'status-success',
    'IN_PROGRESS': 'status-warning', 
    'ACTIVE': 'status-primary',
    'PENDING': 'status-gray',
    'CANCELLED': 'status-error',
    'ON_HOLD': 'status-warning'
  };
  
  return statusColors[status?.toUpperCase()] || 'status-gray';
}

/**
 * Gets priority color class
 * @param {string} priority - Priority level
 * @returns {string} - CSS class name
 */
export function getPriorityColor(priority) {
  const priorityColors = {
    'HIGH': 'priority-high',
    'MEDIUM': 'priority-medium',
    'LOW': 'priority-low'
  };
  
  return priorityColors[priority?.toUpperCase()] || 'priority-medium';
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Generates avatar color based on name
 * @param {string} name - User name
 * @returns {string} - CSS color class
 */
export function getAvatarColor(name) {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500',
    'bg-yellow-500', 'bg-teal-500', 'bg-orange-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Local storage helpers
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Failed to remove from localStorage:', err);
    }
  }
};
