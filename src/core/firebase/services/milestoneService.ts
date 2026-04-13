/**
 * Milestone Service
 * Firestore operations for milestone achievements
 */

import {
  getFirestoreDb,
  getBabyMilestonesPath,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  writeBatch,
  Timestamp,
  type FirestoreMilestoneAchievement,
} from '../firestore';
import type { MilestoneAchievement, MilestoneStatus } from '@features/milestones/types';

// Converters
function achievementToFirestore(achievement: MilestoneAchievement): FirestoreMilestoneAchievement {
  const doc: FirestoreMilestoneAchievement = {
    milestoneId: achievement.milestoneId,
    status: achievement.status,
    updatedAt: Timestamp.fromDate(new Date(achievement.updatedAt)),
  };
  
  // Only include optional fields if they exist
  if (achievement.achievedAt) {
    doc.achievedAt = Timestamp.fromDate(new Date(achievement.achievedAt));
  }
  if (achievement.notes) {
    doc.notes = achievement.notes;
  }
  if (achievement.photoUri) {
    doc.photoUri = achievement.photoUri;
  }
  
  return doc;
}

function achievementFromFirestore(
  babyId: string,
  data: FirestoreMilestoneAchievement
): MilestoneAchievement {
  return {
    milestoneId: data.milestoneId,
    babyId,
    status: data.status,
    achievedAt: data.achievedAt?.toDate().toISOString(),
    notes: data.notes,
    photoUri: data.photoUri,
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export const milestoneService = {
  /**
   * Update or create a milestone achievement
   */
  async updateMilestoneStatus(
    userId: string,
    babyId: string,
    milestoneId: string,
    status: MilestoneStatus,
    options?: { notes?: string; photoUri?: string }
  ): Promise<void> {
    const db = getFirestoreDb();
    const achievementRef = doc(db, getBabyMilestonesPath(userId, babyId), milestoneId);
    
    const now = Timestamp.now();
    const existingDoc = await getDoc(achievementRef);
    
    // Build achievement object without undefined values (Firestore doesn't accept undefined)
    const achievement: FirestoreMilestoneAchievement = {
      milestoneId,
      status,
      updatedAt: now,
    };

    // Only add achievedAt if status is 'achieved'
    if (status === 'achieved') {
      achievement.achievedAt = (existingDoc.exists() && existingDoc.data()?.achievedAt) || now;
    }

    // Only add optional fields if they have values
    if (options?.notes) {
      achievement.notes = options.notes;
    }
    if (options?.photoUri) {
      achievement.photoUri = options.photoUri;
    }

    await setDoc(achievementRef, achievement, { merge: true });
  },

  /**
   * Get a single milestone achievement
   */
  async getMilestoneAchievement(
    userId: string,
    babyId: string,
    milestoneId: string
  ): Promise<MilestoneAchievement | null> {
    const db = getFirestoreDb();
    const achievementRef = doc(db, getBabyMilestonesPath(userId, babyId), milestoneId);
    const snapshot = await getDoc(achievementRef);

    if (!snapshot.exists()) {
      return null;
    }

    return achievementFromFirestore(babyId, snapshot.data() as FirestoreMilestoneAchievement);
  },

  /**
   * Get all milestone achievements for a baby
   */
  async getAchievementsForBaby(userId: string, babyId: string): Promise<MilestoneAchievement[]> {
    const db = getFirestoreDb();
    const milestonesRef = collection(db, getBabyMilestonesPath(userId, babyId));
    const q = query(milestonesRef);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) =>
      achievementFromFirestore(babyId, doc.data() as FirestoreMilestoneAchievement)
    );
  },

  /**
   * Delete all milestone achievements for a baby
   */
  async deleteBabyAchievements(userId: string, babyId: string): Promise<void> {
    const db = getFirestoreDb();
    const milestonesRef = collection(db, getBabyMilestonesPath(userId, babyId));
    const snapshot = await getDocs(milestonesRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  },

  /**
   * Sync all local achievements to Firestore
   */
  async syncAchievements(
    userId: string,
    achievements: MilestoneAchievement[]
  ): Promise<void> {
    const db = getFirestoreDb();
    const batch = writeBatch(db);

    for (const achievement of achievements) {
      const achievementRef = doc(
        db,
        getBabyMilestonesPath(userId, achievement.babyId),
        achievement.milestoneId
      );
      batch.set(achievementRef, achievementToFirestore(achievement), { merge: true });
    }

    await batch.commit();
  },

  /**
   * Batch update multiple milestone achievements
   */
  async batchUpdateAchievements(
    userId: string,
    babyId: string,
    updates: Array<{
      milestoneId: string;
      status: MilestoneStatus;
      notes?: string;
      photoUri?: string;
    }>
  ): Promise<void> {
    const db = getFirestoreDb();
    const batch = writeBatch(db);
    const now = Timestamp.now();

    for (const update of updates) {
      const achievementRef = doc(
        db,
        getBabyMilestonesPath(userId, babyId),
        update.milestoneId
      );

      // Build achievement object without undefined values (Firestore doesn't accept undefined)
      const achievement: FirestoreMilestoneAchievement = {
        milestoneId: update.milestoneId,
        status: update.status,
        updatedAt: now,
      };

      // Only add achievedAt if status is 'achieved'
      if (update.status === 'achieved') {
        achievement.achievedAt = now;
      }

      // Only add optional fields if they have values
      if (update.notes) {
        achievement.notes = update.notes;
      }
      if (update.photoUri) {
        achievement.photoUri = update.photoUri;
      }

      batch.set(achievementRef, achievement, { merge: true });
    }

    await batch.commit();
  },
};
