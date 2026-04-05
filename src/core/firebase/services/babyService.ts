/**
 * Baby Service
 * Firestore operations for baby profiles and growth entries
 */

import {
  getFirestoreDb,
  getUserBabiesPath,
  getBabyGrowthEntriesPath,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch,
  FieldValue,
  type FirestoreBaby,
  type FirestoreGrowthEntry,
} from '../firestore';
import type { Baby, GrowthEntry } from '@features/baby-profile/types';

// Converters
function babyToFirestore(baby: Baby): FirestoreBaby {
  const doc: FirestoreBaby = {
    name: baby.name,
    dateOfBirth: baby.dateOfBirth,
    biologicalSex: baby.biologicalSex,
    isPremature: baby.isPremature,
    photoUri: baby.photoUri,
    createdAt: Timestamp.fromDate(new Date(baby.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(baby.updatedAt)),
  };
  
  // Only include originalDueDate if it exists (Firestore doesn't accept undefined)
  if (baby.originalDueDate) {
    doc.originalDueDate = baby.originalDueDate;
  }
  
  return doc;
}

function babyFromFirestore(id: string, userId: string, data: FirestoreBaby): Baby {
  return {
    id,
    userId,
    name: data.name,
    dateOfBirth: data.dateOfBirth,
    biologicalSex: data.biologicalSex,
    isPremature: data.isPremature,
    originalDueDate: data.originalDueDate,
    photoUri: data.photoUri,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

function growthEntryToFirestore(entry: GrowthEntry): FirestoreGrowthEntry {
  const doc: FirestoreGrowthEntry = {
    date: entry.date,
    weightKg: entry.weightKg,
    heightCm: entry.heightCm,
    headCircumferenceCm: entry.headCircumferenceCm,
    createdAt: Timestamp.fromDate(new Date(entry.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(entry.updatedAt)),
  };
  
  // Only include notes if it exists
  if (entry.notes) {
    doc.notes = entry.notes;
  }
  
  return doc;
}

function growthEntryFromFirestore(id: string, babyId: string, data: FirestoreGrowthEntry): GrowthEntry {
  return {
    id,
    babyId,
    date: data.date,
    weightKg: data.weightKg,
    heightCm: data.heightCm,
    headCircumferenceCm: data.headCircumferenceCm,
    notes: data.notes,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export const babyService = {
  // ==================== Baby Operations ====================

  /**
   * Create a new baby profile in Firestore
   */
  async createBaby(userId: string, baby: Baby): Promise<void> {
    const db = getFirestoreDb();
    const babyRef = doc(db, getUserBabiesPath(userId), baby.id);
    await setDoc(babyRef, babyToFirestore(baby));
  },

  /**
   * Get all babies for a user
   */
  async getBabies(userId: string): Promise<Baby[]> {
    const db = getFirestoreDb();
    const babiesRef = collection(db, getUserBabiesPath(userId));
    const q = query(babiesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) =>
      babyFromFirestore(doc.id, userId, doc.data() as FirestoreBaby)
    );
  },

  /**
   * Get a single baby by ID
   */
  async getBaby(userId: string, babyId: string): Promise<Baby | null> {
    const db = getFirestoreDb();
    const babyRef = doc(db, getUserBabiesPath(userId), babyId);
    const snapshot = await getDoc(babyRef);

    if (!snapshot.exists()) {
      return null;
    }

    return babyFromFirestore(snapshot.id, userId, snapshot.data() as FirestoreBaby);
  },

  /**
   * Update a baby profile
   */
  async updateBaby(userId: string, babyId: string, updates: Partial<Baby>): Promise<void> {
    const db = getFirestoreDb();
    const babyRef = doc(db, getUserBabiesPath(userId), babyId);

    // Build updates object - serverTimestamp() returns FieldValue
    const firestoreUpdates: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.name !== undefined) firestoreUpdates.name = updates.name;
    if (updates.dateOfBirth !== undefined) firestoreUpdates.dateOfBirth = updates.dateOfBirth;
    if (updates.biologicalSex !== undefined) firestoreUpdates.biologicalSex = updates.biologicalSex;
    if (updates.isPremature !== undefined) firestoreUpdates.isPremature = updates.isPremature;
    if (updates.originalDueDate !== undefined) firestoreUpdates.originalDueDate = updates.originalDueDate;
    if (updates.photoUri !== undefined) firestoreUpdates.photoUri = updates.photoUri;

    await updateDoc(babyRef, firestoreUpdates);
  },

  /**
   * Delete a baby and all related data
   */
  async deleteBaby(userId: string, babyId: string): Promise<void> {
    const db = getFirestoreDb();
    const batch = writeBatch(db);

    // Delete growth entries
    const growthEntriesRef = collection(db, getBabyGrowthEntriesPath(userId, babyId));
    const growthSnapshot = await getDocs(growthEntriesRef);
    growthSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete milestones
    const milestonesPath = `${getUserBabiesPath(userId)}/${babyId}/milestones`;
    const milestonesRef = collection(db, milestonesPath);
    const milestonesSnapshot = await getDocs(milestonesRef);
    milestonesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // Delete baby
    const babyRef = doc(db, getUserBabiesPath(userId), babyId);
    batch.delete(babyRef);

    await batch.commit();
  },

  // ==================== Growth Entry Operations ====================

  /**
   * Add a growth entry
   */
  async addGrowthEntry(userId: string, babyId: string, entry: GrowthEntry): Promise<void> {
    const db = getFirestoreDb();
    const entryRef = doc(db, getBabyGrowthEntriesPath(userId, babyId), entry.id);
    await setDoc(entryRef, growthEntryToFirestore(entry));
  },

  /**
   * Get all growth entries for a baby
   */
  async getGrowthEntries(userId: string, babyId: string): Promise<GrowthEntry[]> {
    const db = getFirestoreDb();
    const entriesRef = collection(db, getBabyGrowthEntriesPath(userId, babyId));
    const q = query(entriesRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) =>
      growthEntryFromFirestore(doc.id, babyId, doc.data() as FirestoreGrowthEntry)
    );
  },

  /**
   * Update a growth entry
   */
  async updateGrowthEntry(
    userId: string,
    babyId: string,
    entryId: string,
    updates: Partial<GrowthEntry>
  ): Promise<void> {
    const db = getFirestoreDb();
    const entryRef = doc(db, getBabyGrowthEntriesPath(userId, babyId), entryId);

    // Build updates object - serverTimestamp() returns FieldValue
    const firestoreUpdates: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.date !== undefined) firestoreUpdates.date = updates.date;
    if (updates.weightKg !== undefined) firestoreUpdates.weightKg = updates.weightKg;
    if (updates.heightCm !== undefined) firestoreUpdates.heightCm = updates.heightCm;
    if (updates.headCircumferenceCm !== undefined) firestoreUpdates.headCircumferenceCm = updates.headCircumferenceCm;
    if (updates.notes !== undefined) firestoreUpdates.notes = updates.notes;

    await updateDoc(entryRef, firestoreUpdates);
  },

  /**
   * Delete a growth entry
   */
  async deleteGrowthEntry(userId: string, babyId: string, entryId: string): Promise<void> {
    const db = getFirestoreDb();
    const entryRef = doc(db, getBabyGrowthEntriesPath(userId, babyId), entryId);
    await deleteDoc(entryRef);
  },

  // ==================== Batch Operations ====================

  /**
   * Create baby with initial growth entry in a single batch
   */
  async createBabyWithGrowthEntry(
    userId: string,
    baby: Baby,
    growthEntry: GrowthEntry
  ): Promise<void> {
    const db = getFirestoreDb();
    const batch = writeBatch(db);

    const babyRef = doc(db, getUserBabiesPath(userId), baby.id);
    batch.set(babyRef, babyToFirestore(baby));

    const entryRef = doc(db, getBabyGrowthEntriesPath(userId, baby.id), growthEntry.id);
    batch.set(entryRef, growthEntryToFirestore(growthEntry));

    await batch.commit();
  },

  /**
   * Sync all local babies to Firestore (for initial sync or recovery)
   */
  async syncBabies(userId: string, babies: Baby[], growthEntries: GrowthEntry[]): Promise<void> {
    const db = getFirestoreDb();
    const batch = writeBatch(db);

    for (const baby of babies) {
      const babyRef = doc(db, getUserBabiesPath(userId), baby.id);
      batch.set(babyRef, babyToFirestore(baby), { merge: true });
    }

    for (const entry of growthEntries) {
      const entryRef = doc(db, getBabyGrowthEntriesPath(userId, entry.babyId), entry.id);
      batch.set(entryRef, growthEntryToFirestore(entry), { merge: true });
    }

    await batch.commit();
  },
};
