/**
 * Onboarding Splash Screen
 * Initial splash with Get Started button
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';

const APP_ICON = require('../../../../assets/icon.png');

interface OnboardingSplashProps {
  onGetStarted: () => void;
}

// Static flag to track if animation has played this session
let hasAnimatedThisSession = false;

export function OnboardingSplash({ onGetStarted }: OnboardingSplashProps) {
  // Skip animation if already played
  const skipAnimation = hasAnimatedThisSession;
  
  // Only animate the button
  const buttonOpacity = useRef(new Animated.Value(skipAnimation ? 1 : 0)).current;
  const buttonTranslateY = useRef(new Animated.Value(skipAnimation ? 0 : 30)).current;

  useEffect(() => {
    // Skip animation if already played
    if (skipAnimation) return;

    // Mark animation as played
    hasAnimatedThisSession = true;

    // Button appears with animation
    const buttonTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    return () => clearTimeout(buttonTimer);
  }, [skipAnimation]);

  return (
    <LinearGradient
      colors={['#FFFDF9', '#E8F5F2', '#D4EBFA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative floating elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.decorativeLeaf, styles.leafTopLeft]}>
          <MaterialCommunityIcons
            name="leaf"
            size={60}
            color="#7CB899"
            style={{ opacity: 0.3 }}
          />
        </View>

        <View style={[styles.decorativeLeaf, styles.leafBottomRight]}>
          <MaterialCommunityIcons
            name="leaf"
            size={80}
            color="#6BA5E7"
            style={{ opacity: 0.2 }}
          />
        </View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={APP_ICON} style={styles.logoIcon} resizeMode="contain" />
        </View>

        {/* App Name */}
        <View style={styles.textContainer}>
          <Text style={styles.appName}>Sprout</Text>
        </View>

        {/* Slogan */}
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>
            Track milestones,{'\n'}nurture confidence
          </Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <MaterialCommunityIcons name="heart" size={16} color="#E57373" />
          <Text style={styles.tagline}>
            {'  '}Clinically accurate • Parent approved
          </Text>
        </View>
      </View>

      {/* Get Started Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={colors.textOnPrimary}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeLeaf: {
    position: 'absolute',
  },
  leafTopLeft: {
    top: 80,
    left: 30,
    transform: [{ rotate: '-20deg' }],
  },
  leafBottomRight: {
    bottom: 200,
    right: 40,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoIcon: {
    width: 140,
    height: 140,
    borderRadius: 32,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sloganContainer: {
    marginBottom: 24,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
    fontSize: 18,
  },
  loginText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
