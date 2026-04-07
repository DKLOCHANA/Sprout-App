/**
 * PaywallScreen
 * Premium subscription paywall matching the design reference
 */

import React, { memo, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors, spacing, radii, typography, shadows } from '@/core/theme';
import { Typography, PrimaryButton } from '@/shared/components/ui';
import { FeatureCard, PricingCard } from '../components';
import { usePaywallViewModel } from '../hooks';
import { revenueCatService } from '../services';
import type { ProductOffering } from '../types';

// Check if running in Expo Go (no native modules available)
const isExpoGo = Constants.appOwnership === 'expo';

// Mock offerings for when RevenueCat is not configured or in Expo Go
const MOCK_OFFERINGS: ProductOffering[] = [
  {
    identifier: '$rc_annual',
    title: 'Annual',
    description: 'Best value - save 40%',
    priceString: '$49.99/year',
    price: 49.99,
    currencyCode: 'USD',
    monthlyEquivalentPrice: 4.16,
    packageType: 'annual',
  },
  {
    identifier: '$rc_monthly',
    title: 'Monthly',
    description: 'Flexible monthly billing',
    priceString: '$6.99/month',
    price: 6.99,
    currencyCode: 'USD',
    packageType: 'monthly',
  },
];

function PaywallScreenComponent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [restoreLoading, setRestoreLoading] = useState(false);
  
  const {
    offerings,
    features,
    selectedPackageId,
    isLoadingOfferings,
    isPurchasing,
    isRestoring,
    selectPackage,
    purchase,
    restorePurchases,
  } = usePaywallViewModel();

  // In Expo Go or when no offerings are fetched, use mock data
  const isUsingMockData = isExpoGo || offerings.length === 0;
  const displayOfferings = isUsingMockData ? MOCK_OFFERINGS : offerings;
  const currentSelectedId = selectedPackageId || displayOfferings[0]?.identifier;

  // Check if we're in dev/test mode
  const environmentInfo = revenueCatService.getEnvironmentInfo();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleContinue = useCallback(async () => {
    if (isExpoGo) {
      Alert.alert(
        'Expo Go Limitation',
        'In-app purchases require a development build. The purchase flow cannot be tested in Expo Go.\n\nTo test purchases:\n1. Run "npx expo run:ios" for a dev build\n2. Or build with EAS: "eas build --profile development"',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const success = await purchase();
    if (success) {
      router.back();
    }
  }, [purchase, router]);

  const handleRestorePurchases = useCallback(async () => {
    if (isExpoGo) {
      Alert.alert(
        'Expo Go Limitation',
        'Restore purchases requires a development build with native modules.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setRestoreLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        router.back();
      }
    } finally {
      setRestoreLoading(false);
    }
  }, [restorePurchases, router]);

  const handleTermsOfService = useCallback(() => {
    Linking.openURL('https://dklochana.github.io/sprout./terms-of-service/');
  }, []);

  const handlePrivacyPolicy = useCallback(() => {
    Linking.openURL('https://dklochana.github.io/sprout./privacy-policy/');
  }, []);

  const isLoading = isPurchasing || isRestoring || restoreLoading;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.infoDim, colors.background]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
      />
      
      {/* Close Button */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + spacing.sm }]}
        onPress={handleClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={28} color={colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Expo Go / Mock Data Warning Banner */}
        {isUsingMockData && (
          <View style={styles.warningBanner}>
            <Ionicons name="information-circle" size={16} color={colors.info} />
            <Typography variant="caption" color="info" weight="500" style={styles.warningText}>
              {isExpoGo 
                ? 'EXPO GO - Prices are placeholder. Use dev build to test purchases.' 
                : 'Unable to load prices. Showing placeholder data.'}
            </Typography>
          </View>
        )}

        {/* Dev Mode Indicator */}
        {__DEV__ && !isExpoGo && environmentInfo.isTest && (
          <View style={styles.devBanner}>
            <Ionicons name="bug" size={14} color={colors.warning} />
            <Typography variant="caption" color="warning" weight="500" style={styles.devText}>
              TEST MODE - Using sandbox
            </Typography>
          </View>
        )}

        {/* Header Section */}
        <View style={styles.header}>
          {/* App Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="leaf" size={40} color={colors.primary} />
          </View>

          {/* Headline */}
          <Typography variant="h1" align="center" style={styles.headline}>
            Take the{'\n'}guesswork out of{'\n'}growth.
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body"
            color="textSecondary"
            align="center"
            style={styles.subtitle}
          >
            Unlock advanced clinical insights and unlimited memories.
          </Typography>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          {isLoadingOfferings && !isExpoGo ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Typography variant="bodySmall" color="textSecondary" style={styles.loadingText}>
                Loading prices...
              </Typography>
            </View>
          ) : (
            displayOfferings.map((offering, index) => (
              <PricingCard
                key={offering.identifier}
                offering={offering}
                isSelected={offering.identifier === currentSelectedId}
                onSelect={() => selectPackage(offering.identifier)}
                isBestValue={offering.packageType === 'annual'}
              />
            ))
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color={colors.textOnPrimary} />
              ) : (
                <Typography
                  variant="button"
                  color="textOnPrimary"
                  weight="600"
                >
                  {isExpoGo ? 'Continue (Demo)' : 'Continue'}
                </Typography>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleRestorePurchases}
            disabled={isLoading}
            style={styles.footerLink}
          >
            {restoreLoading ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Typography
                variant="caption"
                color="textSecondary"
                weight="500"
                style={styles.footerLinkText}
              >
                RESTORE PURCHASE
              </Typography>
            )}
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            onPress={handleTermsOfService}
            style={styles.footerLink}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              weight="500"
              style={styles.footerLinkText}
            >
              TERMS
            </Typography>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            onPress={handlePrivacyPolicy}
            style={styles.footerLink}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              weight="500"
              style={styles.footerLinkText}
            >
              PRIVACY
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Subscription Info */}
        <View style={styles.subscriptionInfo}>
          <Typography variant="caption" color="textMuted" align="center" style={styles.subscriptionInfoText}>
            Subscriptions auto-renew until canceled. Cancel anytime in Settings → Subscriptions.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

export const PaywallScreen = memo(PaywallScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoDim,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  warningText: {
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningDim,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  devText: {
    marginLeft: spacing.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  headline: {
    marginBottom: spacing.md,
    lineHeight: 42,
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: spacing.lg,
  },
  pricingSection: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
  },
  buttonContainer: {
    marginBottom: spacing.md,
  },
  continueButton: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  continueButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    padding: spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  footerLinkText: {
    letterSpacing: 0.5,
  },
  footerDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  subscriptionInfo: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  subscriptionInfoText: {
    lineHeight: 18,
  },
});
