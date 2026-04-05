/**
 * Firestore Configuration
 * Initialize Firestore and provide helper functions
 */

import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  serverTimestamp,
  writeBatch,
  FieldValue,
} from 'firebase/firestore';
import { getFirebaseApp } from './config';

let firestoreInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (!firestoreInstance) {
    const app = getFirebaseApp();
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}

// Collection paths
export const COLLECTIONS = {
  USERS: 'users',
  BABIES: 'babies',
  GROWTH_ENTRIES: 'growthEntries',
  MILESTONES: 'milestones',
} as const;

// Helper to get subcollection paths
export function getUserBabiesPath(userId: string): string {
  return `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.BABIES}`;
}

export function getBabyGrowthEntriesPath(userId: string, babyId: string): string {
  return `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.BABIES}/${babyId}/${COLLECTIONS.GROWTH_ENTRIES}`;
}

export function getBabyMilestonesPath(userId: string, babyId: string): string {
  return `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.BABIES}/${babyId}/${COLLECTIONS.MILESTONES}`;
}

// Timestamp converters
export function toFirestoreTimestamp(isoString: string): Timestamp {
  return Timestamp.fromDate(new Date(isoString));
}

export function fromFirestoreTimestamp(timestamp: Timestamp | undefined): string | undefined {
  if (!timestamp) return undefined;
  return timestamp.toDate().toISOString();
}

// Generic document converter
export interface FirestoreConverter<T> {
  toFirestore: (data: T) => DocumentData;
  fromFirestore: (snapshot: QueryDocumentSnapshot | DocumentSnapshot) => T | null;
}

// User document type for Firestore
export interface FirestoreUser {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings?: {
    theme: 'light' | 'dark' | 'system';
  };
}

// Baby document type for Firestore
export interface FirestoreBaby {
  name: string;
  dateOfBirth: string;
  biologicalSex: 'male' | 'female';
  isPremature: boolean;
  originalDueDate?: string;
  photoUri: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Growth entry document type for Firestore
export interface FirestoreGrowthEntry {
  date: string;
  weightKg: number | null;
  heightCm: number | null;
  headCircumferenceCm: number | null;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Milestone achievement document type for Firestore
export interface FirestoreMilestoneAchievement {
  milestoneId: string;
  status: 'achieved' | 'in_progress' | 'not_yet';
  achievedAt?: Timestamp;
  notes?: string;
  photoUri?: string;
  updatedAt: Timestamp;
}

// Export Firestore utilities
export {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch,
  FieldValue,
};

export type {
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
};
