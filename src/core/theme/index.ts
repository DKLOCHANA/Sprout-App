/**
 * Sprout Theme System
 * Exports all theme tokens
 */

export { colors, type ColorKey } from './colors';
export { spacing, radii } from './spacing';
export { typography, type TypographyKey } from './typography';
export { shadows } from './shadows';
export { springs, durations, easings } from './animations';

export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  radii: require('./spacing').radii,
  typography: require('./typography').typography,
  shadows: require('./shadows').shadows,
  springs: require('./animations').springs,
  durations: require('./animations').durations,
} as const;

export type Theme = typeof theme;
