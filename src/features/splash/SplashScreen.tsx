/**
 * Sprout App - Animated Splash Screen
 * Features: Gradient background, animated logo, slogan with fade-in
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation values using React Native's Animated API
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateY = useRef(new Animated.Value(20)).current;
  const leafScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run all animations
    Animated.sequence([
      // 1. Logo appears
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Leaves appear
    Animated.timing(leafScale, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // 3. App name appears
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.spring(textTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Slogan appears
    Animated.parallel([
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 500,
        delay: 900,
        useNativeDriver: true,
      }),
      Animated.spring(sloganTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Finish after animations
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Interpolate rotation
  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#FFFDF9', '#E8F5F2', '#D4EBFA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative floating elements */}
      <View style={styles.decorativeContainer}>
        {/* Top-left leaf */}
        <Animated.View 
          style={[
            styles.decorativeLeaf, 
            styles.leafTopLeft, 
            { transform: [{ scale: leafScale }] }
          ]}
        >
          <MaterialCommunityIcons name="leaf" size={60} color="#7CB899" style={{ opacity: 0.3 }} />
        </Animated.View>
        
        {/* Bottom-right leaf */}
        <Animated.View 
          style={[
            styles.decorativeLeaf, 
            styles.leafBottomRight, 
            { transform: [{ scale: leafScale }] }
          ]}
        >
          <MaterialCommunityIcons name="leaf" size={80} color="#6BA5E7" style={{ opacity: 0.2 }} />
        </Animated.View>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo - Baby sprout icon */}
        <Animated.View 
          style={[
            styles.logoContainer, 
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { rotate: spin },
              ],
            }
          ]}
        >
          <View style={styles.logoCircle}>
            <LinearGradient
              colors={['#5B9FE3', '#3A7FC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <MaterialCommunityIcons 
                name="leaf" 
                size={80} 
                color="#FFFFFF"
              />
            </LinearGradient>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View 
          style={[
            styles.textContainer, 
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            }
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
            }
          ]}
        >
          <Text style={styles.slogan}>
            Track milestones,{'\n'}nurture confidence
          </Text>
        </Animated.View>

        {/* Subtle tagline */}
        <Animated.View 
          style={[
            styles.taglineContainer, 
            { opacity: sloganOpacity }
          ]}
        >
          <MaterialCommunityIcons name="heart" size={16} color="#E57373" />
          <Text style={styles.tagline}>  Clinically accurate • Parent approved</Text>
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
    bottom: 120,
    right: 40,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 56,
    fontWeight: '700',
    color: '#2D3436',
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
    color: '#636E72',
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
    color: '#B2BEC3',
    textAlign: 'center',
  },
});
