/**
 * Sprout App Animation Presets
 * Reanimated spring configs and timing durations
 */

/**
 * Spring animation presets for Reanimated withSpring()
 */
export const springs = {
  /** Subtle transitions - for background changes, fades */
  gentle: { damping: 20, stiffness: 180 },
  /** Quick responses - for button presses, toggles */
  snappy: { damping: 16, stiffness: 300 },
  /** Playful interactions - for celebratory animations */
  bouncy: { damping: 12, stiffness: 250 },
} as const;

/**
 * Timing durations in milliseconds for withTiming()
 */
export const durations = {
  /** Micro-interactions - checkmarks, icon changes */
  fast: 150,
  /** Standard transitions - screen changes, modals */
  normal: 250,
  /** Entrance/exit animations - splash, onboarding */
  slow: 400,
} as const;

/**
 * Easing curves (use with withTiming)
 */
export const easings = {
  /** Standard ease-in-out for most transitions */
  default: 'ease-in-out',
  /** Quick start, slow end - for entering elements */
  decelerate: 'ease-out',
  /** Slow start, quick end - for exiting elements */
  accelerate: 'ease-in',
} as const;

export type SpringPreset = keyof typeof springs;
export type Duration = keyof typeof durations;
