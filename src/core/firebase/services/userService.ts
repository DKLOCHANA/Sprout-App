/**
 * User Service
 * Firestore operations for user documents
 */

import {
  getFirestoreDb,
  COLLECTIONS,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  type FirestoreUser,
} from '../firestore';
import type { User } from '@features/auth/types';

export interface CreateUserData {
  id: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
}

const defaultSettings: UserSettings = {
  theme: 'system',
};

export const userService = {
  /**
   * Create a new user document in Firestore
   * Called after successful Firebase Auth signup
   */
  async createUser(userData: CreateUserData): Promise<void> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userData.id);

    const userDoc: FirestoreUser = {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL ?? null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      settings: defaultSettings,
    };

    await setDoc(userRef, userDoc);
  },

  /**
   * Get user document from Firestore
   */
  async getUser(userId: string): Promise<User | null> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as FirestoreUser;
    return {
      id: snapshot.id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
    };
  },

  /**
   * Update user document in Firestore
   */
  async updateUser(
    userId: string,
    updates: Partial<Pick<User, 'displayName' | 'photoURL'>>
  ): Promise<void> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Update user settings
   */
  async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    await updateDoc(userRef, {
      settings,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Get user settings
   */
  async getSettings(userId: string): Promise<UserSettings | null> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as FirestoreUser;
    return data.settings ?? defaultSettings;
  },

  /**
   * Check if user document exists
   */
  async exists(userId: string): Promise<boolean> {
    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists();
  },
};
