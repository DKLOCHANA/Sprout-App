/**
 * Memory Types
 * Type definitions for the memories feature
 */

import type { Milestone, MilestoneAchievement } from '@/features/milestones/types';

export interface Memory {
  id: string;
  milestone: Milestone;
  achievement: MilestoneAchievement;
  achievedAt: Date;
}

export interface MemoryDisplayData {
  id: string;
  title: string;
  description: string;
  date: Date;
  formattedDate: string;
  photoUri: string | undefined;
  notes: string | undefined;
  category: string;
}
