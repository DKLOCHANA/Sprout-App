/**
 * Login View Model
 * Handles login form state and authentication logic
 * Note: Navigation is handled by AuthGate after auth state changes
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmail, resetPassword } from '@core/firebase';
import { useAuthStore } from '../store';
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

  const handleAppleSignIn = useCallback(() => {
    // Apple Sign In functionality will be implemented later
    console.log('Apple Sign In pressed - to be implemented');
  }, []);

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
    error,
    updateField,
    handleSignIn,
    handleAppleSignIn,
    handleForgotPassword,
    navigateToRegister,
  };
}
