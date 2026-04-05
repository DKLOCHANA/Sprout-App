/**
 * Auth Stack Layout
 * Handles navigation between auth screens (login, register)
 * Login is the default/initial screen
 */

import { Stack } from 'expo-router';
import { colors } from '@core/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
