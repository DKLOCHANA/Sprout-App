/**
 * Register View Model
 * Handles registration form state and authentication logic
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { signUpWithEmail, userService } from '@core/firebase';
import { useAuthStore } from '../store';
import { RegisterFormData } from '../types';

interface UseRegisterViewModelReturn {
  formData: RegisterFormData;
  isLoading: boolean;
  error: string | null;
  updateField: (field: keyof RegisterFormData, value: string) => void;
  handleSignUp: () => Promise<void>;
  handleAppleSignIn: () => void;
  navigateToLogin: () => void;
}

export function useRegisterViewModel(): UseRegisterViewModelReturn {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const validateForm = useCallback((): string | null => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      return 'Please enter your name';
    }
    if (!email.trim()) {
      return 'Please enter your email';
    }
    if (!password) {
      return 'Please enter a password';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  }, [formData]);

  const handleSignUp = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const { name, email, password } = formData;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmail(email.trim(), password, name.trim());

      if (result.success && result.user) {
        // Create user document in Firestore
        try {
          await userService.createUser({
            id: result.user.id,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
        } catch (firestoreError) {
          // Log but don't block - user can still use app with local data
          console.warn('Failed to create Firestore user document:', firestoreError);
        }

        setUser(result.user);
        // Navigate to onboarding for new users
        router.replace('/(onboarding)');
      } else {
        setError(result.error ?? 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, setUser, router]);

  const handleAppleSignIn = useCallback(() => {
    // Apple Sign In functionality will be implemented later
    console.log('Apple Sign In pressed - to be implemented');
  }, []);

  const navigateToLogin = useCallback(() => {
    router.push('/(auth)/login');
  }, [router]);

  return {
    formData,
    isLoading,
    error,
    updateField,
    handleSignUp,
    handleAppleSignIn,
    navigateToLogin,
  };
}
