/**
 * Auth Divider
 * Divider with "OR WITH EMAIL" text for auth screens
 */

import React from 'react';
import { Divider } from '@shared/components/ui';

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = 'OR WITH EMAIL' }: AuthDividerProps) {
  return <Divider text={text} />;
}
