/**
 * ProfileHeader Component
 * Displays user avatar with edit badge, name, and membership status
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radii } from '@/core/theme';

interface ProfileHeaderProps {
  name: string | null;
  photoUri: string | null;
  memberSince?: string;
  onPhotoChange?: (uri: string) => void;
}

export function ProfileHeader({
  name,
  photoUri,
  memberSince,
  onPhotoChange,
}: ProfileHeaderProps) {
  const { width } = useWindowDimensions();
  const avatarSize = Math.min(width * 0.28, 120);

  const getInitials = (name: string | null): string => {
    if (!name) return '👶';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getMemberYear = (): string => {
    if (memberSince) {
      return new Date(memberSince).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  };

  const handleEditPhoto = useCallback(async () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose how you want to update your photo',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert(
                  'Permission Required',
                  'Please allow access to your camera to take photos.',
                  [{ text: 'OK' }]
                );
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                onPhotoChange?.(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Error taking photo:', error);
              Alert.alert('Error', 'Failed to take photo. Please try again.');
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert(
                  'Permission Required',
                  'Please allow access to your photo library.',
                  [{ text: 'OK' }]
                );
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                onPhotoChange?.(result.assets[0].uri);
              }
            } catch (error) {
              console.error('Error picking image:', error);
              Alert.alert('Error', 'Failed to pick image. Please try again.');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [onPhotoChange]);

  return (
    <View style={styles.container}>
      {/* Avatar with Edit Badge */}
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          />
        ) : (
          <View 
            style={[
              styles.avatarPlaceholder, 
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }
            ]}
          >
            <Text style={[styles.avatarInitials, { fontSize: avatarSize * 0.35 }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}
        
        {/* Edit Badge */}
        <Pressable 
          style={[styles.editBadge, { right: 0, bottom: 0 }]}
          onPress={handleEditPhoto}
          hitSlop={8}
        >
          <Ionicons name="camera" size={14} color={colors.textOnPrimary} />
        </Pressable>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {name || 'Your Name'}
      </Text>

      {/* Membership Status */}
      <Text style={styles.memberStatus}>
        Sprout Member • Since {getMemberYear()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: colors.surfaceSecondary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  editBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  memberStatus: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
