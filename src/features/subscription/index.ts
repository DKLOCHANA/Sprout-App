/**
 * Subscription Feature Module
 * Exports all subscription-related components, hooks, and utilities
 */

// Store
export {
  useSubscriptionStore,
  useIsPremium,
  useSubscriptionPlan,
  useSubscriptionLoading,
  useExpirationDate,
  useWillRenew,
  useFormattedSubscriptionInfo,
} from './store';

// Hooks
export { usePaywallViewModel, useSubscription } from './hooks';

// Services
export { revenueCatService } from './services';

// Components
export { FeatureCard, PricingCard } from './components';

// Screens
export { PaywallScreen, ManageSubscriptionScreen } from './screens';

// Constants
export { FREE_TIER_LIMITS, PAYWALL_FEATURES, PRODUCT_IDS, ENTITLEMENT_ID } from './constants';

// Types
export type {
  SubscriptionStatus,
  SubscriptionPlan,
  SubscriptionPeriod,
  ProductOffering,
  PurchaseResult,
  RestoreResult,
  FreeTierLimits,
  LimitCheckResult,
  PaywallFeature,
  FormattedSubscriptionInfo,
  CustomerCenterAction,
  RevenueCatConfig,
} from './types';
