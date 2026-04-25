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
import { useMilestoneStore } from '@/features/milestones/store';
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
  /** Check if user can mark a milestone as achieved, show alert and navigate to paywall if not */
  checkCanAchieveMilestone: () => boolean;
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
  const canAchieveMilestone = useSubscriptionStore((state) => state.canAchieveMilestone);
  const getFormattedInfo = useSubscriptionStore((state) => state.getFormattedInfo);
  const isExpiringSoonCheck = useSubscriptionStore((state) => state.isExpiringSoon);
  
  const babies = useBabyStore((state) => state.babies);
  const getSelectedBaby = useBabyStore((state) => state.getSelectedBaby);
  const memories = useMemoryStore((state) => state.memories);
  const milestoneAchievements = useMilestoneStore((state) => state.achievements);

  const subscriptionInfo = getFormattedInfo();
  const isExpiringSoon = isExpiringSoonCheck();
  const hasExpired = useSubscriptionStore((state) => state.hasExpired);

  const showPaywall = useCallback(() => {
    router.push('/paywall');
  }, [router]);

  const showExpiredAlert = useCallback(() => {
    Alert.alert(
      'Subscription Expired',
      'Your premium subscription has expired. Renew to continue using premium features.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Renew Now', onPress: showPaywall, style: 'default' },
      ]
    );
  }, [showPaywall]);

  const checkCanAddChild = useCallback((): boolean => {
    if (isPremium && hasExpired()) {
      showExpiredAlert();
      return false;
    }
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
  }, [canAddChild, babies.length, showPaywall, isPremium, hasExpired, showExpiredAlert]);

  const checkCanGenerateReport = useCallback((): boolean => {
    if (isPremium && hasExpired()) {
      showExpiredAlert();
      return false;
    }
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
  }, [canGenerateReport, showPaywall, isPremium, hasExpired, showExpiredAlert]);

  const checkCanAddManualMemory = useCallback((): boolean => {
    if (isPremium && hasExpired()) {
      showExpiredAlert();
      return false;
    }
    // Count only manual memories for the current baby
    const baby = getSelectedBaby();
    const manualMemoryCount = baby
      ? memories.filter((m) => m.babyId === baby.id).length
      : memories.length;
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
  }, [canAddManualMemory, memories, getSelectedBaby, showPaywall, isPremium, hasExpired, showExpiredAlert]);

  const checkCanAchieveMilestone = useCallback((): boolean => {
    if (isPremium && hasExpired()) {
      showExpiredAlert();
      return false;
    }
    const baby = getSelectedBaby();
    const achievedCount = baby
      ? milestoneAchievements.filter((a) => a.babyId === baby.id && a.status === 'achieved').length
      : 0;
    const result = canAchieveMilestone(achievedCount);
    if (!result.allowed) {
      Alert.alert(
        'Upgrade to Premium',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxMilestoneAchievements} completed milestones. Upgrade to premium to track unlimited milestones.`,
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
  }, [canAchieveMilestone, milestoneAchievements, getSelectedBaby, showPaywall, isPremium, hasExpired, showExpiredAlert]);

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
    checkCanAchieveMilestone,
    showPaywall,
    manageSubscription,
    restorePurchases,
    syncSubscription,
  };
}
