/**
 * AgeDisplay Component
 * Shows baby's current age with personalized greeting
 * Includes profile icon to open baby selector
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radii, shadows } from '@/core/theme';

interface AgeDisplayProps {
  months: number;
  days: number;
  babyName?: string;
  babyPhotoUri?: string | null;
  onProfilePress?: () => void;
  showProfileIcon?: boolean;
}

export function AgeDisplay({ 
  months, 
  days, 
  babyName = 'Your baby',
  babyPhotoUri,
  onProfilePress,
  showProfileIcon = false,
}: AgeDisplayProps) {
  const initial = babyName.charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Profile icon in top right corner */}
        {showProfileIcon && onProfilePress && (
          <Pressable 
            style={styles.profileButton}
            onPress={onProfilePress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <View style={styles.profileIconContainer}>
              {babyPhotoUri ? (
                <Image source={{ uri: babyPhotoUri }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profileInitial}>{initial}</Text>
              )}
              <View style={styles.switchIndicator}>
                <Ionicons name="swap-horizontal" size={10} color={colors.textOnPrimary} />
              </View>
            </View>
          </Pressable>
        )}

        {/* Greeting text */}
        <Text style={styles.greeting}>
          Your baby, <Text style={styles.babyName}>{babyName}</Text> is
        </Text>
        
        {/* Age display - all in one line */}
        <View style={styles.ageRow}>
          {months > 0 && (
            <>
              <Text style={styles.ageNumber}>{months}</Text>
              <Text style={styles.ageUnit}>month{months !== 1 ? 's' : ''}</Text>
            </>
          )}
          
          {months > 0 && days > 0 && (
            <Text style={styles.comma}>, </Text>
          )}
          
          {days > 0 && (
            <>
              <Text style={styles.ageNumber}>{days}</Text>
              <Text style={styles.ageUnit}>day{days !== 1 ? 's' : ''}</Text>
            </>
          )}
          
          {months === 0 && days === 0 ? (
            <Text style={styles.ageNumber}>just born</Text>
          ) : (
            <Text style={styles.suffix}> old!</Text>
          )}
        </View>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    
    
  },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    
    ...shadows.md,
    overflow: 'hidden',
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    ...shadows.sm,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    contentFit: 'cover',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  switchIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  greeting: {
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 24,
    paddingRight: spacing['2xl'], // Make room for profile icon
  },
  babyName: {
    
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.secondary,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  ageNumber: {
    fontSize: 56,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.secondary,
    lineHeight: 56,
    marginRight: spacing.xs,
  },
  ageUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 32,
    marginRight: spacing.xs,
  },
  comma: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  suffix: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  
});