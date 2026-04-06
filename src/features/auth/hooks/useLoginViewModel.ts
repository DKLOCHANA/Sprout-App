/**
 * Login View Model
 * Handles login form state and authentication logic
 * Note: Navigation is handled by AuthGate after auth state changes
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmail, signInWithApple, resetPassword } from '@core/firebase';
import { userService } from '@core/firebase';
import { useAuthStore } from '../store';
import { LoginFormData } from '../types';

interface UseLoginViewModelReturn {
  formData: LoginFormData;
  isLoading: boolean;
  isAppleLoading: boolean;
  error: string | null;
  updateField: (field: keyof LoginFormData, value: string) => void;
  handleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleForgotPassword: () => void;
  navigateToRegister: () => void;
}

export function useLoginViewModel(): UseLoginViewModelReturn {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
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
        // Set user in store - AuthGate will handle navigation
        // after Firebase auth state change and data loading completes
        setUser(result.user);
        // Navigation is handled by AuthGate's onAuthStateChanged listener
      } else {
        setError(result.error ?? 'Sign in failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [formData, setUser]);

  const handleAppleSignIn = useCallback(async () => {
    setIsAppleLoading(true);
    setError(null);

    try {
      const result = await signInWithApple();

      if (result.success && result.user) {
        // Ensure user document exists in Firestore (for first-time Apple sign-in)
        try {
          await userService.createUser({
            id: result.user.id,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
        } catch {
          // User doc may already exist - that's fine
        }

        setUser(result.user);
      } else if (result.error !== 'Sign in was cancelled') {
        setError(result.error ?? 'Apple Sign In failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsAppleLoading(false);
    }
  }, [setUser]);

  const handleForgotPassword = useCallback(() => {
    const email = formData.email.trim();

    Alert.prompt(
      'Reset Password',
      'Enter your email address to receive a password reset link.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Reset Link',
          onPress: async (inputEmail?: string) => {
            const emailToReset = inputEmail?.trim();

            if (!emailToReset) {
              Alert.alert('Error', 'Please enter a valid email address.');
              return;
            }

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailToReset)) {
              Alert.alert('Error', 'Please enter a valid email address.');
              return;
            }

            const result = await resetPassword(emailToReset);

            if (result.success) {
              Alert.alert(
                'Email Sent',
                'If an account exists with this email, you will receive a password reset link shortly.',
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Error', result.error ?? 'Failed to send reset email. Please try again.');
            }
          },
        },
      ],
      'plain-text',
      email, // Pre-fill with current email if available
      'email-address'
    );
  }, [formData.email]);

  const navigateToRegister = useCallback(() => {
    router.push('/(auth)/register');
  }, [router]);

  return {
    formData,
    isLoading,
    isAppleLoading,
    error,
    updateField,
    handleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    navigateToRegister,
  };
}
