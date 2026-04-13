/**
 * Root Layout
 * Entry point for Expo Router
 * Initializes Firebase and RevenueCat, provides global providers
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeFirebase, isFirebaseInitialized, resetFirebaseState } from '@core/firebase';
import { AuthGate } from '@shared/components';
import { colors } from '@core/theme';
import { SplashScreen } from '../src/features/splash/SplashScreen';
import { revenueCatService } from '@/features/subscription';

// Error Boundary for catching render errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Something went wrong</Text>
          <Text style={errorStyles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={errorStyles.button}
            onPress={this.handleRetry}
          >
            <Text style={errorStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#5B9FE3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const initAttempted = useRef(false);

  const runInitialization = useCallback(async () => {
    console.log('Running initialization...');
    try {
      // Reset error state
      resetFirebaseState();
      setInitError(null);
      
      // Initialize Firebase
      initializeFirebase();
      console.log('Firebase initialized successfully');
      
      // Only initialize RevenueCat if Firebase succeeded
      if (isFirebaseInitialized()) {
        // Initialize RevenueCat (non-blocking)
        revenueCatService.initialize().catch((error) => {
          console.warn('RevenueCat initialization failed (non-critical):', error);
        });
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Critical initialization error:', error);
      setInitError(error as Error);
      setIsInitialized(false);
    }
  }, []);

  useEffect(() => {
    // Only run once on mount
    if (!initAttempted.current) {
      initAttempted.current = true;
      runInitialization();
    }
  }, [runInitialization]);

  const handleSplashFinish = useCallback(() => {
    // Only dismiss splash if initialized successfully
    if (isInitialized && !initError) {
      setShowSplash(false);
    }
  }, [isInitialized, initError]);

  const handleRetry = useCallback(() => {
    console.log('Retry requested');
    setShowSplash(true);
    setIsInitialized(false);
    setInitError(null);
    // Run initialization again
    runInitialization();
  }, [runInitialization]);

  // Show error screen if initialization failed
  if (initError) {
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.title}>Unable to Start App</Text>
        <Text style={errorStyles.message}>
          {initError.message || 'An unexpected error occurred. Please try again.'}
        </Text>
        <TouchableOpacity
          style={errorStyles.button}
          onPress={handleRetry}
        >
          <Text style={errorStyles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
