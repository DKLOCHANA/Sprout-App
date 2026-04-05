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
import * as firebaseAuthModule from 'firebase/auth';
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
    // Note: getReactNativePersistence might not be available in all Firebase versions
    // Using default persistence for now
    try {
      const persistence = (firebaseAuthModule as any).getReactNativePersistence;
      if (persistence) {
        firebaseAuth = initializeAuth(firebaseApp, {
          persistence: persistence(ReactNativeAsyncStorage),
        });
      } else {
        firebaseAuth = getAuth(firebaseApp);
      }
    } catch {
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
