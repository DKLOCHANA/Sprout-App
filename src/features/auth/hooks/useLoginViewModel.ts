/**
 * Login View Model
 * Handles login form state and authentication logic
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { signInWithEmail } from '@core/firebase';
import { syncService } from '@core/storage/syncService';
import { useAuthStore } from '../store';
import { useBabyStore } from '@features/baby-profile/store';
import { LoginFormData } from '../types';

interface UseLoginViewModelReturn {
  formData: LoginFormData;
  isLoading: boolean;
  error: string | null;
  updateField: (field: keyof LoginFormData, value: string) => void;
  handleSignIn: () => Promise<void>;
  handleAppleSignIn: () => void;
  handleForgotPassword: () => void;
  navigateToRegister: () => void;
}

export function useLoginViewModel(): UseLoginViewModelReturn {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete);
  const babies = useBabyStore((state) => state.babies);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const handleSignIn = useCallback(async () => {
    const { email, password } = formData;

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(email.trim(), password);

      if (result.success && result.user) {
        setUser(result.user);

        // Try to load data from Firestore for returning users
        try {
          await syncService.loadFromFirestore(result.user.id);
        } catch (syncError) {
          console.warn('Failed to load data from Firestore:', syncError);
        }

        // Check if user has babies (completed onboarding)
        const currentBabies = useBabyStore.getState().babies;
        
        if (currentBabies.length > 0) {
          setOnboardingComplete();
          router.replace('/(app)');
        } else {
          router.replace('/(onboarding)');
        }
      } else {
        setError(result.error ?? 'Sign in failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [formData, setUser, setOnboardingComplete, router]);

  const handleAppleSignIn = useCallback(() => {
    // Apple Sign In functionality will be implemented later
    console.log('Apple Sign In pressed - to be implemented');
  }, []);

  const handleForgotPassword = useCallback(() => {
    // Navigate to forgot password screen (to be implemented)
    console.log('Forgot password pressed - to be implemented');
  }, []);

  const navigateToRegister = useCallback(() => {
    router.push('/(auth)/register');
  }, [router]);

  return {
    formData,
    isLoading,
    error,
    updateField,
    handleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    navigateToRegister,
  };
}
