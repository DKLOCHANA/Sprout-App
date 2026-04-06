/**
 * Root Layout
 * Entry point for Expo Router
 * Initializes Firebase and global providers
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeFirebase } from '@core/firebase';
import { AuthGate } from '@shared/components';
import { colors } from '@core/theme';
import { SplashScreen } from '../src/features/splash/SplashScreen';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase on app start
    const initialize = async () => {
      try {
        await initializeFirebase();
      } catch (error) {
        console.warn('Firebase initialization error:', error);
      }
      setIsInitialized(true);
    };
    
    initialize();
  }, []);

  const handleSplashFinish = () => {
    if (isInitialized) {
      setShowSplash(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        {showSplash || !isInitialized ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <AuthGate>
            <View style={styles.container}>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(app)" />
              </Stack>
            </View>
          </AuthGate>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
