/**
 * ========================================
 * VALIDATION FUNCTIONS
 * Production-ready form validators
 * ========================================
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} Validation result
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 50) {
    return { isValid: false, error: 'Username is too long' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  if (/^[0-9]/.test(username)) {
    return { isValid: false, error: 'Username cannot start with a number' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate name (first name or last name)
 * @param {string} name - Name to validate
 * @returns {object} Validation result
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Name is too long' };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, error: '' }; // Phone is optional
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  if (cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate project name
 * @param {string} projectName - Project name to validate
 * @returns {object} Validation result
 */
export const validateProjectName = (projectName) => {
  if (!projectName) {
    return { isValid: false, error: 'Project name is required' };
  }
  
  if (projectName.length < 3) {
    return { isValid: false, error: 'Project name must be at least 3 characters long' };
  }
  
  if (projectName.length > 100) {
    return { isValid: false, error: 'Project name is too long' };
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(projectName)) {
    return { isValid: false, error: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate task title
 * @param {string} taskTitle - Task title to validate
 * @returns {object} Validation result
 */
export const validateTaskTitle = (taskTitle) => {
  if (!taskTitle) {
    return { isValid: false, error: 'Task title is required' };
  }
  
  if (taskTitle.length < 3) {
    return { isValid: false, error: 'Task title must be at least 3 characters long' };
  }
  
  if (taskTitle.length > 200) {
    return { isValid: false, error: 'Task title is too long' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate task description
 * @param {string} description - Task description to validate
 * @returns {object} Validation result
 */
export const validateTaskDescription = (description) => {
  if (!description) {
    return { isValid: true, error: '' }; // Description is optional
  }
  
  if (description.length > 1000) {
    return { isValid: false, error: 'Description is too long' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate date
 * @param {string} date - Date string to validate
 * @param {boolean} isFuture - Should date be in future
 * @returns {object} Validation result
 */
export const validateDate = (date, isFuture = false) => {
  if (!date) {
    return { isValid: true, error: '' }; // Date is optional
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day
  
  if (isFuture && dateObj < now) {
    return { isValid: false, error: 'Date must be in the future' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {object} Validation result
 */
export const validateUrl = (url) => {
  if (!url) {
    return { isValid: true, error: '' }; // URL is optional
  }
  
  try {
    new URL(url);
    return { isValid: true, error: '' };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateFile = (file, options = {}) => {
  if (!file) {
    return { isValid: true, error: '' }; // File is optional
  }
  
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  } = options;
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate number
 * @param {any} value - Value to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false, fieldName = 'Value' } = options;
  
  if (value === null || value === undefined || value === '') {
    return { isValid: true, error: '' }; // Optional field
  }
  
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, error: `${fieldName} must be an integer` };
  }
  
  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate select field
 * @param {any} value - Value to validate
 * @param {Array} options - Available options
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateSelect = (value, options, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!options.includes(value)) {
    return { isValid: false, error: `Invalid ${fieldName} selected` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate form data
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules
 * @returns {object} Validation result
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    // Check if field is required
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `${rules.label || field} is required`;
      isValid = false;
      return;
    }
    
    // Skip validation if field is empty and not required
    if (!value && !rules.required) {
      return;
    }
    
    // Run specific validations
    if (rules.type === 'email') {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        errors[field] = emailValidation.error;
        isValid = false;
      }
    } else if (rules.type === 'password') {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid) {
        errors[field] = passwordValidation.error;
        isValid = false;
      }
    } else if (rules.type === 'name') {
      const nameValidation = validateName(value);
      if (!nameValidation.isValid) {
        errors[field] = nameValidation.error;
        isValid = false;
      }
    } else if (rules.type === 'phone') {
      const phoneValidation = validatePhone(value);
      if (!phoneValidation.isValid) {
        errors[field] = phoneValidation.error;
        isValid = false;
      }
    } else if (rules.type === 'url') {
      const urlValidation = validateUrl(value);
      if (!urlValidation.isValid) {
        errors[field] = urlValidation.error;
        isValid = false;
      }
    }
    
    // Check min/max length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${rules.label || field} must be at least ${rules.minLength} characters long`;
      isValid = false;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${rules.label || field} must be at most ${rules.maxLength} characters long`;
      isValid = false;
    }
    
    // Check custom validator
    if (rules.validator && typeof rules.validator === 'function') {
      const customValidation = rules.validator(value);
      if (!customValidation.isValid) {
        errors[field] = customValidation.error;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
  validatePhone,
  validateProjectName,
  validateTaskTitle,
  validateTaskDescription,
  validateDate,
  validateUrl,
  validateFile,
  validateRequired,
  validateNumber,
  validateSelect,
  validateForm,
};
