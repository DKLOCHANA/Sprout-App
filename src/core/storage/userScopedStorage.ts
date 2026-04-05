/**
 * User-Scoped Storage Service
 * 
 * Helper functions for storing user-specific data in AsyncStorage.
 * All keys are prefixed with the user ID for isolation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS_CONST = {
  PROFILE_PHOTO: 'profile-photo-uri',
  SYNC_QUEUE: 'sync_queue',
  LAST_SYNC: 'last_sync_timestamp',
} as const;

/**
 * Get a user-scoped key
 */
function getUserKey(userId: string, key: string): string {
  return `${userId}:${key}`;
}

/**
 * User-scoped storage operations
 */
export const UserScopedStorage = {
  /**
   * Get profile photo URI for a user
   */
  async getProfilePhoto(userId: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(getUserKey(userId, STORAGE_KEYS_CONST.PROFILE_PHOTO));
    } catch {
      return null;
    }
  },

  /**
   * Set profile photo URI for a user
   */
  async setProfilePhoto(userId: string, uri: string): Promise<void> {
    await AsyncStorage.setItem(getUserKey(userId, STORAGE_KEYS_CONST.PROFILE_PHOTO), uri);
  },

  /**
   * Clear profile photo for a user
   */
  async clearProfilePhoto(userId: string): Promise<void> {
    await AsyncStorage.removeItem(getUserKey(userId, STORAGE_KEYS_CONST.PROFILE_PHOTO));
  },

  /**
   * Delete all data for a user (for account deletion)
   */
  async deleteAllUserData(userId: string): Promise<void> {
    const keysToDelete = [
      getUserKey(userId, 'baby-storage'),
      getUserKey(userId, 'milestone-storage'),
      getUserKey(userId, STORAGE_KEYS_CONST.PROFILE_PHOTO),
      getUserKey(userId, STORAGE_KEYS_CONST.SYNC_QUEUE),
      getUserKey(userId, STORAGE_KEYS_CONST.LAST_SYNC),
    ];
    await AsyncStorage.multiRemove(keysToDelete);
  },
};
