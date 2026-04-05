/**
 * Profile Types
 * Type definitions for profile feature
 */

export interface ProfileStats {
  growthPercentile?: number;
  totalMilestones: number;
  achievedMilestones: number;
  inProgressMilestones: number;
}

export interface PdfReportData {
  babyName: string;
  dateOfBirth: string;
  ageText: string;
  biologicalSex: 'male' | 'female';
  isPremature: boolean;
  reportDate: string;
  growth: {
    date: string;
    weightKg: number | null;
    weightPercentile: number | null;
    heightCm: number | null;
    heightPercentile: number | null;
    headCircumferenceCm: number | null;
    headCircumferencePercentile: number | null;
  } | null;
  milestones: {
    achieved: string[];
    inProgress: string[];
    delayed: string[];
  };
  parentName?: string;
}

export interface SettingsRowData {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  onPress: () => void;
}
