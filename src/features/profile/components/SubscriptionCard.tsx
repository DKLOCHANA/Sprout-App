/**
 * SubscriptionCard Component
 * Displays current subscription status and manages subscription
 */

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, shadows } from '@/core/theme';
import { Typography } from '@/shared/components/ui';
import { useIsPremium, useSubscriptionPlan } from '@/features/subscription/store';
import { useSubscription } from '@/features/subscription/hooks';

interface SubscriptionCardProps {
  onManageSubscription?: () => void;
}

function SubscriptionCardComponent({ onManageSubscription }: SubscriptionCardProps) {
  const router = useRouter();
  const isPremium = useIsPremium();
  const plan = useSubscriptionPlan();
  const { 
    showPaywall, 
    subscriptionInfo, 
    isExpiringSoon,
    manageSubscription,
  } = useSubscription();

  const navigateToManageSubscription = () => {
    router.push('/manage-subscription');
  };

  const handlePress = () => {
    if (isPremium) {
      navigateToManageSubscription();
    } else {
      showPaywall();
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.premiumTouchable}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
            style={styles.premiumGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={24} color={colors.textOnPrimary} />
            </View>
            <View style={styles.content}>
              <Typography variant="body" weight="600" color="textOnPrimary">
                Premium Active
              </Typography>
              <Typography variant="bodySmall" color="textOnPrimary" style={styles.subtitle}>
                {subscriptionInfo.planDisplayName}
              </Typography>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={20} color={colors.textOnPrimary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Expiration Info */}
        {subscriptionInfo.expirationDisplayText && (
          <View style={[
            styles.expirationContainer,
            isExpiringSoon && styles.expirationContainerWarning,
          ]}>
            <Ionicons 
              name={isExpiringSoon ? 'warning' : 'time-outline'} 
              size={16} 
              color={isExpiringSoon ? colors.warning : colors.textSecondary} 
            />
            <Typography 
              variant="caption" 
              color={isExpiringSoon ? 'warning' : 'textSecondary'}
              style={styles.expirationText}
            >
              {subscriptionInfo.expirationDisplayText}
            </Typography>
          </View>
        )}

        {/* Manage Subscription Button */}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={navigateToManageSubscription}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={16} color={colors.primary} />
          <Typography variant="bodySmall" color="primary" weight="500" style={styles.manageText}>
            Manage Subscription
          </Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.freeCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Typography variant="body" weight="600">
            Free Plan
          </Typography>
          <Typography variant="bodySmall" color="textSecondary" style={styles.subtitle}>
            Tap to upgrade to Premium
          </Typography>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const SubscriptionCard = memo(SubscriptionCardComponent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  premiumTouchable: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 72,
  },
  freeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 72,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs / 2,
    opacity: 0.9,
  },
  arrowContainer: {
    marginLeft: spacing.sm,
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expirationContainerWarning: {
    backgroundColor: colors.warningDim,
  },
  expirationText: {
    marginLeft: spacing.xs,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  manageText: {
    marginLeft: spacing.xs,
  },
});
