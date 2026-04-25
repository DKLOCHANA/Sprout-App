/**
 * useManageSubscriptionViewModel Hook
 * Business logic for the Manage Subscription screen
 */

import { useCallback, useState } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionStore } from '../store';
import { revenueCatService } from '../services';
import type { FormattedSubscriptionInfo, SubscriptionPlan } from '../types';

interface UseManageSubscriptionViewModelReturn {
  /** Whether user has premium subscription */
  isPremium: boolean;
  /** Current subscription plan */
  plan: SubscriptionPlan;
  /** Formatted subscription info for display */
  subscriptionInfo: FormattedSubscriptionInfo;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Whether a restore operation is in progress */
  isRestoring: boolean;
  /** Open platform subscription settings (App Store / Play Store) */
  handleSubscriptionSettings: () => Promise<void>;
  /** Navigate to paywall to change plan */
  handleChangePlan: () => void;
  /** Restore purchases from App Store / Play Store */
  handleRestorePurchases: () => Promise<void>;
  /** Downgrade to free (cancel subscription via platform) */
  handleDowngradeToFree: () => void;
  /** Navigate back */
  handleGoBack: () => void;
}

export function useManageSubscriptionViewModel(): UseManageSubscriptionViewModelReturn {
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(false);

  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const plan = useSubscriptionStore((s) => s.plan);
  const willRenew = useSubscriptionStore((s) => s.willRenew);
  const getFormattedInfo = useSubscriptionStore((s) => s.getFormattedInfo);

  const subscriptionInfo = getFormattedInfo();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubscriptionSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else {
        await Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
    } catch {
      Alert.alert('Error', 'Unable to open subscription settings. Please try again.');
    }
  }, []);

  const handleChangePlan = useCallback(() => {
    router.push('/paywall');
  }, [router]);

  const handleRestorePurchases = useCallback(async () => {
    setIsRestoring(true);
    try {
      const result = await revenueCatService.restorePurchases();
      if (result.success) {
        Alert.alert('Success', 'Your subscription has been restored.');
      } else {
        Alert.alert(
          'No Subscription Found',
          "We couldn't find an active subscription for your account.",
        );
      }
    } catch {
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const handleDowngradeToFree = useCallback(() => {
    Alert.alert(
      'Downgrade to Free',
      'To cancel your subscription, you\'ll be redirected to your device\'s subscription settings. Your Premium access will continue until the end of your current billing period.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              if (Platform.OS === 'ios') {
                await Linking.openURL('https://apps.apple.com/account/subscriptions');
              } else {
                await Linking.openURL('https://play.google.com/store/account/subscriptions');
              }
            } catch {
              Alert.alert('Error', 'Unable to open subscription settings.');
            }
          },
        },
      ],
    );
  }, []);

  return {
    isPremium,
    plan,
    subscriptionInfo,
    willRenew,
    isRestoring,
    handleSubscriptionSettings,
    handleChangePlan,
    handleRestorePurchases,
    handleDowngradeToFree,
    handleGoBack,
  };
}
