/**
 * Onboarding Stack Layout
 * Default route is add-baby (baby setup screen)
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="add-baby"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFDF9' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="add-baby" />
    </Stack>
  );
}
