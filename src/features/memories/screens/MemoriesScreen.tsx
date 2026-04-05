/**
 * MemoriesScreen
 * Memory Lane - A chronological timeline of achieved milestones
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '@/core/theme';
import { EmptyState } from '@/shared/components';
import { MemoryCard, EmptyMemories, AddMemoryModal } from '../components';
import { useMemories } from '../hooks';

export function MemoriesScreen() {
  const router = useRouter();
  const { memories, baby, babyName, hasMemories, addCustomMemory } = useMemories();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleSaveMemory = useCallback(
    (data: {
      title: string;
      description?: string;
      photoUri?: string;
      date: Date;
    }) => {
      addCustomMemory(data);
    },
    [addCustomMemory]
  );

  const handleAddBaby = useCallback(() => {
    router.push('/add-baby');
  }, [router]);

  if (!baby) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <EmptyState
          icon="camera-outline"
          title="No Child Selected"
          message="Add a child to start capturing and preserving precious memories."
          action={{
            label: 'Add Child',
            onPress: handleAddBaby,
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          !hasMemories && styles.scrollContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Memory</Text>
          <Text style={styles.titleSecondary}>Lane</Text>
        </View>

        {/* Content */}
        {hasMemories ? (
          <View style={styles.timelineContainer}>
            {memories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                isFirst={index === 0}
                isLast={index === memories.length - 1}
              />
            ))}
          </View>
        ) : (
          <EmptyMemories onAddMemory={handleOpenAddModal} />
        )}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable 
        style={styles.fab} 
        onPress={handleOpenAddModal}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', radius: 28 }}
      >
        <Ionicons name="camera" size={28} color={colors.textOnPrimary} />
      </Pressable>

      {/* Add Memory Modal */}
      <AddMemoryModal
        visible={showAddModal}
        onClose={handleCloseAddModal}
        onSave={handleSaveMemory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  titleSecondary: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    color: colors.secondary,
  },
  timelineContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm
  },
  bottomPadding: {
    height: spacing['2xl'],
  },
  fab: {
    position: 'absolute',
    bottom: spacing['2xl'],
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});
