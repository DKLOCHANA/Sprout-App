/**
 * Baby Profile Types
 * Data structures for baby profiles and growth tracking
 */

export type BiologicalSex = 'male' | 'female';

export interface Baby {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string; // ISO 8601: "2024-01-15"
  biologicalSex: BiologicalSex;
  isPremature: boolean;
  originalDueDate?: string; // ISO 8601: "2024-02-10" - Only if isPremature
  photoUri: string | null;
  createdAt: string; // ISO 8601 with time
  updatedAt: string;
}

export interface GrowthEntry {
  id: string;
  babyId: string;
  date: string; // ISO 8601: "2024-03-20"
  weightKg: number | null; // Weight in kilograms
  heightCm: number | null; // Height in centimeters
  headCircumferenceCm: number | null; // Head circumference in centimeters
  notes?: string;
  createdAt: string; // ISO 8601 with time
  updatedAt: string;
}

export interface BabyFormData {
  name: string;
  dateOfBirth: Date;
  biologicalSex: BiologicalSex;
  isPremature: boolean;
  originalDueDate?: Date;
  currentWeight: string; // User input as string
  currentHeight: string; // User input as string
  currentHeadCircumference: string; // User input as string
}

export interface BabyAge {
  days: number;
  weeks: number;
  months: number;
  years: number;
  adjustedDays?: number; // If premature, adjusted age
  adjustedWeeks?: number;
  adjustedMonths?: number;
}
