/**
 * Milestone Types
 * Type definitions for developmental milestones feature
 */

export type MilestoneCategory = 'Motor' | 'Cognitive' | 'Social' | 'Language';

export type MilestoneSubcategory = 
  | 'Gross Motor' 
  | 'Fine Motor' 
  | 'Learning' 
  | 'Social-Emotional' 
  | 'Communication';

export type MilestoneStatus = 'achieved' | 'in_progress' | 'not_yet';

export type AgeFilterType = 'current' | 'past' | 'upcoming' | 'all';

export interface AgeRange {
  min: number;
  max: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  subcategory: MilestoneSubcategory;
  ageRangeMonths: AgeRange;
}

export interface MilestoneAchievement {
  milestoneId: string;
  babyId: string;
  status: MilestoneStatus;
  achievedAt?: string;
  notes?: string;
  photoUri?: string;
  updatedAt: string;
}

export interface NurtureFocusContent {
  id: string;
  title: string;
  category: MilestoneCategory;
  ageRangeMonths: AgeRange;
  imageKey: string;
  videoUrl: string | null;
  description: string;
}

export interface MilestoneData {
  version: string;
  source: string;
  lastUpdated: string;
  milestones: Milestone[];
  nurtureFocusContent: NurtureFocusContent[];
}

export interface AgeBlock {
  label: string;
  value: AgeFilterType;
  minMonths: number;
  maxMonths: number;
}
