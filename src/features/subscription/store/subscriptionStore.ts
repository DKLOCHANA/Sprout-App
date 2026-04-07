/**
 * Subscription Store
 * Zustand store for subscription state with AsyncStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SubscriptionStatus, SubscriptionPlan, LimitCheckResult, FormattedSubscriptionInfo } from '../types';
import { FREE_TIER_LIMITS, REPORT_COUNT_KEY } from '../constants';

interface SubscriptionState extends SubscriptionStatus {
  /** Number of reports generated (for free tier tracking) */
  reportsGenerated: number;
  /** Loading state for subscription operations */
  isLoading: boolean;
  /** Store hydration status */
  isHydrated: boolean;
  /** Additional status fields */
  isInGracePeriod: boolean;
  isInBillingRetry: boolean;
  originalPurchaseDate: string | null;
  latestPurchaseDate: string | null;
  productIdentifier: string | null;
}

interface SubscriptionActions {
  /** Update subscription status after purchase/restore */
  setSubscriptionStatus: (status: Partial<SubscriptionStatus>) => void;
  /** Set premium status */
  setPremium: (isPremium: boolean, plan?: SubscriptionPlan, expirationDate?: string) => void;
  /** Increment report count */
  incrementReportCount: () => void;
  /** Reset report count (for testing/premium reset) */
  resetReportCount: () => void;
  /** Set loading state */
  setLoading: (isLoading: boolean) => void;
  /** Check if user can add a child */
  canAddChild: (currentChildCount: number) => LimitCheckResult;
  /** Check if user can generate a report */
  canGenerateReport: () => LimitCheckResult;
  /** Check if user can add a manual memory */
  canAddManualMemory: (currentMemoryCount: number) => LimitCheckResult;
  /** Get formatted subscription info for display */
  getFormattedInfo: () => FormattedSubscriptionInfo;
  /** Check if subscription is expiring soon */
  isExpiringSoon: () => boolean;
  /** Check if subscription has expired */
  hasExpired: () => boolean;
  /** Reset store */
  reset: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

const initialState: SubscriptionState = {
  isPremium: false,
  plan: 'free',
  expirationDate: null,
  willRenew: false,
  reportsGenerated: 0,
  isLoading: false,
  isHydrated: false,
  isInGracePeriod: false,
  isInBillingRetry: false,
  originalPurchaseDate: null,
  latestPurchaseDate: null,
  productIdentifier: null,
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSubscriptionStatus: (status) =>
        set((state) => ({
          ...state,
          ...status,
        })),

      setPremium: (isPremium, plan = 'free', expirationDate) =>
        set({
          isPremium,
          plan: isPremium ? plan : 'free',
          expirationDate: isPremium ? (expirationDate ?? null) : null,
        }),

      incrementReportCount: () =>
        set((state) => ({
          reportsGenerated: state.reportsGenerated + 1,
        })),

      resetReportCount: () => set({ reportsGenerated: 0 }),

      setLoading: (isLoading) => set({ isLoading }),

      canAddChild: (currentChildCount) => {
        const { isPremium } = get();
        const limit = FREE_TIER_LIMITS.maxChildren;
        
        if (isPremium) {
          return {
            allowed: true,
            currentCount: currentChildCount,
            limit: Infinity,
            featureName: 'children',
          };
        }

        return {
          allowed: currentChildCount < limit,
          currentCount: currentChildCount,
          limit,
          featureName: 'children',
        };
      },

      canGenerateReport: () => {
        const { isPremium, reportsGenerated } = get();
        const limit = FREE_TIER_LIMITS.maxReports;

        if (isPremium) {
          return {
            allowed: true,
            currentCount: reportsGenerated,
            limit: Infinity,
            featureName: 'reports',
          };
        }

        return {
          allowed: reportsGenerated < limit,
          currentCount: reportsGenerated,
          limit,
          featureName: 'reports',
        };
      },

      canAddManualMemory: (currentMemoryCount) => {
        const { isPremium } = get();
        const limit = FREE_TIER_LIMITS.maxManualMemories;

        if (isPremium) {
          return {
            allowed: true,
            currentCount: currentMemoryCount,
            limit: Infinity,
            featureName: 'memories',
          };
        }

        return {
          allowed: currentMemoryCount < limit,
          currentCount: currentMemoryCount,
          limit,
          featureName: 'memories',
        };
      },

      getFormattedInfo: (): FormattedSubscriptionInfo => {
        const state = get();
        const planDisplayName = state.plan === 'premium_annual' 
          ? 'Annual Plan' 
          : state.plan === 'premium_monthly' 
            ? 'Monthly Plan' 
            : 'Free Plan';

        if (!state.expirationDate) {
          return {
            planDisplayName,
            expirationDisplayText: '',
            daysUntilExpiration: null,
            isExpiringSoon: false,
            isExpired: false,
          };
        }

        const expirationDate = new Date(state.expirationDate);
        const now = new Date();
        const daysUntilExpiration = Math.ceil(
          (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const isExpired = daysUntilExpiration < 0;
        const isExpiringSoon = !isExpired && daysUntilExpiration <= 7 && !state.willRenew;

        const dateOptions: Intl.DateTimeFormatOptions = { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        };
        const formattedDate = expirationDate.toLocaleDateString('en-US', dateOptions);

        let expirationDisplayText: string;
        if (isExpired) {
          expirationDisplayText = `Expired on ${formattedDate}`;
        } else if (state.willRenew) {
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
      },

      isExpiringSoon: () => {
        const info = get().getFormattedInfo();
        return info.isExpiringSoon;
      },

      hasExpired: () => {
        const info = get().getFormattedInfo();
        return info.isExpired;
      },

      reset: () => set({ ...initialState, isHydrated: true }),
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Subscription store rehydration error:', error);
        }
        useSubscriptionStore.setState({ isHydrated: true });
      },
      partialize: (state) => ({
        isPremium: state.isPremium,
        plan: state.plan,
        expirationDate: state.expirationDate,
        willRenew: state.willRenew,
        reportsGenerated: state.reportsGenerated,
        isInGracePeriod: state.isInGracePeriod,
        isInBillingRetry: state.isInBillingRetry,
        originalPurchaseDate: state.originalPurchaseDate,
        latestPurchaseDate: state.latestPurchaseDate,
        productIdentifier: state.productIdentifier,
      }),
    }
  )
);

/**
 * Selector hooks for granular state access
 */
export const useIsPremium = () => useSubscriptionStore((state) => state.isPremium);
export const useSubscriptionPlan = () => useSubscriptionStore((state) => state.plan);
export const useSubscriptionLoading = () => useSubscriptionStore((state) => state.isLoading);
export const useExpirationDate = () => useSubscriptionStore((state) => state.expirationDate);
export const useWillRenew = () => useSubscriptionStore((state) => state.willRenew);
export const useFormattedSubscriptionInfo = () => useSubscriptionStore((state) => state.getFormattedInfo());
