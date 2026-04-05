/**
 * Sleep Feature Types
 */

export interface SleepEntry {
  id: string;
  babyId: string;
  date: string; // ISO 8601 date: "2024-03-20"
  sleepHours: number; // Total hours of sleep
  sleepMinutes: number; // Additional minutes
  quality?: 'good' | 'fair' | 'poor';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SleepRecommendation {
  ageRangeMonths: {
    min: number;
    max: number;
  };
  label: string;
  sleepHours: {
    min: number;
    max: number;
    recommended: number;
  };
  includesNaps: boolean;
  notes: string;
}

export interface SleepAnalysis {
  totalHours: number;
  recommendation: SleepRecommendation | null;
  status: 'below' | 'optimal' | 'above';
  percentageOfRecommended: number;
}
