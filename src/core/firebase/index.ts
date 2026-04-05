/**
 * Firebase Exports
 */

export { initializeFirebase, getFirebaseApp, getFirebaseAuth } from './config';
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  getCurrentUser,
  deleteAccount,
  type AuthUser,
  type AuthResult,
} from './auth';
export {
  getFirestoreDb,
  COLLECTIONS,
  getUserBabiesPath,
  getBabyGrowthEntriesPath,
  getBabyMilestonesPath,
  toFirestoreTimestamp,
  fromFirestoreTimestamp,
  type FirestoreUser,
  type FirestoreBaby,
  type FirestoreGrowthEntry,
  type FirestoreMilestoneAchievement,
} from './firestore';

// Services
export { userService } from './services/userService';
export { babyService } from './services/babyService';
export { milestoneService } from './services/milestoneService';
