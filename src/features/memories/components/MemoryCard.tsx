/**
 * MemoryCard Component
 * Displays a single memory/achievement in the timeline
 */

import React, { useCallback, memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import type { MemoryDisplayData } from '../types';

interface MemoryCardProps {
  memory: MemoryDisplayData;
  isFirst?: boolean;
  isLast?: boolean;
}

function MemoryCardComponent({ memory, isFirst, isLast }: MemoryCardProps) {
  const handleShare = useCallback(async () => {
    try {
      const message = memory.notes
        ? `${memory.title}\n\n${memory.notes}\n\nAchieved: ${memory.formattedDate}`
        : `${memory.title}\n\nAchieved: ${memory.formattedDate}`;

      await Share.share({
        message,
        title: memory.title,
      });
    } catch {
      // User cancelled or error occurred
    }
  }, [memory]);

  return (
    <View style={styles.container}>
      {/* Timeline connector */}
      <View style={styles.timelineColumn}>
        {/* Continuous line behind everything */}
        <View style={[
          styles.timelineLine,
          isFirst && styles.timelineLineFirst,
          isLast && styles.timelineLineLast,
        ]} />
        
        {/* Timeline dot - positioned on top of line */}
        <View style={styles.timelineDotContainer}>
          <View style={styles.timelineDot} />
        </View>
      </View>

      {/* Content column */}
      <View style={styles.contentColumn}>
        {/* Date label */}
        <Text style={styles.dateLabel}>{memory.formattedDate}</Text>

        {/* Card */}
        <View style={styles.card}>
          {/* Card header with title and share button */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {memory.title}
            </Text>
            <Pressable
              style={styles.shareButton}
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="share-outline"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Photo if available */}
          {memory.photoUri && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: memory.photoUri }}
                style={styles.photo}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Notes/description */}
          {memory.notes ? (
            <Text style={styles.notes}>{memory.notes}</Text>
          ) : (
            <Text style={styles.description}>{memory.description}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

// Wrap with React.memo for performance in lists
export const MemoryCard = memo(MemoryCardComponent);

const TIMELINE_DOT_SIZE = 16;
const TIMELINE_LINE_WIDTH = 3;
const TIMELINE_COLUMN_WIDTH = 40;
const DATE_ROW_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineColumn: {
    width: TIMELINE_COLUMN_WIDTH,
    alignItems: 'center',
  },
  timelineLine: {
    position: 'absolute',
    left: (TIMELINE_COLUMN_WIDTH - TIMELINE_LINE_WIDTH) / 2,
    top: 0,
    bottom: -spacing.lg,
    width: TIMELINE_LINE_WIDTH,
    backgroundColor: colors.secondary,
  },
  timelineLineFirst: {
    top: DATE_ROW_HEIGHT / 2,
  },
  timelineLineLast: {
    bottom: 0,
  },
  timelineDotContainer: {
    height: DATE_ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDot: {
    width: TIMELINE_DOT_SIZE,
    height: TIMELINE_DOT_SIZE,
    borderRadius: TIMELINE_DOT_SIZE / 2,
    backgroundColor: colors.surface,
    borderWidth: TIMELINE_LINE_WIDTH,
    borderColor: colors.secondary,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
    height: DATE_ROW_HEIGHT,
    lineHeight: DATE_ROW_HEIGHT,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  photoContainer: {
    marginBottom: spacing.sm,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: radii.md,
  },
  notes: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
