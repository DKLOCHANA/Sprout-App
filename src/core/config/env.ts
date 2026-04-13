/**
 * Environment Configuration
 * Type-safe access to environment variables via expo-constants
 */

import Constants from 'expo-constants';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface EnvConfig {
  firebase: FirebaseConfig;
  revenueCat: {
    iosKey: string;
    iosTestKey: string;
  };
  isProduction: boolean;
}

// Get extra config from app.config.js
const extra = Constants.expoConfig?.extra || {};

// Load Firebase config from expo-constants (populated from app.config.js)
const firebaseConfig: FirebaseConfig = {
  apiKey: extra.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: extra.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: extra.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: extra.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: extra.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: extra.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// RevenueCat config
const revenueCatConfig = {
  iosKey: extra.revenueCatIosKey || process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  iosTestKey: extra.revenueCatIosTestKey || process.env.EXPO_PUBLIC_REVENUECAT_IOS_TEST_KEY || '',
};

// Check if Firebase is properly configured - validate ALL required fields
export function isFirebaseConfigured(): boolean {
  const hasAllFields = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
  
  if (!hasAllFields) {
    console.error('Firebase configuration incomplete:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasStorageBucket: !!firebaseConfig.storageBucket,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasAppId: !!firebaseConfig.appId,
    });
  }
  
  return hasAllFields;
}

export const env: EnvConfig = {
  firebase: firebaseConfig,
  revenueCat: revenueCatConfig,
  isProduction: !__DEV__,
} as const;
