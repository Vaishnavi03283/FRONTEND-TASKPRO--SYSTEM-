// SCSS to Inline Styles Converter Utility
// This utility helps convert SCSS module imports to inline styles

import { commonStyles, colors, typography, spacing, borderRadius, shadows, transitions } from '../styles/inlineStyles.js';

// Common style mappings based on typical SCSS class names
const styleMappings = {
  // Layout classes
  'login': {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'loginContainer': {
    display: 'flex',
    maxWidth: '900px',
    width: '100%',
    background: colors.bgPrimary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.hover,
    overflow: 'hidden',
    minHeight: '500px',
    maxHeight: '600px',
    position: 'relative',
    zIndex: 1,
  },
  'loginSection': {
    flex: '1.2',
    padding: spacing['2xl'],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  'illustrationSection': {
    flex: '0.8',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    padding: spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Form classes
  'form': {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  'formGroup': {
    ...commonStyles.formGroup,
  },
  'formLabel': {
    ...commonStyles.formLabel,
  },
  'formInput': {
    ...commonStyles.formInput,
  },

  // Button classes
  'loginButton': {
    ...commonStyles.buttonPrimary,
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  'createProjectBtn': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: colors.bgPrimary,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.sm,
    cursor: 'pointer',
    transition: transitions.base,
    padding: `${spacing.sm} ${spacing.md}`,
  },
  'viewProjectsBtn': {
    background: '#667eea',
    color: colors.bgPrimary,
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: typography.sm,
    cursor: 'pointer',
    transition: transitions.base,
    padding: `${spacing.sm} ${spacing.md}`,
  },

  // Card classes
  'card': {
    ...commonStyles.card,
  },
  'cardElevated': {
    ...commonStyles.cardElevated,
  },

  // Utility classes
  'text-center': { textAlign: 'center' },
  'flex': { display: 'flex' },
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  'justify-between': { justifyContent: 'space-between' },

  // Error classes
  'error': {
    ...commonStyles.error,
  },
  'errorMessage': {
    ...commonStyles.error,
  },

  // Loading classes
  'loading': {
    ...commonStyles.loading,
  },
  'spinner': {
    ...commonStyles.spinner,
  },
};

// Function to convert className string to inline styles
export const convertClassNamesToStyles = (classNameString) => {
  if (!classNameString) return {};
  
  const classNames = classNameString.split(' ').filter(Boolean);
  let combinedStyles = {};
  
  classNames.forEach(className => {
    const style = styleMappings[className];
    if (style) {
      combinedStyles = { ...combinedStyles, ...style };
    }
  });
  
  return combinedStyles;
};

// Function to get style by class name
export const getStyleByClassName = (className) => {
  return styleMappings[className] || {};
};

// Function to create responsive styles
export const createResponsiveStyle = (baseStyle, breakpoints = {}) => {
  return {
    ...baseStyle,
    '@media (max-width: 768px)': breakpoints.mobile || {},
    '@media (max-width: 1024px)': breakpoints.tablet || {},
  };
};

// Function to add hover effects
export const addHoverEffect = (baseStyle, hoverStyle) => {
  return {
    ...baseStyle,
    ':hover': hoverStyle,
  };
};

// Common component style generators
export const createButtonStyle = (variant = 'primary', size = 'md') => {
  const baseStyles = {
    primary: commonStyles.buttonPrimary,
    secondary: commonStyles.buttonSecondary,
    danger: commonStyles.buttonDanger,
  };

  const sizeStyles = {
    sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: typography.xs },
    md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.base },
    lg: { padding: `${spacing.md} ${spacing.lg}`, fontSize: typography.lg },
  };

  return {
    ...baseStyles[variant],
    ...sizeStyles[size],
  };
};

export const createInputStyle = (hasError = false) => ({
  ...commonStyles.formInput,
  ...(hasError ? {
    borderColor: colors.danger,
    boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`,
  } : {}),
});

export const createCardStyle = (variant = 'default') => {
  const variants = {
    default: commonStyles.card,
    elevated: commonStyles.cardElevated,
    interactive: commonStyles.cardInteractive,
  };
  return variants[variant] || variants.default;
};

export const createBadgeStyle = (status) => {
  const statusStyles = {
    active: { ...commonStyles.badge, ...commonStyles.badgeSuccess },
    completed: { ...commonStyles.badge, ...commonStyles.badgeSuccess },
    pending: { ...commonStyles.badge, ...commonStyles.badgeWarning },
    inactive: { ...commonStyles.badge, ...commonStyles.badgeDanger },
    failed: { ...commonStyles.badge, ...commonStyles.badgeDanger },
  };
  return statusStyles[status] || commonStyles.badge;
};

export default {
  convertClassNamesToStyles,
  getStyleByClassName,
  createResponsiveStyle,
  addHoverEffect,
  createButtonStyle,
  createInputStyle,
  createCardStyle,
  createBadgeStyle,
  styleMappings,
};
