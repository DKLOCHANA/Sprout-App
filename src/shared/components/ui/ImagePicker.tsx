/**
 * ImagePicker Component
 * Circular image picker for profile photos
 * Shows photo or initial placeholder
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { colors, spacing, radii, typography } from '@/core/theme';

interface ImagePickerProps {
  imageUri: string | null;
  onImageChange: (uri: string | null) => void;
  name?: string;
  size?: number;
  label?: string;
}

export function ImagePicker({
  imageUri,
  onImageChange,
  name = '',
  size = 120,
  label = 'ADD PHOTO',
}: ImagePickerProps) {
  const initial = name.charAt(0).toUpperCase() || '?';

  const handlePickImage = useCallback(async () => {
    // Show action sheet
    Alert.alert('Add Photo', 'Choose how to add a photo', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to take photos.');
            return;
          }
          const result = await ExpoImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            onImageChange(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library permission is required to select photos.');
            return;
          }
          const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            onImageChange(result.assets[0].uri);
          }
        },
      },
      ...(imageUri
        ? [
            {
              text: 'Remove Photo',
              style: 'destructive' as const,
              onPress: () => onImageChange(null),
            },
          ]
        : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }, [imageUri, onImageChange]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable
        style={({ pressed }) => [
          styles.picker,
          { width: size, height: size, borderRadius: size / 2 },
          pressed && styles.pickerPressed,
        ]}
        onPress={handlePickImage}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={colors.textOnPrimary} />
            </View>
          </>
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color={colors.textOnPrimary} />
            </View>
          </View>
        )}
      </Pressable>
      
      <Text style={styles.hint}>Tap to {imageUri ? 'change' : 'add'} photo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.inputLabel,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  picker: {
    position: 'relative',
  },
  pickerPressed: {
    opacity: 0.8,
  },
  image: {
    contentFit: 'cover',
  },
  placeholder: {
    backgroundColor: colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  initial: {
    fontWeight: '700',
    color: colors.secondary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
