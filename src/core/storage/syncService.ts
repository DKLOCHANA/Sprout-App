/**
 * Sync Service
 * Handles data synchronization between local storage and Firestore
 * Provides offline queue and retry logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { babyService, milestoneService, userService } from '@core/firebase';
import { useBabyStore } from '@features/baby-profile/store';
import { useMilestoneStore } from '@features/milestones/store';

const SYNC_QUEUE_KEY = 'sync_queue';
const LAST_SYNC_KEY = 'last_sync_timestamp';

type SyncOperationType = 
  | 'create_baby'
  | 'update_baby'
  | 'delete_baby'
  | 'create_growth_entry'
  | 'update_growth_entry'
  | 'delete_growth_entry'
  | 'update_milestone';

interface SyncQueueItem {
  id: string;
  type: SyncOperationType;
  userId: string;
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
}

class SyncService {
  private isProcessingQueue = false;
  private maxRetries = 3;

  /**
   * Add an operation to the sync queue
   */
  async queueOperation(
    type: SyncOperationType,
    userId: string,
    payload: Record<string, any>
  ): Promise<void> {
    const queue = await this.getQueue();
    const item: SyncQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      userId,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    await this.saveQueue(queue);
    
    // Try to process immediately
    this.processQueue();
  }

  /**
   * Get the current sync queue
   */
  private async getQueue(): Promise<SyncQueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save the sync queue
   */
  private async saveQueue(queue: SyncQueueItem[]): Promise<void> {
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Process pending items in the sync queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    try {
      const queue = await this.getQueue();
      const failedItems: SyncQueueItem[] = [];

      for (const item of queue) {
        try {
          await this.processItem(item);
        } catch (error) {
          console.warn(`Failed to process sync item ${item.id}:`, error);
          
          if (item.retryCount < this.maxRetries) {
            failedItems.push({
              ...item,
              retryCount: item.retryCount + 1,
            });
          } else {
            console.error(`Sync item ${item.id} exceeded max retries, dropping`);
          }
        }
      }

      await this.saveQueue(failedItems);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Process a single sync queue item
   */
  private async processItem(item: SyncQueueItem): Promise<void> {
    const { type, userId, payload } = item;

    switch (type) {
      case 'create_baby':
        await babyService.createBaby(userId, payload.baby);
        break;
      case 'update_baby':
        await babyService.updateBaby(userId, payload.babyId, payload.updates);
        break;
      case 'delete_baby':
        await babyService.deleteBaby(userId, payload.babyId);
        break;
      case 'create_growth_entry':
        await babyService.addGrowthEntry(userId, payload.babyId, payload.entry);
        break;
      case 'update_growth_entry':
        await babyService.updateGrowthEntry(
          userId,
          payload.babyId,
          payload.entryId,
          payload.updates
        );
        break;
      case 'delete_growth_entry':
        await babyService.deleteGrowthEntry(userId, payload.babyId, payload.entryId);
        break;
      case 'update_milestone':
        await milestoneService.updateMilestoneStatus(
          userId,
          payload.babyId,
          payload.milestoneId,
          payload.status,
          { notes: payload.notes, photoUri: payload.photoUri }
        );
        break;
    }
  }

  /**
   * Full sync - push local data to Firestore and pull remote data
   */
  async fullSync(userId: string): Promise<void> {
    try {
      // Process any pending queue items first
      await this.processQueue();

      // Get local state
      const babyState = useBabyStore.getState();
      const milestoneState = useMilestoneStore.getState();

      // Sync babies and growth entries
      await babyService.syncBabies(userId, babyState.babies, babyState.growthEntries);

      // Sync milestones
      await milestoneService.syncAchievements(userId, milestoneState.achievements);

      // Update last sync timestamp
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }

  /**
   * Load all data from Firestore into local stores
   */
  async loadFromFirestore(userId: string): Promise<void> {
    try {
      // Load babies and growth entries
      await useBabyStore.getState().loadFromFirestore(userId);

      // Get baby IDs for milestone loading
      const babyIds = useBabyStore.getState().babies.map((b) => b.id);

      // Load milestones
      if (babyIds.length > 0) {
        await useMilestoneStore.getState().loadFromFirestore(userId, babyIds);
      }

      // Update last sync timestamp
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Load from Firestore failed:', error);
      throw error;
    }
  }

  /**
   * Get last sync timestamp
   */
  async getLastSyncTime(): Promise<string | null> {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  }

  /**
   * Clear sync queue (use with caution)
   */
  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  }

  /**
   * Get queue size
   */
  async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }
}

export const syncService = new SyncService();
