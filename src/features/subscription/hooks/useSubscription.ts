/**
 * useSubscription Hook
 * Provides subscription status and limit checking utilities
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionStore, useFormattedSubscriptionInfo } from '../store';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMemoryStore } from '@/features/memories/store';
import { FREE_TIER_LIMITS } from '../constants';
import { revenueCatService } from '../services';
import type { FormattedSubscriptionInfo } from '../types';

interface UseSubscriptionReturn {
  /** Whether user has premium subscription */
  isPremium: boolean;
  /** Formatted subscription info for display */
  subscriptionInfo: FormattedSubscriptionInfo;
  /** Expiration date */
  expirationDate: string | null;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Whether subscription is expiring soon */
  isExpiringSoon: boolean;
  /** Check if user can add a child, show alert and navigate to paywall if not */
  checkCanAddChild: () => boolean;
  /** Check if user can generate a report, show alert and navigate to paywall if not */
  checkCanGenerateReport: () => boolean;
  /** Check if user can add a manual memory, show alert and navigate to paywall if not */
  checkCanAddManualMemory: () => boolean;
  /** Navigate to paywall screen */
  showPaywall: () => void;
  /** Open subscription management (App Store/Play Store) */
  manageSubscription: () => Promise<void>;
  /** Restore purchases */
  restorePurchases: () => Promise<boolean>;
  /** Sync subscription status from RevenueCat */
  syncSubscription: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const router = useRouter();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const expirationDate = useSubscriptionStore((state) => state.expirationDate);
  const willRenew = useSubscriptionStore((state) => state.willRenew);
  const canAddChild = useSubscriptionStore((state) => state.canAddChild);
  const canGenerateReport = useSubscriptionStore((state) => state.canGenerateReport);
  const canAddManualMemory = useSubscriptionStore((state) => state.canAddManualMemory);
  const getFormattedInfo = useSubscriptionStore((state) => state.getFormattedInfo);
  const isExpiringSoonCheck = useSubscriptionStore((state) => state.isExpiringSoon);
  
  const babies = useBabyStore((state) => state.babies);
  const memories = useMemoryStore((state) => state.memories);

  const subscriptionInfo = getFormattedInfo();
  const isExpiringSoon = isExpiringSoonCheck();

  const showPaywall = useCallback(() => {
    router.push('/paywall');
  }, [router]);

  const checkCanAddChild = useCallback((): boolean => {
    const result = canAddChild(babies.length);
    if (!result.allowed) {
      Alert.alert(
        'Upgrade to Premium',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxChildren} child. Upgrade to premium to track unlimited children.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Upgrade Now',
            onPress: showPaywall,
            style: 'default',
          },
        ]
      );
      return false;
    }
    return true;
  }, [canAddChild, babies.length, showPaywall]);

  const checkCanGenerateReport = useCallback((): boolean => {
    const result = canGenerateReport();
    if (!result.allowed) {
      Alert.alert(
        'Upgrade to Premium',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxReports} report. Upgrade to premium to generate unlimited reports.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Upgrade Now',
            onPress: showPaywall,
            style: 'default',
          },
        ]
      );
      return false;
    }
    return true;
  }, [canGenerateReport, showPaywall]);

  const checkCanAddManualMemory = useCallback((): boolean => {
    // Count only manual memories (not from milestones/growth)
    const manualMemoryCount = memories.length;
    const result = canAddManualMemory(manualMemoryCount);
    if (!result.allowed) {
      Alert.alert(
        'Upgrade to Premium',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxManualMemories} manual memories. Upgrade to premium to store unlimited memories.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Upgrade Now',
            onPress: showPaywall,
            style: 'default',
          },
        ]
      );
      return false;
    }
    return true;
  }, [canAddManualMemory, memories.length, showPaywall]);

  const manageSubscription = useCallback(async (): Promise<void> => {
    try {
      await revenueCatService.openManageSubscriptions();
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open subscription management. Please try again.'
      );
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      const result = await revenueCatService.restorePurchases();
      if (result.success) {
        Alert.alert('Success', 'Your subscription has been restored.');
        return true;
      } else {
        Alert.alert(
          'No Subscription Found',
          'We couldn\'t find an active subscription for your account.'
        );
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
      return false;
    }
  }, []);

  const syncSubscription = useCallback(async (): Promise<void> => {
    await revenueCatService.syncSubscriptionStatus();
  }, []);

  return {
    isPremium,
    subscriptionInfo,
    expirationDate,
    willRenew,
    isExpiringSoon,
    checkCanAddChild,
    checkCanGenerateReport,
    checkCanAddManualMemory,
    showPaywall,
    manageSubscription,
    restorePurchases,
    syncSubscription,
  };
}
