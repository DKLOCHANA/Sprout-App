/**
 * useMemories Hook
 * Fetches achieved milestones and custom memories for the current baby
 */

import { useMemo, useCallback } from 'react';
import milestoneData from '@/core/data/milestones/cdc-milestones.json';
import { useMilestoneStore } from '@/features/milestones/store';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMemoryStore } from '../store';
import { useSubscription } from '@/features/subscription';
import type { Milestone } from '@/features/milestones/types';
import type { MemoryDisplayData } from '../types';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

export function useMemories() {
  const { getSelectedBaby } = useBabyStore();
  const { checkCanAddManualMemory } = useSubscription();
  
  // Subscribe to the achievements array directly for reactivity
  const allAchievements = useMilestoneStore((state) => state.achievements);
  
  // Subscribe to the memories array directly for reactivity
  const allCustomMemories = useMemoryStore((state) => state.memories);
  const addMemory = useMemoryStore((state) => state.addMemory);

  const baby = getSelectedBaby();

  // Get all milestones as a lookup map
  const milestonesMap = useMemo(() => {
    const map = new Map<string, Milestone>();
    const milestones = milestoneData.milestones as Milestone[];
    milestones.forEach((m) => map.set(m.id, m));
    return map;
  }, []);

  // Get achieved milestones for current baby
  const milestoneMemories = useMemo((): MemoryDisplayData[] => {
    if (!baby) return [];

    // Filter achievements for current baby from the subscribed array
    const babyAchievements = allAchievements.filter((a) => a.babyId === baby.id);
    const achievedMilestones: MemoryDisplayData[] = [];

    for (const achievement of babyAchievements) {
      if (achievement.status !== 'achieved' || !achievement.achievedAt) {
        continue;
      }

      const milestone = milestonesMap.get(achievement.milestoneId);
      if (!milestone) continue;

      const achievedDate = new Date(achievement.achievedAt);

      achievedMilestones.push({
        id: `milestone-${achievement.milestoneId}-${achievement.babyId}`,
        title: milestone.title,
        description: milestone.description,
        date: achievedDate,
        formattedDate: formatDate(achievement.achievedAt),
        photoUri: achievement.photoUri,
        notes: achievement.notes,
        category: milestone.category,
      });
    }

    return achievedMilestones;
  }, [baby, allAchievements, milestonesMap]);

  // Get custom memories for current baby (reactive to store changes)
  const customMemories = useMemo((): MemoryDisplayData[] => {
    if (!baby) return [];

    // Filter memories for current baby from the subscribed array
    const babyMemories = allCustomMemories.filter((m) => m.babyId === baby.id);

    return babyMemories.map((memory) => ({
      id: `custom-${memory.id}`,
      title: memory.title,
      description: memory.description || '',
      date: new Date(memory.date),
      formattedDate: formatDate(memory.date),
      photoUri: memory.photoUri,
      notes: memory.description,
      category: 'Memory',
    }));
  }, [baby, allCustomMemories]);

  // Combine and sort all memories by date (most recent first)
  const memories = useMemo((): MemoryDisplayData[] => {
    const allMemories = [...milestoneMemories, ...customMemories];
    return allMemories.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [milestoneMemories, customMemories]);

  // Add a new custom memory (with subscription check)
  const addCustomMemory = useCallback(
    (data: {
      title: string;
      description?: string;
      photoUri?: string;
      date: Date;
    }): boolean => {
      if (!baby) return false;

      // Check subscription limits before adding manual memory
      if (!checkCanAddManualMemory()) {
        // checkCanAddManualMemory will navigate to paywall if limit reached
        return false;
      }

      addMemory({
        babyId: baby.id,
        title: data.title,
        description: data.description,
        photoUri: data.photoUri,
        date: data.date.toISOString(),
      });
      
      return true;
    },
    [baby, addMemory, checkCanAddManualMemory]
  );

  // Get baby's name for personalized subtitle
  const babyName = useMemo(() => {
    return baby?.name || 'your little one';
  }, [baby?.name]);

  // Count total memories
  const totalMemories = memories.length;

  // Count custom memories (for limit display)
  const customMemoryCount = customMemories.length;

  // Check if has any memories
  const hasMemories = totalMemories > 0;

  return {
    memories,
    baby,
    babyName,
    totalMemories,
    customMemoryCount,
    hasMemories,
    addCustomMemory,
  };
}
