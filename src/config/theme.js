/**
 * ========================================
 * THEME CONFIGURATION
 * Production-ready theme system
 * ========================================
 */

// Base Theme Configuration
export const baseTheme = {
  colors: {
    // Primary Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Secondary Colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Success Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning Colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error Colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Neutral Colors
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  
  // Spacing
  spacing: {
    0: '0px',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    40: '10rem',     // 160px
    48: '12rem',     // 192px
    56: '14rem',     // 224px
    64: '16rem',     // 256px
  },
  
  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 1, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Light Theme
export const lightTheme = {
  ...baseTheme,
  name: 'light',
  colors: {
    ...baseTheme.colors,
    background: baseTheme.colors.neutral[50],
    foreground: baseTheme.colors.neutral[900],
    card: baseTheme.colors.neutral[0],
    cardForeground: baseTheme.colors.neutral[900],
    popover: baseTheme.colors.neutral[0],
    popoverForeground: baseTheme.colors.neutral[900],
    primary: baseTheme.colors.primary[900],
    primaryForeground: baseTheme.colors.neutral[50],
    secondary: baseTheme.colors.neutral[100],
    secondaryForeground: baseTheme.colors.neutral[900],
    muted: baseTheme.colors.neutral[100],
    mutedForeground: baseTheme.colors.neutral[500],
    accent: baseTheme.colors.neutral[100],
    accentForeground: baseTheme.colors.neutral[900],
    destructive: baseTheme.colors.error[500],
    destructiveForeground: baseTheme.colors.neutral[50],
    border: baseTheme.colors.neutral[200],
    input: baseTheme.colors.neutral[50],
    ring: baseTheme.colors.primary[500],
  },
};

// Dark Theme
export const darkTheme = {
  ...baseTheme,
  name: 'dark',
  colors: {
    ...baseTheme.colors,
    background: baseTheme.colors.neutral[900],
    foreground: baseTheme.colors.neutral[50],
    card: baseTheme.colors.neutral[800],
    cardForeground: baseTheme.colors.neutral[50],
    popover: baseTheme.colors.neutral[800],
    popoverForeground: baseTheme.colors.neutral[50],
    primary: baseTheme.colors.primary[50],
    primaryForeground: baseTheme.colors.neutral[900],
    secondary: baseTheme.colors.neutral[800],
    secondaryForeground: baseTheme.colors.neutral[50],
    muted: baseTheme.colors.neutral[800],
    mutedForeground: baseTheme.colors.neutral[400],
    accent: baseTheme.colors.neutral[800],
    accentForeground: baseTheme.colors.neutral[50],
    destructive: baseTheme.colors.error[500],
    destructiveForeground: baseTheme.colors.neutral[50],
    border: baseTheme.colors.neutral[700],
    input: baseTheme.colors.neutral[800],
    ring: baseTheme.colors.primary[400],
  },
};

// Theme Context Value
export const getTheme = (themeName = 'light') => {
  switch (themeName) {
    case 'dark':
      return darkTheme;
    case 'light':
    default:
      return lightTheme;
  }
};

// CSS Variables Generator
export const generateCSSVariables = (theme) => {
  const variables = {};
  
  // Generate color variables
  Object.entries(theme.colors).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'string') {
      variables[`--color-${colorName}`] = colorValues;
    } else {
      Object.entries(colorValues).forEach(([shade, value]) => {
        variables[`--color-${colorName}-${shade}`] = value;
      });
    }
  });
  
  // Generate typography variables
  Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
    variables[`--font-size-${size}`] = value;
  });
  
  Object.entries(theme.typography.fontWeight).forEach(([weight, value]) => {
    variables[`--font-weight-${weight}`] = value;
  });
  
  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([space, value]) => {
    variables[`--spacing-${space}`] = value;
  });
  
  // Generate border radius variables
  Object.entries(theme.borderRadius).forEach(([radius, value]) => {
    variables[`--border-radius-${radius}`] = value;
  });
  
  return variables;
};

export default {
  baseTheme,
  lightTheme,
  darkTheme,
  getTheme,
  generateCSSVariables,
};
