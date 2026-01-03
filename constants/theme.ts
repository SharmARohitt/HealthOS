/**
 * Design System - Dark-first, minimal, authoritative theme
 * Inspired by high-trust systems (medical instruments, aviation dashboards)
 */

export const Colors = {
  // Base colors - Graphite and slate
  background: {
    primary: '#0a0e13', // Deep dark background
    secondary: '#141922', // Slightly lighter for cards
    tertiary: '#1e2530', // Hover states
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#b8bcc8',
    tertiary: '#7a7f8a',
    disabled: '#4a4f5a',
  },
  
  // Accent colors - Deep blue
  accent: {
    primary: '#2b5ce6',
    secondary: '#1e44c7',
    tertiary: '#1539a3',
  },
  
  // Status colors - Restrained
  status: {
    verified: '#10b981', // Subtle green
    disputed: '#f59e0b', // Amber warning
    pending: '#6b7280', // Neutral gray
    error: '#ef4444', // Red (use sparingly)
    superseded: '#6366f1', // Indigo
  },
  
  // Borders and dividers
  border: {
    light: '#2a2f3a',
    medium: '#1f2429',
    dark: '#151920',
  },
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'Courier', // For hashes, codes
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Animation timing - Subtle and purposeful
export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Design easing
};

