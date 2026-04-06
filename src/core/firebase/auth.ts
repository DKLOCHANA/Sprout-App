/**
 * Firebase Auth Helpers
 * Authentication utility functions
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  signInWithCredential,
  OAuthProvider,
  User,
  AuthError,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getFirebaseAuth } from './config';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

function mapFirebaseUser(user: User): AuthUser {
  return {
    id: user.uid,
    email: user.email ?? '',
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function getErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An error occurred. Please try again';
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: mapFirebaseUser(result.user),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(result.user, { displayName });
    }

    return {
      success: true,
      user: mapFirebaseUser(result.user),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
}

export function getCurrentUser(): AuthUser | null {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  return user ? mapFirebaseUser(user) : null;
}

export async function signInWithApple(): Promise<AuthResult> {
  try {
    // Check if Apple Sign In is available on this device
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple Sign In is not available on this device',
      };
    }

    // Request Apple credential
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Ensure we have an identity token
    if (!appleCredential.identityToken) {
      return {
        success: false,
        error: 'No identity token received from Apple',
      };
    }

    // Create Firebase OAuth credential
    const provider = new OAuthProvider('apple.com');
    const oAuthCredential = provider.credential({
      idToken: appleCredential.identityToken,
    });

    // Sign in to Firebase
    const auth = getFirebaseAuth();
    const result = await signInWithCredential(auth, oAuthCredential);

    // Apple only provides name on first sign in, so we update profile if available
    if (appleCredential.fullName?.givenName && !result.user.displayName) {
      const displayName = [
        appleCredential.fullName.givenName,
        appleCredential.fullName.familyName,
      ]
        .filter(Boolean)
        .join(' ');

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
    }

    return {
      success: true,
      user: mapFirebaseUser(result.user),
    };
  } catch (error: unknown) {
    // Handle user cancellation
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ERR_REQUEST_CANCELED'
    ) {
      return {
        success: false,
        error: 'Sign in was cancelled',
      };
    }

    // Handle Firebase auth errors
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: getErrorMessage(authError),
      };
    }

    return {
      success: false,
      error: 'Failed to sign in with Apple',
    };
  }
}

export async function deleteAccount(): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'No user is currently signed in',
      };
    }
    
    await deleteUser(user);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    if (authError.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'Please sign out and sign in again before deleting your account',
      };
    }
    return {
      success: false,
      error: getErrorMessage(authError),
    };
  }
}
