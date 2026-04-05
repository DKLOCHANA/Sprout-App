/**
 * useProfileViewModel Hook
 * Profile screen business logic
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBabyStore } from '@/features/baby-profile/store';
import { useMilestoneStore } from '@/features/milestones/store';
import { useAuthStore } from '@/features/auth/store';
import { useGrowthAnalysis } from '@/shared/hooks';
import { signOut, deleteAccount as firebaseDeleteAccount } from '@/core/firebase';
import type { ProfileStats } from '../types';
import { differenceInMonths } from 'date-fns';

// Load milestone definitions
import cdcMilestones from '@/core/data/milestones/cdc-milestones.json';

const PROFILE_PHOTO_KEY = 'profile-photo-uri';

interface UseProfileViewModelReturn {
  // User info
  userName: string | null;
  userEmail: string | null;
  userPhotoUrl: string | null;
  profilePhotoUri: string | null;
  
  // Baby info
  baby: ReturnType<typeof useBabyStore.getState>['babies'][0] | null;
  babyPhotoUri: string | null;
  
  // Stats
  profileStats: ProfileStats;
  
  // Actions
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleFamilyManagement: () => void;
  handlePrivacyPolicy: () => void;
  handleTermsOfService: () => void;
  handleProfilePhotoChange: (uri: string) => void;
}

export function useProfileViewModel(): UseProfileViewModelReturn {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const { getSelectedBaby, getGrowthEntriesForBaby, reset: resetBabyStore } = useBabyStore();
  const { getAchievementsForBaby, reset: resetMilestoneStore } = useMilestoneStore();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  
  // Load profile photo from storage on mount
  useMemo(() => {
    AsyncStorage.getItem(PROFILE_PHOTO_KEY).then((uri) => {
      if (uri) setProfilePhotoUri(uri);
    });
  }, []);
  
  const baby = getSelectedBaby();
  const growthEntries = baby ? getGrowthEntriesForBaby(baby.id) : [];
  const { latestPercentiles } = useGrowthAnalysis(baby, growthEntries);
  
  // Calculate profile stats
  const profileStats = useMemo((): ProfileStats => {
    if (!baby) {
      return {
        totalMilestones: 0,
        achievedMilestones: 0,
        inProgressMilestones: 0,
      };
    }

    const achievements = getAchievementsForBaby(baby.id);
    const milestoneData = cdcMilestones as { milestones: Array<{ id: string; ageRangeMonths: { max: number } }> };
    
    // Get baby age in months
    const ageMonths = differenceInMonths(new Date(), new Date(baby.dateOfBirth));
    
    // Count age-appropriate milestones
    const ageAppropriateMilestones = milestoneData.milestones.filter(
      m => m.ageRangeMonths.max <= ageMonths + 3
    );

    const achievedCount = achievements.filter(a => a.status === 'achieved').length;
    const inProgressCount = achievements.filter(a => a.status === 'in_progress').length;

    return {
      growthPercentile: latestPercentiles?.weight,
      totalMilestones: ageAppropriateMilestones.length,
      achievedMilestones: achievedCount,
      inProgressMilestones: inProgressCount,
    };
  }, [baby, getAchievementsForBaby, latestPercentiles]);

  const handleProfilePhotoChange = useCallback((uri: string) => {
    setProfilePhotoUri(uri);
    AsyncStorage.setItem(PROFILE_PHOTO_KEY, uri).catch((error) => {
      console.error('Failed to save profile photo:', error);
    });
  }, []);

  const handleSignOut = useCallback(async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              clearUser();
              resetBabyStore();
              resetMilestoneStore();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  }, [clearUser, resetBabyStore, resetMilestoneStore, router]);

  const handleDeleteAccount = useCallback(async () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data including baby profiles, milestones, and memories. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Second confirmation for destructive action
            Alert.alert(
              'Are you absolutely sure?',
              'All your data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Delete Firebase account
                      await firebaseDeleteAccount();
                      
                      // Clear all local storage
                      await AsyncStorage.multiRemove([
                        'baby-storage',
                        'growth-storage',
                        'milestone-storage',
                        'activity-storage',
                        'photo-storage',
                        'memory-storage',
                        PROFILE_PHOTO_KEY,
                      ]);
                      
                      // Reset all stores
                      clearUser();
                      resetBabyStore();
                      resetMilestoneStore();
                      
                      // Navigate to registration
                      router.replace('/(auth)/register');
                    } catch (error) {
                      console.error('Delete account error:', error);
                      Alert.alert(
                        'Error',
                        'Failed to delete account. You may need to sign in again before deleting.',
                        [{ text: 'OK' }]
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }, [clearUser, resetBabyStore, resetMilestoneStore, router]);

  const handleFamilyManagement = useCallback(() => {
    router.push('/family-management');
  }, [router]);

  const handlePrivacyPolicy = useCallback(() => {
    Linking.openURL('https://dklochana.github.io/sprout./privacy-policy/');
  }, []);

  const handleTermsOfService = useCallback(() => {
    Linking.openURL('https://dklochana.github.io/sprout./terms-of-service/');
  }, []);

  return {
    userName: user?.displayName || null,
    userEmail: user?.email || null,
    userPhotoUrl: user?.photoURL || null,
    profilePhotoUri,
    baby,
    babyPhotoUri: baby?.photoUri || null,
    profileStats,
    handleSignOut,
    handleDeleteAccount,
    handleFamilyManagement,
    handlePrivacyPolicy,
    handleTermsOfService,
    handleProfilePhotoChange,
  };
}
