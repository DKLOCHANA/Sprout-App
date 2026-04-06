/**
 * Onboarding Stack Layout
 * Handles onboarding survey flow and baby setup
 */

import { Stack } from 'expo-router';
import { colors } from '@core/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="add-baby" />
    </Stack>
  );
}
