/**
 * Typography Component
 * Consistent text styling throughout the app
 * 
 * Usage:
 *   <Typography variant="h1">Title</Typography>
 *   <Typography variant="body" color="textSecondary">Description</Typography>
 */

import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { typography, colors, type TypographyKey, type ColorKey } from '@/core/theme';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  /** Typography variant from theme */
  variant?: TypographyKey;
  /** Color from theme colors */
  color?: ColorKey;
  /** Additional font weight override */
  weight?: '400' | '500' | '600' | '700';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Allow style overrides */
  style?: TextStyle;
  /** Children content */
  children: React.ReactNode;
}

/**
 * Typography component for consistent text styling
 */
export function Typography({
  variant = 'body',
  color = 'textPrimary',
  weight,
  align,
  style,
  children,
  ...textProps
}: TypographyProps) {
  const variantStyle = typography[variant];
  const colorValue = colors[color];

  const combinedStyle: TextStyle = {
    ...variantStyle,
    color: colorValue,
    ...(weight && { fontWeight: weight }),
    ...(align && { textAlign: align }),
    ...style,
  };

  return (
    <Text style={combinedStyle} {...textProps}>
      {children}
    </Text>
  );
}

// Convenience components for common variants
export function H1(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h1" {...props} />;
}

export function H2(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h2" {...props} />;
}

export function H3(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="h3" {...props} />;
}

export function Body(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="body" {...props} />;
}

export function BodySmall(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="bodySmall" {...props} />;
}

export function Caption(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="caption" {...props} />;
}
