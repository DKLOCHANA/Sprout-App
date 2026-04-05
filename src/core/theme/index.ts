/**
 * Sprout Theme System
 * Exports all theme tokens
 */

export { colors } from './colors';
export { spacing, radii } from './spacing';
export { typography } from './typography';
export { shadows } from './shadows';

export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  radii: require('./spacing').radii,
  typography: require('./typography').typography,
  shadows: require('./shadows').shadows,
} as const;

export type Theme = typeof theme;
