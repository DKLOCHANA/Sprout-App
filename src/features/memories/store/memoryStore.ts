/**
 * Custom Memory Store
 * Zustand store for user-created memories (not tied to milestones)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomMemory {
  id: string;
  babyId: string;
  title: string;
  description?: string;
  photoUri?: string;
  date: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

interface MemoryStore {
  // State
  memories: CustomMemory[];

  // Actions
  addMemory: (memory: Omit<CustomMemory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemory: (id: string, updates: Partial<CustomMemory>) => void;
  deleteMemory: (id: string) => void;
  getMemoriesForBaby: (babyId: string) => CustomMemory[];
  
  // Reset
  reset: () => void;
}

const generateId = () => `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState = {
  memories: [],
};

export const useMemoryStore = create<MemoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addMemory: (memoryData) => {
        const now = new Date().toISOString();
        const newMemory: CustomMemory = {
          ...memoryData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          memories: [newMemory, ...state.memories],
        }));
      },

      updateMemory: (id, updates) => {
        set((state) => ({
          memories: state.memories.map((memory) =>
            memory.id === id
              ? { ...memory, ...updates, updatedAt: new Date().toISOString() }
              : memory
          ),
        }));
      },

      deleteMemory: (id) => {
        set((state) => ({
          memories: state.memories.filter((memory) => memory.id !== id),
        }));
      },

      getMemoriesForBaby: (babyId) => {
        return get().memories.filter((memory) => memory.babyId === babyId);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'custom-memory-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        memories: state.memories,
      }),
    }
  )
);
