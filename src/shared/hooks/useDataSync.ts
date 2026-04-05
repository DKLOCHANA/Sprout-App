/**
 * useDataSync Hook
 * Handles data synchronization with Firestore on app startup and user changes
 */

import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@features/auth/store';
import { useBabyStore } from '@features/baby-profile/store';
import { useMilestoneStore } from '@features/milestones/store';
import { syncService } from '@core/storage/syncService';

interface UseDataSyncOptions {
  syncOnMount?: boolean;
  syncOnForeground?: boolean;
}

export function useDataSync(options: UseDataSyncOptions = {}) {
  const { syncOnMount = true, syncOnForeground = true } = options;
  
  const { user, isAuthenticated } = useAuthStore();
  const { babies, isSyncing: isBabySyncing } = useBabyStore();
  const { isSyncing: isMilestoneSyncing } = useMilestoneStore();
  
  const hasInitialSynced = useRef(false);
  const appState = useRef(AppState.currentState);

  const isSyncing = isBabySyncing || isMilestoneSyncing;

  /**
   * Perform initial data sync
   */
  const performSync = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;
    
    try {
      // If local data exists, push to Firestore
      if (babies.length > 0) {
        await syncService.fullSync(user.id);
      } else {
        // No local data, try to load from Firestore
        await syncService.loadFromFirestore(user.id);
      }
    } catch (error) {
      console.warn('Data sync failed:', error);
    }
  }, [user?.id, isAuthenticated, babies.length]);

  /**
   * Initial sync on mount
   */
  useEffect(() => {
    if (!syncOnMount || hasInitialSynced.current) return;
    if (!user?.id || !isAuthenticated) return;

    hasInitialSynced.current = true;
    performSync();
  }, [user?.id, isAuthenticated, syncOnMount, performSync]);

  /**
   * Sync when app comes to foreground
   */
  useEffect(() => {
    if (!syncOnForeground) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        if (user?.id && isAuthenticated) {
          syncService.processQueue();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [user?.id, isAuthenticated, syncOnForeground]);

  /**
   * Manual sync trigger
   */
  const sync = useCallback(async () => {
    if (!user?.id) return;
    await syncService.fullSync(user.id);
  }, [user?.id]);

  /**
   * Refresh data from Firestore
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;
    await syncService.loadFromFirestore(user.id);
  }, [user?.id]);

  return {
    isSyncing,
    sync,
    refresh,
  };
}
