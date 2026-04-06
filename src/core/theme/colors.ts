/**
 * Sprout App Color Palette
 * Soft Pastel Design System
 */

export const colors = {
  // Primary - Sage Green
  primary: '#4A90D9',
  primaryLight: '#6BA5E7',
  primaryDark: '#5B9FE3',
  primaryDim: 'rgba(124, 184, 153, 0.15)',

  // Secondary - Soft Blue (for CTA buttons)
  secondary: '#4A90D9',
  secondaryLight: '#6BA5E7',
  secondaryGradientStart: '#5B9FE3',
  secondaryGradientEnd: '#3A7FC9',

  // Background
  background: '#FFFDF9',
  backgroundSecondary: '#F5F3EF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F6F2',
  surfaceTertiary: '#F0EDE8',

  // Text
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textMuted: '#B2BEC3',
  textDisabled: '#C5C5C5',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Input
  inputBackground: '#F5F3EF',
  inputBorder: '#E8E4DF',
  inputBorderFocus: '#7CB899',
  inputPlaceholder: '#B2BEC3',
  inputText: '#2D3436',
  inputLabel: '#636E72',

  // Semantic
  success: '#7CB899',
  successDim: 'rgba(124, 184, 153, 0.15)',
  warning: '#FFEAA7',
  warningDim: 'rgba(255, 234, 167, 0.15)',
  error: '#E57373',
  errorDim: 'rgba(229, 115, 115, 0.15)',
  info: '#74B9FF',
  infoDim: 'rgba(116, 185, 255, 0.15)',

  // Category Colors
  feeding: '#FFB8B8',
  sleep: '#B8D4FF',
  diaper: '#FFE4B8',
  milestone: '#D4B8FF',

  // Buttons
  buttonDark: '#1A1A1A',
  buttonDarkPressed: '#333333',
  buttonLight: '#FFFFFF',
  buttonLightPressed: '#F5F5F5',
  buttonDisabled: '#E0E0E0',

  // UI
  border: '#E8E4DF',
  borderLight: '#F0ECE6',
  divider: '#F0ECE6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',

  // Link
  link: '#4A90D9',
  linkPressed: '#3A7FC9',

  // Growth Percentile Colors
  percentileVeryLow: '#DC2626',    // red-600 - below 3rd
  percentileLow: '#F59E0B',        // amber-500 - 3rd-15th
  percentileNormal: '#10B981',     // emerald-500 - 15th-85th  
  percentileHigh: '#F59E0B',       // amber-500 - 85th-97th
  percentileVeryHigh: '#DC2626',   // red-600 - above 97th

  // Chart Colors
  chartLine: '#E57373',            // Light red for chart lines
  chartLineSecondary: '#FFB74D',   // Light orange for secondary lines
  chartReference: '#9E9E9E',       // Gray for reference/legend
  chartBabyGrowth: '#4A90D9',      // Blue for baby's growth line

  // Status/Progress Colors  
  statusInProgress: '#F5A623',     // Amber for in-progress state
  statusPending: '#9E9E9E',        // Gray for pending/not-yet
} as const;

export type ColorKey = keyof typeof colors;
