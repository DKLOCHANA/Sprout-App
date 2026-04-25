/**
 * Subscription Constants
 * Free tier limits and RevenueCat product identifiers
 */

import type { FreeTierLimits, PaywallFeature } from '../types';

/**
 * Free tier usage limits
 */
export const FREE_TIER_LIMITS: FreeTierLimits = {
  maxChildren: 1,
  maxReports: 1,
  maxManualMemories: 3,
  maxMilestoneAchievements: 3,
} as const;

/**
 * RevenueCat product identifiers
 * These should match the products configured in RevenueCat dashboard
 */
export const PRODUCT_IDS = {
  MONTHLY: 'Sprout_monthly',  // or 'Sprout_M'
  ANNUAL: 'Sprout_yearly',    // or 'Sprout_Y'
} as const;

/**
 * RevenueCat entitlement identifier
 * Must match EXACTLY what's configured in RevenueCat dashboard
 */
export const ENTITLEMENT_ID = 'Sprout: Baby Milestone Tracker Premium';

/**
 * RevenueCat offering identifier
 */
export const OFFERING_ID = 'default';

/**
 * Paywall features to display
 */
export const PAYWALL_FEATURES: PaywallFeature[] = [
  {
    id: 'pdf-export',
    icon: 'document-text',
    title: 'Pediatrician PDF Export',
    description: 'Instant clinical reports for checkups.',
  },
  {
    id: 'multi-child',
    icon: 'people',
    title: 'Multi-child support',
    description: 'Track all your little ones in one place.',
  },
  {
    id: 'unlimited-memories',
    icon: 'book',
    title: 'Unlimited memories',
    description: 'Store every milestone without limits.',
  },
] as const;

/**
 * Storage key for report generation count
 */
export const REPORT_COUNT_KEY = 'report-generation-count';
