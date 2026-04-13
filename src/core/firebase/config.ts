/**
 * Firebase Configuration
 * Initialize Firebase app and services
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
  inMemoryPersistence,
  Persistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { env, isFirebaseConfigured } from '@core/config';

// Try to get getReactNativePersistence from @firebase/auth
// Metro will resolve to react-native exports via package.json conditional exports
let getReactNativePersistence: ((storage: typeof ReactNativeAsyncStorage) => Persistence) | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const firebaseAuthModule = require('@firebase/auth');
  if (firebaseAuthModule && typeof firebaseAuthModule.getReactNativePersistence === 'function') {
    getReactNativePersistence = firebaseAuthModule.getReactNativePersistence;
  }
} catch (e) {
  console.warn('Could not load @firebase/auth module:', e);
}

let firebaseApp: FirebaseApp | undefined;
let firebaseAuthInstance: Auth | undefined;
let initializationError: Error | null = null;

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

export function initializeFirebase(): FirebaseApp {
  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    const errorMsg = 'Firebase configuration is incomplete. Missing environment variables.';
    console.error(errorMsg, firebaseConfig);
    initializationError = new Error(errorMsg);
    throw initializationError;
  }

  if (getApps().length === 0) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
      
      // Initialize Auth with appropriate persistence
      try {
        let persistence: Persistence;
        
        // Check if getReactNativePersistence is available and working
        if (getReactNativePersistence && typeof getReactNativePersistence === 'function') {
          try {
            persistence = getReactNativePersistence(ReactNativeAsyncStorage);
            console.log('Using React Native AsyncStorage persistence');
          } catch (persistenceError) {
            console.warn('getReactNativePersistence failed, falling back to inMemory:', persistenceError);
            persistence = inMemoryPersistence;
          }
        } else {
          console.warn('getReactNativePersistence not available, using inMemory persistence');
          persistence = inMemoryPersistence;
        }
        
        firebaseAuthInstance = initializeAuth(firebaseApp, {
          persistence: persistence,
        });
      } catch (authError: any) {
        // If initializeAuth fails (e.g., already initialized), try getAuth
        if (authError?.code === 'auth/already-initialized') {
          console.log('Auth already initialized, using getAuth');
          firebaseAuthInstance = getAuth(firebaseApp);
        } else {
          console.warn('Firebase auth initialization warning:', authError);
          // Fallback to getAuth which uses default persistence
          firebaseAuthInstance = getAuth(firebaseApp);
        }
      }
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      initializationError = error as Error;
      throw error;
    }
  } else {
    firebaseApp = getApp();
    if (!firebaseAuthInstance) {
      try {
        firebaseAuthInstance = getAuth(firebaseApp);
      } catch (error) {
        console.error('Failed to get Firebase Auth:', error);
        initializationError = error as Error;
        throw error;
      }
    }
  }
  return firebaseApp;
}

/**
 * Reset Firebase state for retry
 */
export function resetFirebaseState(): void {
  initializationError = null;
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuthInstance) {
    initializeFirebase();
  }
  if (!firebaseAuthInstance) {
    throw new Error('Firebase Auth not initialized');
  }
  return firebaseAuthInstance;
}

export function getInitializationError(): Error | null {
  return initializationError;
}

export function isFirebaseInitialized(): boolean {
  return firebaseApp !== undefined && firebaseAuthInstance !== undefined;
}
