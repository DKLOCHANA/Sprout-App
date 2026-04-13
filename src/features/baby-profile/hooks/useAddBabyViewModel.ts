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
  originalDueDate?: string;
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
  const [isPremature, setIsPremature] = useState(false);
  const [originalDueDate, setOriginalDueDate] = useState(new Date());
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
    if (dateOfBirth > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    // Biological sex is required
    if (!biologicalSex) {
      newErrors.biologicalSex = 'Please select biological sex';
    }

    // If premature, original due date should be after date of birth
    if (isPremature && originalDueDate <= dateOfBirth) {
      newErrors.originalDueDate = 'Due date must be after birth date';
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
  }, [name, dateOfBirth, biologicalSex, isPremature, originalDueDate, weight, height, headCircumference]);

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
        isPremature,
        originalDueDate: isPremature
          ? originalDueDate.toISOString().split('T')[0]
          : undefined,
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
    isPremature,
    originalDueDate,
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
    isPremature,
    setIsPremature,
    originalDueDate,
    setOriginalDueDate,
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
