/**
 * Onboarding Welcome Slides - Placeholder
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const colors = {
  primary: '#7CB899',
  background: '#FFFDF9',
  textPrimary: '#2D3436',
};

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Sprout!</Text>
        <Text
          style={styles.link}
          onPress={() => router.push('/(onboarding)/add-baby')}
        >
          Continue →
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  link: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
});
