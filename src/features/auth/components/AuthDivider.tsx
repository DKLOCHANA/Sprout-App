/**
 * Auth Divider
 * Divider with "OR WITH EMAIL" text for auth screens
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { Divider } from '@shared/components/ui';

interface AuthDividerProps {
  text?: string;
  style?: ViewStyle;
}

export function AuthDivider({ text = 'OR WITH EMAIL', style }: AuthDividerProps) {
  return <Divider text={text} style={style} />;
}
