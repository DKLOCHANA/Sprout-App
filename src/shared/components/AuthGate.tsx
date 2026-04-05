/**
 * AuthGate Component
 * Handles authentication state and routing based on user login status
 * Ensures proper navigation during hot reload and app startup
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@core/firebase';
import { useAuthStore } from '@features/auth/store';
import { useBabyStore } from '@features/baby-profile/store';
import { colors } from '@core/theme';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const segments = useSegments();
  
  const {
    user,
    isAuthenticated,
    isHydrated,
    hasCompletedOnboarding,
    setUser,
    clearUser,
  } = useAuthStore();
  
  const { babies } = useBabyStore();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        // User is signed out
        clearUser();
      }
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [setUser, clearUser]);

  // Handle routing based on auth state
  useEffect(() => {
    // Wait for both hydration and auth check
    if (!isHydrated || isCheckingAuth) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAppGroup = segments[0] === '(app)';
    const atRoot = !segments[0] || segments[0] === 'index';

    if (!isAuthenticated) {
      // Not authenticated - redirect to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      // Authenticated
      if (inAuthGroup || atRoot) {
        // User just logged in or at root - check if needs onboarding
        if (!hasCompletedOnboarding && babies.length === 0) {
          router.replace('/(onboarding)');
        } else {
          router.replace('/(app)');
        }
      } else if (inOnboardingGroup && hasCompletedOnboarding) {
        // Completed onboarding but still in onboarding group
        router.replace('/(app)');
      }
    }
  }, [
    isAuthenticated,
    isHydrated,
    isCheckingAuth,
    hasCompletedOnboarding,
    babies.length,
    segments,
    router,
  ]);

  // Show loading while checking auth state
  if (!isHydrated || isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
