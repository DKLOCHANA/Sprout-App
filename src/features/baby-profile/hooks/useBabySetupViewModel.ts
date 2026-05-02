/**
 * Baby Setup ViewModel Hook
 * Handles form state, validation, and submission for baby setup screen
 */

import { useState } from 'react';
import { router } from 'expo-router';
import { useBabyStore } from '../store';
import { Baby, GrowthEntry, BiologicalSex, BabyAge } from '../types';
import { useAuthStore } from '@features/auth/store';
import { babyService } from '@core/firebase';

interface FormErrors {
  name?: string;
  dateOfBirth?: string;
  biologicalSex?: string;
  weight?: string;
  height?: string;
  headCircumference?: string;
}

const MAX_AGE_DAYS = 730; // 2 years

function differenceInDays(later: Date, earlier: Date): number {
  const ms = later.getTime() - earlier.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function useBabySetupViewModel() {
  const { user, setOnboardingComplete } = useAuthStore();
  const { addBabyWithInitialGrowth } = useBabyStore();

  // Form state
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAge = (dob: Date): BabyAge => {
    const now = new Date();
    const birthDate = new Date(dob);

    const diffMs = now.getTime() - birthDate.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    return { days, weeks, months, years };
  };

  /**
   * Validate form data
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name is required
    if (!name.trim()) {
      newErrors.name = 'Baby name is required';
    }

    // Date of birth should not be in the future
    const today = new Date();
    if (dateOfBirth > today) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    } else {
      // Sprout currently supports children up to 2 years old
      const ageDays = differenceInDays(today, dateOfBirth);
      if (ageDays > MAX_AGE_DAYS) {
        newErrors.dateOfBirth =
          'Sprout currently supports children up to 2 years old. Please add a younger child.';
      }
    }

    // Biological sex is required
    if (!biologicalSex) {
      newErrors.biologicalSex = 'Please select biological sex';
    }

    // Weight is required
    if (!weight || !weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    // Height is required
    if (!height || !height.trim()) {
      newErrors.height = 'Height is required';
    } else if (isNaN(Number(height)) || Number(height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }

    // Head circumference is required
    if (!headCircumference || !headCircumference.trim()) {
      newErrors.headCircumference = 'Head circumference is required';
    } else if (isNaN(Number(headCircumference)) || Number(headCircumference) <= 0) {
      newErrors.headCircumference = 'Please enter a valid head circumference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Creates baby profile and initial growth entry in a batched operation
   */
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const babyId = `baby_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const baby: Baby = {
        id: babyId,
        userId: user.id,
        name: name.trim(),
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        biologicalSex: biologicalSex as BiologicalSex,
        isPremature: false,
        photoUri: null,
        createdAt: now,
        updatedAt: now,
      };

      const growthEntry: GrowthEntry = {
        id: `growth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        babyId,
        date: new Date().toISOString().split('T')[0],
        weightKg: weight ? Number(weight) : null,
        heightCm: height ? Number(height) : null,
        headCircumferenceCm: headCircumference ? Number(headCircumference) : null,
        notes: 'Initial baseline measurement',
        createdAt: now,
        updatedAt: now,
      };

      // Batched operation: Create baby profile + initial growth entry (local)
      addBabyWithInitialGrowth(baby, growthEntry);

      // Mark onboarding as complete
      setOnboardingComplete();

      // Sync to Firestore (background, non-blocking)
      babyService.createBabyWithGrowthEntry(user.id, baby, growthEntry).catch((error) => {
        console.warn('Failed to sync baby to Firestore:', error);
      });

      // Navigate to home screen
      router.replace('/(app)');
    } catch (error) {
      console.error('Error creating baby profile:', error);
      setErrors({ name: 'Failed to create baby profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form state
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    biologicalSex,
    setBiologicalSex,
    weight,
    setWeight,
    height,
    setHeight,
    headCircumference,
    setHeadCircumference,

    // Validation & submission
    errors,
    isSubmitting,
    handleSubmit,
    calculateAge,
  };
}
