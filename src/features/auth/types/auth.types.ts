/**
 * Auth Types
 * TypeScript types for authentication feature
 */

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hasCompletedOnboarding: boolean;
}

export interface AuthActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setOnboardingComplete: () => void;
  setHydrated: () => void;
}

export type AuthStore = AuthState & AuthActions;

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthFormError {
  field?: string;
  message: string;
}
