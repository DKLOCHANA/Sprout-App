/**
 * useEditBabyViewModel Hook
 * Handles form state, validation, and submission for editing an existing baby
 */

import { useState, useCallback, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useBabyStore } from '../store';
import { BiologicalSex } from '../types';
import { useAuthStore } from '@features/auth/store';
import { babyService } from '@core/firebase';

interface FormErrors {
  name?: string;
  dateOfBirth?: string;
  originalDueDate?: string;
}

export function useEditBabyViewModel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { getBabyById, updateBaby } = useBabyStore();

  const baby = id ? getBabyById(id) : undefined;

  // Form state
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex>('male');
  const [isPremature, setIsPremature] = useState(false);
  const [originalDueDate, setOriginalDueDate] = useState(new Date());

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form with baby data
  useEffect(() => {
    if (baby) {
      setName(baby.name);
      setPhotoUri(baby.photoUri);
      setDateOfBirth(new Date(baby.dateOfBirth));
      setBiologicalSex(baby.biologicalSex);
      setIsPremature(baby.isPremature);
      if (baby.originalDueDate) {
        setOriginalDueDate(new Date(baby.originalDueDate));
      }
      setIsLoading(false);
    } else if (id) {
      // Baby not found
      Alert.alert('Error', 'Baby profile not found.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [baby, id]);

  /**
   * Validate form data
   */
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Baby name is required';
    }

    if (dateOfBirth > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    if (isPremature && originalDueDate <= dateOfBirth) {
      newErrors.originalDueDate = 'Due date must be after birth date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, dateOfBirth, isPremature, originalDueDate]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!validate() || !id || !baby) {
      return;
    }

    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      const updates = {
        name: name.trim(),
        photoUri,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0],
        biologicalSex,
        isPremature,
        originalDueDate: isPremature
          ? originalDueDate.toISOString().split('T')[0]
          : undefined,
      };

      // Update locally
      updateBaby(id, updates);

      // Sync to Firestore
      babyService.updateBaby(user.id, id, updates).catch((error) => {
        console.warn('Failed to sync baby update to Firestore:', error);
      });

      // Navigate back
      router.back();
    } catch (error) {
      console.error('Error updating baby profile:', error);
      setErrors({ name: 'Failed to update baby profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validate,
    id,
    baby,
    user,
    name,
    photoUri,
    dateOfBirth,
    biologicalSex,
    isPremature,
    originalDueDate,
    updateBaby,
  ]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return {
    baby,
    isLoading,
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
    errors,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}
