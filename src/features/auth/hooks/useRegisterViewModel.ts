/**
 * Register View Model
 * Handles registration form state and authentication logic
 * Note: Navigation is handled by AuthGate after auth state changes
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { signUpWithEmail, userService } from '@core/firebase';
import { useAuthStore } from '../store';
import { validateRegisterForm } from '../validation';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterViewModelReturn {
  formData: RegisterFormData;
  isLoading: boolean;
  error: string | null;
  fieldError: string | undefined;
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
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);

  const updateField = useCallback((field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setFieldError(undefined);
  }, []);

  const handleSignUp = useCallback(async () => {
    // Validate with Zod
    const validation = validateRegisterForm(formData);
    if (!validation.success) {
      setError(validation.error?.message ?? 'Invalid form data');
      setFieldError(validation.error?.field);
      return;
    }

    const { name, email, password } = validation.data!;

    setIsLoading(true);
    setError(null);
    setFieldError(undefined);

    try {
      const result = await signUpWithEmail(email, password, name);

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

        // Set user in store - AuthGate will handle navigation
        // after Firebase auth state change completes
        setUser(result.user);
        // Navigation is handled by AuthGate's onAuthStateChanged listener
      } else {
        setError(result.error ?? 'Registration failed');
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

  const navigateToLogin = useCallback(() => {
    router.push('/(auth)/login');
  }, [router]);

  return {
    formData,
    isLoading,
    error,
    fieldError,
    updateField,
    handleSignUp,
    handleAppleSignIn,
    navigateToLogin,
  };
}
