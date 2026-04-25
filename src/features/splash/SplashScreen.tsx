/**
 * Sprout App - Animated Splash Screen
 * Features: Gradient background, icon.png logo, smooth fade + scale entrance
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ICON = require('../../../assets/icon.png');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(16)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateY = useRef(new Animated.Value(12)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const easeOut = Easing.out(Easing.cubic);

    // Step 1 — logo fades + scales in gently
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 2 — app name rises in
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 550,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 550,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 3 — slogan rises in
    Animated.parallel([
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 500,
        delay: 800,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(sloganTranslateY, {
        toValue: 0,
        duration: 500,
        delay: 800,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 4 — tagline fades in last
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1100,
      easing: easeOut,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={['#FFFDF9', '#EEF6FF', '#E2F0FB']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      {/* Main content */}
      <View style={styles.content}>
        {/* Soft glow ring behind logo */}
        <Animated.View style={[styles.glowRing, { opacity: glowOpacity }]} />

        {/* App icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image source={ICON} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* App name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.appName}>Sprout</Text>
        </Animated.View>

        {/* Slogan */}
        <Animated.View
          style={[
            styles.sloganContainer,
            {
              opacity: sloganOpacity,
              transform: [{ translateY: sloganTranslateY }],
            },
          ]}
        >
          <Text style={styles.slogan}>
            Track milestones,{'\n'}nurture confidence
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
          <View style={styles.dot} />
          <Text style={styles.tagline}>Clinically accurate • Parent approved</Text>
          <View style={styles.dot} />
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  /* Glow ring */
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    top: -30,
    alignSelf: 'center',
  },

  /* Logo */
  logoContainer: {
    marginBottom: 28,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 32,
  },

  /* App name */
  textContainer: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 52,
    fontWeight: '700',
    color: '#2D3436',
    letterSpacing: -1,
  },

  /* Slogan */
  sloganContainer: {
    marginBottom: 28,
  },
  slogan: {
    fontSize: 17,
    fontWeight: '400',
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 26,
  },

  /* Tagline */
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#B2BEC3',
  },
  tagline: {
    fontSize: 12,
    color: '#B2BEC3',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
