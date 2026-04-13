/**
 * AuthGate Component
 * Handles authentication state and routing based on user login status
 * Single source of truth for navigation decisions after auth state changes
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseInitialized } from '@core/firebase';
import { syncService } from '@core/storage/syncService';
import { useAuthStore } from '@features/auth/store';
import { useBabyStore } from '@features/baby-profile/store';
import { useOnboardingStore } from '@features/onboarding/store';
import { revenueCatService } from '@features/subscription';
import { colors } from '@core/theme';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  
  const {
    user,
    isAuthenticated,
    isHydrated: authHydrated,
    hasCompletedOnboarding,
    setUser,
    clearUser,
    setOnboardingComplete,
  } = useAuthStore();
  
  const { babies, isHydrated: babyHydrated } = useBabyStore();
  const { hasCompletedSurvey } = useOnboardingStore();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const appState = useRef(AppState.currentState);

  // Sync RevenueCat subscription when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isAuthenticated &&
        user?.id
      ) {
        // App has come to the foreground - sync subscription status
        try {
          await revenueCatService.syncSubscriptionStatus();
        } catch (error) {
          console.warn('Failed to sync subscription on foreground:', error);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, user?.id]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, skipping auth listener');
      setIsCheckingAuth(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    
    try {
      const auth = getFirebaseAuth();
      
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          // User is signed in
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(userData);
          
          // Load data from Firestore for returning users
          setIsLoadingUserData(true);
          try {
            await syncService.loadFromFirestore(firebaseUser.uid);
          } catch (syncError) {
            console.warn('Failed to load data from Firestore:', syncError);
            // Continue anyway - user can still use the app with local data
          }
          
          // Sync RevenueCat user ID and subscription status
          // This ensures returning users have their purchases linked
          try {
            await revenueCatService.setUserId(firebaseUser.uid);
            // setUserId already calls syncSubscriptionStatus internally
          } catch (rcError) {
            console.warn('Failed to sync RevenueCat user:', rcError);
            // Non-critical - subscription features may not work but app continues
          }
          
          setIsLoadingUserData(false);
        } else {
          // User is signed out - clear RevenueCat user
          try {
            await revenueCatService.clearUserId();
          } catch (rcError) {
            console.warn('Failed to clear RevenueCat user:', rcError);
          }
          clearUser();
        }
        setIsCheckingAuth(false);
      });
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsCheckingAuth(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser, clearUser]);

  // Reset onboarding survey if user is not authenticated (for fresh starts / hot reload)
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && hasCompletedSurvey) {
      // User is not logged in but survey was marked complete from previous session
      // Reset it so they see onboarding on fresh app load
      useOnboardingStore.getState().resetOnboarding();
    }
  }, [isCheckingAuth, isAuthenticated, hasCompletedSurvey]);

  // Handle routing based on auth state - single source of truth
  useEffect(() => {
    // Wait for navigation to be ready
    if (!navigationState?.key) {
      return;
    }
    
    // Wait for all hydration and data loading to complete
    if (!authHydrated || !babyHydrated || isCheckingAuth || isLoadingUserData) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const atRoot = !segments[0] || segments[0] === 'index';

    // Use try-catch for navigation to prevent crashes
    try {
      if (!isAuthenticated) {
        // Not authenticated - always show onboarding for new users
        if (!inAuthGroup && !inOnboardingGroup) {
          router.replace('/(onboarding)');
        }
      } else {
        // Authenticated - determine correct destination
        const currentBabies = useBabyStore.getState().babies;
        const hasBabies = currentBabies.length > 0;
        
        if (inAuthGroup || atRoot) {
          // User just logged in or at root - navigate based on baby data
          if (hasBabies) {
            if (!hasCompletedOnboarding) {
              setOnboardingComplete();
            }
            router.replace('/(app)');
          } else {
            // No babies - go directly to baby setup
            router.replace('/(onboarding)/add-baby');
          }
        } else if (inOnboardingGroup) {
          // In onboarding - check if should redirect to app
          if (hasBabies && hasCompletedOnboarding) {
            router.replace('/(app)');
          }
        }
      }
    } catch (navError) {
      console.error('Navigation error in AuthGate:', navError);
    }
  }, [
    isAuthenticated,
    authHydrated,
    babyHydrated,
    isCheckingAuth,
    isLoadingUserData,
    hasCompletedOnboarding,
    babies.length,
    segments,
    router,
    setOnboardingComplete,
    navigationState?.key,
  ]);

  // Show loading while checking auth state or loading user data
  if (!authHydrated || !babyHydrated || isCheckingAuth || isLoadingUserData) {
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
