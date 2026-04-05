/**
 * AgeFilterDropdown
 * Dropdown for filtering milestones by age range
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '@/core/theme';
import type { AgeFilterType } from '../types';

interface AgeFilterOption {
  label: string;
  value: AgeFilterType;
}

interface AgeFilterDropdownProps {
  selectedFilter: AgeFilterType;
  options: AgeFilterOption[];
  onSelectFilter: (filter: AgeFilterType) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function AgeFilterDropdown({
  selectedFilter,
  options,
  onSelectFilter,
  searchQuery = '',
  onSearchChange,
}: AgeFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { width } = useWindowDimensions();

  const selectedOption = options.find((opt) => opt.value === selectedFilter);

  const handleSelect = (value: AgeFilterType) => {
    onSelectFilter(value);
    setIsOpen(false);
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      // Clear search when closing
      onSearchChange?.('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <View style={styles.container}>
      {isSearchOpen ? (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search milestones..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            autoFocus
            returnKeyType="search"
          />
          <Pressable onPress={handleSearchToggle} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.filterRow}>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setIsOpen(true)}
          >
            <View style={styles.dropdownContent}>
              <Text style={styles.filterLabel}>FILTER BY AGE</Text>
              <Text style={styles.filterValue}>
                {selectedOption?.label || 'Select age range'}
              </Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={24}
              color={colors.secondary}
            />
          </Pressable>
          
          <Pressable
            style={styles.searchButton}
            onPress={handleSearchToggle}
          >
            <Ionicons name="search" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.dropdownMenu, { width: width - spacing.lg * 2 }]}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.dropdownItem,
                  option.value === selectedFilter && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    option.value === selectedFilter && styles.dropdownItemTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === selectedFilter && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.secondary}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.lg,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.lg,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  dropdownContent: {
    flex: 1,
  },
  filterLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs / 2,
  },
  filterValue: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primaryDim,
  },
  dropdownItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: colors.secondary,
  },
});
