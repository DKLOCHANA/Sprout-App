/**
 * Firebase Configuration
 * Initialize Firebase app and services
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
} from 'firebase/auth';
// @ts-expect-error - Firebase RN persistence import path varies by build
import { getReactNativePersistence } from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '@core/config';

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

export function initializeFirebase(): FirebaseApp {
  if (!firebaseApp && getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Auth with AsyncStorage persistence
    try {
      const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
      firebaseAuth = initializeAuth(firebaseApp, {
        persistence,
      });
    } catch {
      // Fallback if persistence initialization fails
      firebaseAuth = getAuth(firebaseApp);
    }
  }
  return firebaseApp ?? getApps()[0];
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    initializeFirebase();
  }
  return firebaseAuth!;
}
