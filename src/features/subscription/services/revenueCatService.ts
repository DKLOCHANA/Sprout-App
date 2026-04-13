/**
 * RevenueCat Service
 * Integration with RevenueCat for subscription management
 */

import { Platform, Linking } from 'react-native';
import type { 
  ProductOffering, 
  PurchaseResult, 
  RestoreResult, 
  SubscriptionPlan,
  SubscriptionStatus,
  FormattedSubscriptionInfo,
} from '../types';
import { ENTITLEMENT_ID, OFFERING_ID, PRODUCT_IDS } from '../constants';
import { useSubscriptionStore } from '../store';
import { env } from '@core/config';

// Lazy-load RevenueCat to prevent crashes when native module is not available
let Purchases: typeof import('react-native-purchases').default | null = null;
let LOG_LEVEL: typeof import('react-native-purchases').LOG_LEVEL | null = null;
let PURCHASES_ERROR_CODE: typeof import('react-native-purchases').PURCHASES_ERROR_CODE | null = null;

type PurchasesPackage = import('react-native-purchases').PurchasesPackage;
type CustomerInfo = import('react-native-purchases').CustomerInfo;
type PurchasesError = import('react-native-purchases').PurchasesError;

/**
 * Safely load RevenueCat SDK
 * Returns false if the native module is not available (e.g., Expo Go)
 */
async function loadRevenueCat(): Promise<boolean> {
  if (Purchases !== null) {
    return true;
  }
  
  try {
    const purchasesModule = await import('react-native-purchases');
    Purchases = purchasesModule.default;
    LOG_LEVEL = purchasesModule.LOG_LEVEL;
    PURCHASES_ERROR_CODE = purchasesModule.PURCHASES_ERROR_CODE;
    return true;
  } catch (error) {
    console.warn('RevenueCat native module not available:', error);
    return false;
  }
}

/**
 * Get the appropriate API key based on platform and environment
 */
function getApiKey(): string {
  const isIOS = Platform.OS === 'ios';
  const useTestKey = __DEV__;
  
  if (isIOS) {
    // Use test key in development, production key in release builds
    return useTestKey ? env.revenueCat.iosTestKey : env.revenueCat.iosKey;
  } else {
    // Android keys (to be configured)
    return '';
  }
}

/**
 * Check if user has premium entitlement
 */
function checkPremiumEntitlement(customerInfo: CustomerInfo): boolean {
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

/**
 * Get expiration date from customer info
 */
function getExpirationDate(customerInfo: CustomerInfo): string | null {
  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  return entitlement?.expirationDate || null;
}

/**
 * Determine subscription plan from product ID
 */
function getPlanFromProductId(productId: string | undefined): SubscriptionPlan {
  if (!productId) return 'free';
  const lowerProductId = productId.toLowerCase();
  // Support various naming conventions: annual/yearly/_y, monthly/_m
  if (lowerProductId.includes('annual') || lowerProductId.includes('yearly') || lowerProductId.endsWith('_y')) {
    return 'premium_annual';
  }
  if (lowerProductId.includes('monthly') || lowerProductId.endsWith('_m')) {
    return 'premium_monthly';
  }
  return 'free';
}

/**
 * Convert RevenueCat package to our ProductOffering type
 */
function packageToOffering(pkg: PurchasesPackage): ProductOffering {
  const isAnnual = pkg.packageType === 'ANNUAL';
  const price = pkg.product.price;
  
  return {
    identifier: pkg.identifier,
    title: pkg.product.title,
    description: pkg.product.description,
    priceString: pkg.product.priceString,
    price,
    currencyCode: pkg.product.currencyCode,
    monthlyEquivalentPrice: isAnnual ? price / 12 : undefined,
    packageType: isAnnual ? 'annual' : 'monthly',
  };
}

/**
 * Extract full subscription status from customer info
 */
function extractSubscriptionStatus(customerInfo: CustomerInfo): Partial<SubscriptionStatus> {
  const isPremium = checkPremiumEntitlement(customerInfo);
  
  if (!isPremium) {
    return {
      isPremium: false,
      plan: 'free',
      expirationDate: null,
      willRenew: false,
      isInGracePeriod: false,
      isInBillingRetry: false,
      originalPurchaseDate: null,
      latestPurchaseDate: null,
      productIdentifier: null,
    };
  }

  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  const plan = getPlanFromProductId(entitlement?.productIdentifier);

  return {
    isPremium: true,
    plan,
    expirationDate: entitlement?.expirationDate || null,
    willRenew: entitlement?.willRenew ?? false,
    isInGracePeriod: entitlement?.periodType === 'GRACE_PERIOD',
    isInBillingRetry: entitlement?.billingIssueDetectedAt !== null,
    originalPurchaseDate: customerInfo.originalPurchaseDate || null,
    latestPurchaseDate: entitlement?.latestPurchaseDate || null,
    productIdentifier: entitlement?.productIdentifier || null,
  };
}

/**
 * Format subscription info for display
 */
function formatSubscriptionInfo(status: SubscriptionStatus): FormattedSubscriptionInfo {
  const planDisplayName = status.plan === 'premium_annual' 
    ? 'Annual Plan' 
    : status.plan === 'premium_monthly' 
      ? 'Monthly Plan' 
      : 'Free Plan';

  if (!status.expirationDate) {
    return {
      planDisplayName,
      expirationDisplayText: '',
      daysUntilExpiration: null,
      isExpiringSoon: false,
      isExpired: false,
    };
  }

  const expirationDate = new Date(status.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil(
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysUntilExpiration < 0;
  const isExpiringSoon = !isExpired && daysUntilExpiration <= 7 && !status.willRenew;

  // Format the date for display
  const dateOptions: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  const formattedDate = expirationDate.toLocaleDateString('en-US', dateOptions);

  let expirationDisplayText: string;
  if (isExpired) {
    expirationDisplayText = `Expired on ${formattedDate}`;
  } else if (status.willRenew) {
    expirationDisplayText = `Renews on ${formattedDate}`;
  } else {
    expirationDisplayText = `Expires on ${formattedDate}`;
  }

  return {
    planDisplayName,
    expirationDisplayText,
    daysUntilExpiration,
    isExpiringSoon,
    isExpired,
  };
}

/**
 * Check if error is a user cancellation
 */
function isPurchaseCancelledError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('cancelled') || message.includes('canceled')) {
      return true;
    }
  }
  
  // Check RevenueCat specific error
  if (PURCHASES_ERROR_CODE && error && typeof error === 'object' && 'code' in error) {
    const purchaseError = error as PurchasesError;
    return purchaseError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
  }
  
  return false;
}

export const revenueCatService = {
  /** Track initialization state */
  _isInitialized: false,
  /** Track if native module is available */
  _isAvailable: false,

  /**
   * Initialize RevenueCat SDK
   * Call this once on app startup
   */
  async initialize(userId?: string): Promise<void> {
    try {
      if (this._isInitialized) {
        console.log('RevenueCat already initialized');
        return;
      }

      // Try to load the native module
      this._isAvailable = await loadRevenueCat();
      
      if (!this._isAvailable || !Purchases) {
        console.warn('RevenueCat native module not available - skipping initialization');
        return;
      }

      const apiKey = getApiKey();
      
      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        return;
      }

      if (__DEV__ && LOG_LEVEL) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        console.log('RevenueCat initializing with TEST key');
      } else {
        console.log('RevenueCat initializing with PRODUCTION key');
      }

      await Purchases.configure({ apiKey, appUserID: userId });
      this._isInitialized = true;
      
      // Set up listener for customer info changes with error handling
      try {
        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          try {
            const status = extractSubscriptionStatus(customerInfo);
            useSubscriptionStore.getState().setSubscriptionStatus(status);
          } catch (listenerError) {
            console.warn('Error processing customer info update:', listenerError);
          }
        });
      } catch (listenerError) {
        console.warn('Failed to set up customer info listener:', listenerError);
        // Continue without real-time updates - sync will still work
      }

      // Sync subscription status on init
      await this.syncSubscriptionStatus();
    } catch (error) {
      console.error('RevenueCat initialization error:', error);
      // Don't throw - allow app to continue without RevenueCat
    }
  },

  /**
   * Check if SDK is initialized and available
   */
  isInitialized(): boolean {
    return this._isInitialized && this._isAvailable;
  },

  /**
   * Check if native module is available
   */
  isAvailable(): boolean {
    return this._isAvailable;
  },

  /**
   * Set user ID after login
   */
  async setUserId(userId: string): Promise<void> {
    try {
      if (!this._isAvailable || !Purchases) {
        console.log('RevenueCat not available, skipping setUserId');
        return;
      }
      
      console.log('RevenueCat setUserId:', userId);
      
      if (!this._isInitialized) {
        // Initialize with the user ID if not already initialized
        await this.initialize(userId);
        return;
      }
      
      // Log in to RevenueCat with Firebase user ID
      // This links purchases to the user account
      await Purchases.logIn(userId);
      console.log('RevenueCat user logged in successfully');
      
      // Sync subscription status after login
      await this.syncSubscriptionStatus();
    } catch (error) {
      console.error('RevenueCat login error:', error);
    }
  },

  /**
   * Clear user ID on logout
   */
  async clearUserId(): Promise<void> {
    try {
      if (!this._isAvailable || !Purchases) {
        useSubscriptionStore.getState().reset();
        return;
      }
      
      await Purchases.logOut();
      useSubscriptionStore.getState().reset();
    } catch (error) {
      console.error('RevenueCat logout error:', error);
    }
  },

  /**
   * Get available subscription offerings
   */
  async getOfferings(): Promise<ProductOffering[]> {
    try {
      if (!this._isAvailable || !Purchases) {
        console.warn('RevenueCat not available - cannot fetch offerings');
        return [];
      }
      
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        console.warn('No current offering available');
        return [];
      }

      const packages = currentOffering.availablePackages;
      return packages.map(packageToOffering);
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return [];
    }
  },

  /**
   * Purchase a subscription package
   */
  async purchasePackage(packageId: string): Promise<PurchaseResult> {
    try {
      if (!this._isAvailable || !Purchases) {
        return { success: false, error: 'In-app purchases not available' };
      }
      
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages.find(
        (p) => p.identifier === packageId
      );

      if (!pkg) {
        return { success: false, error: 'Package not found' };
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPremium = checkPremiumEntitlement(customerInfo);

      if (isPremium) {
        const status = extractSubscriptionStatus(customerInfo);
        useSubscriptionStore.getState().setSubscriptionStatus(status);

        return {
          success: true,
          plan: status.plan as SubscriptionPlan,
          expirationDate: status.expirationDate || undefined,
        };
      }

      return { success: false, error: 'Purchase completed but entitlement not found' };
    } catch (error: unknown) {
      // Check if user cancelled
      if (isPurchaseCancelledError(error)) {
        return { success: false, error: 'Purchase cancelled' };
      }

      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      console.error('Purchase error:', error);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<RestoreResult> {
    try {
      if (!this._isAvailable || !Purchases) {
        return { success: false, error: 'In-app purchases not available' };
      }
      
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = checkPremiumEntitlement(customerInfo);

      if (isPremium) {
        const status = extractSubscriptionStatus(customerInfo);
        useSubscriptionStore.getState().setSubscriptionStatus(status);

        return {
          success: true,
          restoredPlan: status.plan as SubscriptionPlan,
        };
      }

      return { success: false, error: 'No active subscription found' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Restore failed';
      console.error('Restore error:', error);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Sync subscription status from RevenueCat
   */
  async syncSubscriptionStatus(): Promise<void> {
    try {
      if (!this._isAvailable || !Purchases) {
        console.log('RevenueCat not available, skipping sync');
        return;
      }
      
      const customerInfo = await Purchases.getCustomerInfo();
      const status = extractSubscriptionStatus(customerInfo);
      
      // Log for debugging
      console.log('RevenueCat sync - isPremium:', status.isPremium, 'plan:', status.plan);
      
      useSubscriptionStore.getState().setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error syncing subscription status:', error);
    }
  },

  /**
   * Get formatted subscription info for display
   */
  getFormattedSubscriptionInfo(): FormattedSubscriptionInfo {
    const state = useSubscriptionStore.getState();
    return formatSubscriptionInfo({
      isPremium: state.isPremium,
      plan: state.plan,
      expirationDate: state.expirationDate,
      willRenew: state.willRenew,
      isInGracePeriod: state.isInGracePeriod,
      isInBillingRetry: state.isInBillingRetry,
      originalPurchaseDate: state.originalPurchaseDate,
      latestPurchaseDate: state.latestPurchaseDate,
      productIdentifier: state.productIdentifier,
    });
  },

  /**
   * Open the platform's subscription management page
   */
  async openManageSubscriptions(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // Open iOS subscription management
        await Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else {
        // Open Google Play subscription management
        await Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
    } catch (error) {
      console.error('Error opening subscription management:', error);
      throw error;
    }
  },

  /**
   * Check if RevenueCat is configured
   */
  isConfigured(): boolean {
    const apiKey = getApiKey();
    return !!apiKey;
  },

  /**
   * Get current environment info (for debugging)
   */
  getEnvironmentInfo(): { isTest: boolean; platform: string; isAvailable: boolean } {
    return {
      isTest: __DEV__,
      platform: Platform.OS,
      isAvailable: this._isAvailable,
    };
  },
};
