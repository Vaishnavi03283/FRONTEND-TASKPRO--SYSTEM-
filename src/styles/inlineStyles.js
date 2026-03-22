// Inline Styles Utility - Complete Design System
// This file contains all the design system values converted to JavaScript

// Color System
export const colors = {
  // Primary Brand Colors
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  primaryHover: '#2563eb',

  // Semantic Colors
  success: '#10b981',
  successHover: '#059669',
  warning: '#f59e0b',
  warningHover: '#d97706',
  danger: '#ef4444',
  dangerHover: '#dc2626',
  info: '#06b6d4',

  // Neutral Palette
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Background Colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
  bgGray: '#f9fafb',
};

// Typography
export const typography = {
  // Font Sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px

  // Font Weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',

  // Line Heights
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
};

// Spacing
export const spacing = {
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  xs: '0.5rem',     // 8px (alias)
  '3': '0.75rem',   // 12px
  sm: '0.75rem',    // 12px (alias)
  '4': '1rem',      // 16px
  md: '1rem',       // 16px (alias)
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  lg: '1.5rem',     // 24px (alias)
  '8': '2rem',      // 32px
  xl: '2rem',       // 32px (alias)
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '2xl': '3rem',    // 48px (alias)
};

// Border Radius
export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
};

// Shadows
export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  focus: '0 0 0 3px rgba(59, 130, 246, 0.1)',
};

// Transitions
export const transitions = {
  fast: '0.15s ease',
  base: '0.2s ease',
  normal: '0.3s ease',
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// Common Style Patterns
export const commonStyles = {
  // Card styles
  card: {
    background: colors.bgPrimary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    padding: spacing.lg,
    transition: transitions.base,
  },
  cardElevated: {
    background: colors.bgPrimary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.hover,
    padding: spacing.lg,
    transition: transitions.base,
  },
  cardInteractive: {
    background: colors.bgPrimary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.card,
    padding: spacing.lg,
    transition: transitions.normal,
    cursor: 'pointer',
  },

  // Button styles
  button: {
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontWeight: typography.medium,
    cursor: 'pointer',
    transition: transitions.base,
  },
  buttonPrimary: {
    background: colors.primary,
    color: colors.bgPrimary,
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontWeight: typography.medium,
    cursor: 'pointer',
    transition: transitions.base,
  },
  buttonSecondary: {
    background: colors.gray200,
    color: colors.gray700,
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontWeight: typography.medium,
    cursor: 'pointer',
    transition: transitions.base,
  },
  buttonDanger: {
    background: colors.danger,
    color: colors.bgPrimary,
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontWeight: typography.medium,
    cursor: 'pointer',
    transition: transitions.base,
  },

  // Form styles
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  formLabel: {
    fontWeight: typography.medium,
    color: colors.gray700,
    marginBottom: spacing.xs,
    fontSize: typography.xs,
  },
  formInput: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    border: `2px solid ${colors.gray200}`,
    borderRadius: borderRadius.md,
    fontSize: typography.base,
    transition: transitions.base,
  },
  formInputFocus: {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: shadows.focus,
  },

  // Badge styles
  badge: {
    display: 'inline-block',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.xl,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  badgeSuccess: {
    background: colors.success,
    color: colors.bgPrimary,
  },
  badgeWarning: {
    background: colors.warning,
    color: colors.gray900,
  },
  badgeDanger: {
    background: colors.danger,
    color: colors.bgPrimary,
  },
  badgePrimary: {
    background: colors.primary,
    color: colors.bgPrimary,
  },

  // Utility styles
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  flex: { display: 'flex' },
  flexCol: { flexDirection: 'column' },
  itemsCenter: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },

  // Error and success states
  error: {
    color: colors.danger,
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    margin: `${spacing.sm} 0`,
  },
  success: {
    color: colors.success,
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    margin: `${spacing.sm} 0`,
  },

  // Loading styles
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${colors.gray200}`,
    borderTop: `4px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Layout styles
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '250px', // Sidebar width
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    background: colors.bgGray,
  },
};

// Responsive helper function
export const responsive = (baseStyle, responsiveStyles = {}) => {
  return {
    ...baseStyle,
    '@media (max-width: 640px)': responsiveStyles.sm || {},
    '@media (max-width: 768px)': responsiveStyles.md || {},
    '@media (max-width: 1024px)': responsiveStyles.lg || {},
    '@media (max-width: 1280px)': responsiveStyles.xl || {},
  };
};

// Animation keyframes
export const animations = {
  spin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
  progressAnimation: `
    @keyframes progressAnimation {
      from { width: 0; }
      to { width: 75%; }
    }
  `,
};

// Helper function to create status badge styles
export const getStatusBadgeStyle = (status) => {
  const statusStyles = {
    active: { ...commonStyles.badge, ...commonStyles.badgeSuccess },
    completed: { ...commonStyles.badge, ...commonStyles.badgeSuccess },
    pending: { ...commonStyles.badge, ...commonStyles.badgeWarning },
    inactive: { ...commonStyles.badge, ...commonStyles.badgeDanger },
    failed: { ...commonStyles.badge, ...commonStyles.badgeDanger },
  };
  return statusStyles[status?.toLowerCase()] || commonStyles.badge;
};

// Helper function to create button hover states
export const getButtonHoverStyle = (variant = 'primary') => {
  const hoverStyles = {
    primary: {
      background: colors.primaryHover,
      transform: 'translateY(-1px)',
    },
    secondary: {
      background: colors.gray300,
      transform: 'translateY(-1px)',
    },
    danger: {
      background: colors.dangerHover,
      transform: 'translateY(-1px)',
    },
  };
  return hoverStyles[variant] || hoverStyles.primary;
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  commonStyles,
  responsive,
  animations,
  getStatusBadgeStyle,
  getButtonHoverStyle,
};
