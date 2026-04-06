/**
 * Responsive Auth Hook
 * Provides responsive sizing values for authentication screens
 * Ensures all content fits on screen without scrolling
 */

import { useWindowDimensions } from 'react-native';
import { spacing, typography } from '@core/theme';

export interface ResponsiveAuthStyles {
  // Container padding
  containerPadding: number;
  // Logo sizing
  logoSize: number;
  // Typography
  headlineFontSize: number;
  headlineLineHeight: number;
  subheadlineFontSize: number;
  subheadlineLineHeight: number;
  // Section spacing
  logoVerticalPadding: number;
  headerVerticalPadding: number;
  formTopPadding: number;
  sectionSpacing: number;
  // Input sizing
  inputHeight: number;
  inputSpacing: number;
  // Button sizing
  buttonHeight: number;
  // Screen info
  isCompactScreen: boolean;
  screenHeight: number;
  screenWidth: number;
}

/**
 * Hook that calculates responsive values based on screen dimensions
 * Optimized to fit auth content without scrolling
 */
export function useResponsiveAuth(): ResponsiveAuthStyles {
  const { width, height } = useWindowDimensions();

  // Screen size breakpoints based on common device heights
  // Small phones: iPhone SE, iPhone 8 (~667px)
  // Medium phones: iPhone 12/13/14 (~844px)
  // Large phones: iPhone Pro Max (~932px)
  const isCompactScreen = height < 700;
  const isSmallScreen = height < 750;
  const isMediumScreen = height >= 750 && height < 850;

  // Calculate responsive values based on screen height
  // Using proportional scaling to ensure content fits

  // Container padding - tighter on smaller screens
  const containerPadding = isCompactScreen
    ? spacing.md
    : isSmallScreen
    ? spacing.lg - spacing.xs
    : spacing.lg;

  // Logo size - scales with screen
  const logoSize = isCompactScreen ? 22 : isSmallScreen ? 24 : 28;

  // Typography scaling
  const headlineFontSize = isCompactScreen
    ? typography.h2.fontSize
    : isSmallScreen
    ? typography.h2.fontSize + 4
    : typography.h1.fontSize;

  const headlineLineHeight = isCompactScreen
    ? typography.h2.lineHeight
    : isSmallScreen
    ? typography.h2.lineHeight + 4
    : typography.h1.lineHeight;

  const subheadlineFontSize = isCompactScreen
    ? typography.bodySmall.fontSize
    : typography.body.fontSize;

  const subheadlineLineHeight = isCompactScreen
    ? typography.bodySmall.lineHeight
    : typography.body.lineHeight;

  // Section spacing - reduces on smaller screens
  const logoVerticalPadding = isCompactScreen
    ? spacing.sm
    : isSmallScreen
    ? spacing.md
    : spacing.lg;

  const headerVerticalPadding = isCompactScreen
    ? spacing.sm
    : isSmallScreen
    ? spacing.md
    : spacing.lg;

  const formTopPadding = isCompactScreen ? spacing.xs : spacing.md;

  const sectionSpacing = isCompactScreen
    ? spacing.sm
    : isSmallScreen
    ? spacing.md
    : spacing.lg;

  // Input sizing - slightly smaller on compact screens
  const inputHeight = isCompactScreen ? 44 : 52;
  const inputSpacing = isCompactScreen ? spacing.sm : spacing.md;

  // Button sizing
  const buttonHeight = isCompactScreen ? 44 : 52;

  return {
    containerPadding,
    logoSize,
    headlineFontSize,
    headlineLineHeight,
    subheadlineFontSize,
    subheadlineLineHeight,
    logoVerticalPadding,
    headerVerticalPadding,
    formTopPadding,
    sectionSpacing,
    inputHeight,
    inputSpacing,
    buttonHeight,
    isCompactScreen,
    screenHeight: height,
    screenWidth: width,
  };
}
