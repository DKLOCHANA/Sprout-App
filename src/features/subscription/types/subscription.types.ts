/**
 * Subscription Types
 * Type definitions for subscription and paywall features
 */

/**
 * Subscription plan identifiers
 */
export type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_annual';

/**
 * Subscription period type
 */
export type SubscriptionPeriod = 'monthly' | 'annual';

/**
 * Subscription status
 */
export interface SubscriptionStatus {
  /** Whether user has active premium subscription */
  isPremium: boolean;
  /** Current subscription plan */
  plan: SubscriptionPlan;
  /** Expiration date for premium (null for free) */
  expirationDate: string | null;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Whether subscription is in grace period */
  isInGracePeriod?: boolean;
  /** Whether subscription is in billing retry period */
  isInBillingRetry?: boolean;
  /** Original purchase date */
  originalPurchaseDate?: string | null;
  /** Latest purchase date */
  latestPurchaseDate?: string | null;
  /** Product identifier */
  productIdentifier?: string | null;
}

/**
 * Formatted subscription info for display
 */
export interface FormattedSubscriptionInfo {
  /** Display text for plan type (e.g., "Annual Plan") */
  planDisplayName: string;
  /** Display text for expiration (e.g., "Renews on Jan 15, 2025") */
  expirationDisplayText: string;
  /** Days until expiration (negative if expired) */
  daysUntilExpiration: number | null;
  /** Whether subscription is expiring soon (within 7 days) */
  isExpiringSoon: boolean;
  /** Whether subscription has expired */
  isExpired: boolean;
}

/**
 * RevenueCat product offering
 */
export interface ProductOffering {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
  /** For annual plans - monthly equivalent price */
  monthlyEquivalentPrice?: number;
  /** Package type from RevenueCat */
  packageType: 'monthly' | 'annual';
}

/**
 * Purchase result from RevenueCat
 */
export interface PurchaseResult {
  success: boolean;
  plan?: SubscriptionPlan;
  expirationDate?: string;
  error?: string;
}

/**
 * Restore purchases result
 */
export interface RestoreResult {
  success: boolean;
  restoredPlan?: SubscriptionPlan;
  error?: string;
}

/**
 * Free tier limits configuration
 */
export interface FreeTierLimits {
  maxChildren: number;
  maxReports: number;
  maxManualMemories: number;
  maxMilestoneAchievements: number;
}

/**
 * Feature limit check result
 */
export interface LimitCheckResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  featureName: string;
}

/**
 * Paywall feature item for display
 */
export interface PaywallFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

/**
 * Customer Center action type
 */
export type CustomerCenterAction =
  | 'CANCEL'
  | 'REFUND'
  | 'CHANGE_PLAN'
  | 'BILLING_ISSUE';

/**
 * RevenueCat configuration options
 */
export interface RevenueCatConfig {
  /** Whether to use test key in development */
  useTestKey: boolean;
  /** iOS production API key */
  iosProductionKey: string;
  /** iOS test API key */
  iosTestKey: string;
  /** Android production API key */
  androidProductionKey: string;
  /** Android test API key */
  androidTestKey: string;
}
