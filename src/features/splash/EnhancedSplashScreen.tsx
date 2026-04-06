/**
 * Sprout App - Enhanced Animated Splash Screen with Particles
 * Premium version with floating particle effects and wave animations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@core/theme/colors';
import { typography } from '@core/theme/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EnhancedSplashScreenProps {
  onFinish: () => void;
}

// Floating particle component
const FloatingParticle: React.FC<{ delay: number; duration: number; startX: number; startY: number }> = ({
  delay,
  duration,
  startX,
  startY,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0.6, { duration: 300 }),
        withTiming(0, { duration: duration - 300 })
      )
    );
    translateY.value = withDelay(
      delay,
      withTiming(-150, { duration, easing: Easing.out(Easing.quad) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.particle, { left: startX, top: startY }, animatedStyle]}>
      <MaterialCommunityIcons name="circle" size={8} color={colors.primaryLight} />
    </Animated.View>
  );
};

export const EnhancedSplashScreen: React.FC<EnhancedSplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoPulse = useSharedValue(1);
  const appNameOpacity = useSharedValue(0);
  const appNameTranslateY = useSharedValue(20);
  const sloganOpacity = useSharedValue(0);
  const sloganTranslateY = useSharedValue(20);
  const leaf1Rotate = useSharedValue(0);
  const leaf2Rotate = useSharedValue(0);
  const circleScale1 = useSharedValue(0);
  const circleScale2 = useSharedValue(0);

  useEffect(() => {
    // Logo entrance with rotation
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 250 });
    logoRotate.value = withTiming(360, { duration: 800, easing: Easing.out(Easing.cubic) });

    // Subtle pulse effect on logo
    logoPulse.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        2
      )
    );

    // Leaf rotations
    leaf1Rotate.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    leaf2Rotate.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Background circles
    circleScale1.value = withDelay(
      200,
      withSpring(1, { damping: 20, stiffness: 100 })
    );
    circleScale2.value = withDelay(
      400,
      withSpring(1, { damping: 20, stiffness: 100 })
    );

    // App name
    appNameOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    appNameTranslateY.value = withDelay(
      700,
      withSpring(0, { damping: 16, stiffness: 300 })
    );

    // Slogan
    sloganOpacity.value = withDelay(
      1000,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    sloganTranslateY.value = withDelay(
      1000,
      withSpring(0, { damping: 16, stiffness: 300 })
    );

    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value * logoPulse.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const leaf1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${leaf1Rotate.value}deg` }],
  }));

  const leaf2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${leaf2Rotate.value}deg` }],
  }));

  const appNameAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appNameOpacity.value,
    transform: [{ translateY: appNameTranslateY.value }],
  }));

  const sloganAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sloganOpacity.value,
    transform: [{ translateY: sloganTranslateY.value }],
  }));

  const circle1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale1.value }],
  }));

  const circle2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale2.value }],
  }));

  return (
    <LinearGradient
      colors={[
        '#FFFDF9',
        '#E8F5F2',
        '#D4EBFA',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Background decorative circles */}
      <Animated.View style={[styles.bgCircle1, circle1AnimatedStyle]} />
      <Animated.View style={[styles.bgCircle2, circle2AnimatedStyle]} />

      {/* Floating particles */}
      <FloatingParticle delay={800} duration={2000} startX={60} startY={400} />
      <FloatingParticle delay={1000} duration={2200} startX={120} startY={450} />
      <FloatingParticle delay={1200} duration={1800} startX={280} startY={420} />
      <FloatingParticle delay={900} duration={2100} startX={200} startY={500} />

      {/* Decorative leaves */}
      <Animated.View style={[styles.leaf, styles.leafTopLeft, leaf1AnimatedStyle]}>
        <MaterialCommunityIcons name="leaf" size={70} color={colors.success} opacity={0.25} />
      </Animated.View>
      
      <Animated.View style={[styles.leaf, styles.leafBottomRight, leaf2AnimatedStyle]}>
        <MaterialCommunityIcons name="leaf" size={90} color={colors.primaryLight} opacity={0.2} />
      </Animated.View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoCircle}>
            <LinearGradient
              colors={['#5B9FE3', '#3A7FC9', '#2B6FB9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <View style={styles.logoIconContainer}>
                <MaterialCommunityIcons 
                  name="sprout" 
                  size={90} 
                  color="#FFFFFF"
                />
                {/* Glow effect */}
                <View style={styles.glowCircle} />
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* App Name with gradient text effect */}
        <Animated.View style={[styles.textContainer, appNameAnimatedStyle]}>
          <Text style={styles.appName}>Sprout</Text>
          <View style={styles.underline} />
        </Animated.View>

        {/* Slogan */}
        <Animated.View style={[styles.sloganContainer, sloganAnimatedStyle]}>
          <Text style={styles.slogan}>
            Track milestones,{'\n'}nurture confidence
          </Text>
        </Animated.View>

        {/* Tagline with icons */}
        <Animated.View style={[styles.taglineContainer, sloganAnimatedStyle]}>
          <View style={styles.iconRow}>
            <MaterialCommunityIcons name="shield-check" size={14} color={colors.success} />
            <Text style={styles.taglineText}>Clinically accurate</Text>
          </View>
          <View style={styles.dividerDot} />
          <View style={styles.iconRow}>
            <MaterialCommunityIcons name="heart" size={14} color={colors.error} />
            <Text style={styles.taglineText}>Parent approved</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryLight,
    opacity: 0.1,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: colors.success,
    opacity: 0.08,
  },
  particle: {
    position: 'absolute',
  },
  leaf: {
    position: 'absolute',
  },
  leafTopLeft: {
    top: 100,
    left: 30,
  },
  leafBottomRight: {
    bottom: 140,
    right: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.15,
  },
  textContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  appName: {
    ...typography.h1,
    fontSize: 64,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  underline: {
    marginTop: 8,
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondaryGradientStart,
  },
  sloganContainer: {
    marginBottom: 28,
  },
  slogan: {
    ...typography.body,
    fontSize: 19,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taglineText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.4,
  },
});
