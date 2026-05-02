/**
 * useAddBabyViewModel Hook
 * Handles form state, validation, and submission for adding a new baby
 * (Different from BabySetup - doesn't affect onboarding state)
 */

import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useBabyStore } from '../store';
import { Baby, GrowthEntry, BiologicalSex } from '../types';
import { useAuthStore } from '@features/auth/store';
import { babyService } from '@core/firebase';
import { useSubscription } from '@/features/subscription';

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

export function useAddBabyViewModel() {
  const { user } = useAuthStore();
  const { addBabyWithInitialGrowth } = useBabyStore();
  const { checkCanAddChild } = useSubscription();

  // Form state
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate form data
   */
  const validate = useCallback((): boolean => {
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
  }, [name, dateOfBirth, biologicalSex, weight, height, headCircumference]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Check subscription limits before allowing submission
    if (!checkCanAddChild()) {
      // checkCanAddChild will navigate to paywall if limit reached
      return;
    }

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
        photoUri,
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
        notes: 'Initial measurement',
        createdAt: now,
        updatedAt: now,
      };

      // Add baby locally (also auto-selects the new baby)
      addBabyWithInitialGrowth(baby, growthEntry);

      // Sync to Firestore
      babyService.createBabyWithGrowthEntry(user.id, baby, growthEntry).catch((error) => {
        console.warn('Failed to sync baby to Firestore:', error);
      });

      // Navigate back to family management
      router.back();
    } catch (error) {
      console.error('Error creating baby profile:', error);
      setErrors({ name: 'Failed to create baby profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validate,
    user,
    name,
    photoUri,
    dateOfBirth,
    biologicalSex,
    weight,
    height,
    headCircumference,
    addBabyWithInitialGrowth,
    checkCanAddChild,
  ]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return {
    name,
    setName,
    photoUri,
    setPhotoUri,
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
    errors,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}
