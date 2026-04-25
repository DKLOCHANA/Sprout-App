/**
 * ManageSubscriptionScreen
 * Displays current subscription status with management options
 */

import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import { Typography } from '@/shared/components/ui';
import { useManageSubscriptionViewModel } from '../hooks/useManageSubscriptionViewModel';

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return <Typography variant="caption" weight="600" color="textSecondary" style={styles.sectionHeader}>{title}</Typography>;
}

interface ManageRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  labelColor?: string;
  iconColor?: string;
  isLast?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function ManageRow({
  icon,
  label,
  onPress,
  labelColor,
  iconColor,
  isLast = false,
  disabled = false,
  loading = false,
}: ManageRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={disabled || loading}
    >
      <View style={styles.rowIconContainer}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || colors.textPrimary}
        />
      </View>
      <Typography
        variant="body"
        style={[styles.rowLabel, labelColor ? { color: labelColor } : undefined]}
      >
        {label}
      </Typography>
      {loading ? (
        <ActivityIndicator size="small" color={colors.textSecondary} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

function ManageSubscriptionScreenComponent() {
  const {
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
  } = useManageSubscriptionViewModel();

  const planTitle = isPremium ? 'Sprout Premium' : 'Sprout Free';
  const planSubtitle = subscriptionInfo.planDisplayName;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h3" weight="600" style={styles.headerTitle}>
          Manage Subscription
        </Typography>
        {/* Spacer to balance the back button */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Plan Status Card ─────────────────────────────────── */}
        <View style={styles.planCard}>
          {/* Active / Free badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badgeSpacer} />
            <View style={[styles.badge, isPremium ? styles.badgeActive : styles.badgeFree]}>
              <Typography variant="caption" weight="600" color="textOnPrimary">
                {isPremium ? 'ACTIVE' : 'FREE'}
              </Typography>
            </View>
          </View>

          {/* Plan name & type */}
          <Typography variant="h2" weight="700" style={styles.planTitle}>
            {planTitle}
          </Typography>
          <Typography variant="body" color="textSecondary" style={styles.planSubtitle}>
            {planSubtitle}
          </Typography>

          {/* Renewal / Expiration info */}
          {isPremium && subscriptionInfo.expirationDisplayText ? (
            <View style={styles.renewalContainer}>
              <View style={styles.renewalIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View>
                <Typography variant="bodySmall" color="textSecondary">
                  {willRenew ? 'Renews on' : 'Expires on'}
                </Typography>
                <Typography variant="body" weight="600">
                  {subscriptionInfo.expirationDisplayText.replace(/^(Renews on |Expires on |Expired on )/, '')}
                </Typography>
              </View>
            </View>
          ) : null}
        </View>

        {/* ── Manage Section ───────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="MANAGE" />
          <View style={styles.sectionCard}>
            <ManageRow
              icon="settings-outline"
              label="Subscription Settings"
              onPress={handleSubscriptionSettings}
            />
            <ManageRow
              icon="swap-horizontal-outline"
              label="Change Plan"
              onPress={handleChangePlan}
            />
            <ManageRow
              icon="refresh-outline"
              label="Restore Purchases"
              onPress={handleRestorePurchases}
              loading={isRestoring}
              disabled={isRestoring}
              isLast
            />
          </View>
        </View>

        {/* ── Cancel Section (only for premium users) ──────────── */}
        {isPremium && (
          <View style={styles.section}>
            <SectionHeader title="CANCEL" />
            <View style={styles.sectionCard}>
              <ManageRow
                icon="arrow-down-circle-outline"
                label="Downgrade to Free"
                onPress={handleDowngradeToFree}
                labelColor={colors.error}
                iconColor={colors.error}
                isLast
              />
              <View style={styles.cancelNote}>
                <Typography variant="bodySmall" color="textSecondary">
                  Your Premium access will continue until the end of your current billing period.
                </Typography>
              </View>
            </View>
          </View>
        )}

        {/* ── Upgrade prompt (only for free users) ─────────────── */}
        {!isPremium && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleChangePlan}
                activeOpacity={0.8}
              >
                <Ionicons name="star" size={20} color={colors.textOnPrimary} />
                <Typography
                  variant="button"
                  color="textOnPrimary"
                  style={styles.upgradeLabel}
                >
                  Upgrade to Premium
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export const ManageSubscriptionScreen = memo(ManageSubscriptionScreenComponent);

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  /* ScrollView */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['2xl'],
  },

  /* Plan Status Card */
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  badgeSpacer: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  badgeActive: {
    backgroundColor: colors.primary,
  },
  badgeFree: {
    backgroundColor: colors.textSecondary,
  },
  planTitle: {
    marginBottom: spacing.xs,
  },
  planSubtitle: {
    marginBottom: spacing.md,
  },
  renewalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  renewalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  /* Sections */
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },

  /* Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    flex: 1,
  },

  /* Cancel note */
  cancelNote: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },

  /* Upgrade button (free users) */
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  upgradeLabel: {
    marginLeft: spacing.sm,
  },
});
