# 04 — Navigation Architecture

← [03_State_Management](./03_State_Management.md) | Next → [05_Theme_System](./05_Theme_System.md)

---

## Route Structure (Expo Router)

```
/                           Root layout — providers, Firebase init, fonts, splash
  /(auth)                   Stack — unauthenticated (no tab bar)
    /welcome                Landing / hero screen
    /login                  Login form
    /register               Registration form
  /(onboarding)             Stack — first-time user (no tab bar)
    /                       Welcome slides
    /add-baby               Add first baby profile
  /(app)                    Tabs — authenticated (navigation guard here)
    /                       Tab 1 — Dashboard (Home)
    /babies                 Tab 2 — Baby Profiles
      /[id]                 Baby detail/edit screen
      /add                  Add new baby
    /growth                 Tab 3 — Growth Tracking
      /add                  Add growth entry
      /charts               Growth charts view
    /milestones             Tab 4 — Milestones
      /[category]           Milestone category detail
    /activities             Tab 5 — Activity Log
      /add                  Add activity (feeding/sleep/diaper)
    /photos                 Gallery (accessible from dashboard/baby detail)
      /add                  Add photo
    /profile                Settings (accessible from tab bar or dashboard)
```

---

## Root Layout (`app/_layout.tsx`)

The composition root of the entire app. Everything that needs to be initialized once lives here.

```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { useAuthStore } from '@/features/auth/store/authStore';
import { ScreenErrorBoundary } from '@/core/errors/errorBoundary';
import { initializeFirebase } from '@/core/firebase/config';

// Keep splash screen visible until ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });
  const { isHydrated } = useAuthStore();

  useEffect(() => {
    initializeFirebase();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrated]);

  if (!fontsLoaded || !isHydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ScreenErrorBoundary>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </ScreenErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## Navigation Guard (`app/(app)/_layout.tsx`)

Protects all authenticated routes. Reads from `authStore` and redirects if not authenticated or onboarding not complete.

```typescript
import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { theme } from '@/core/theme';
import { TabBarIcon } from '@/shared/components/common/TabBarIcon';

export default function AppLayout() {
  const { isAuthenticated, isHydrated, hasCompletedOnboarding } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.replace('/(auth)/welcome');
      return;
    }
    
    if (!hasCompletedOnboarding) {
      router.replace('/(onboarding)');
      return;
    }
  }, [isAuthenticated, isHydrated, hasCompletedOnboarding]);

  // While hydrating — render nothing (splash screen is still visible at root)
  if (!isHydrated) return null;

  // Not authenticated or onboarding incomplete — redirect is in flight
  if (!isAuthenticated || !hasCompletedOnboarding) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="babies"
        options={{
          title: 'Babies',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="baby" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="growth"
        options={{
          title: 'Growth',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="chart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          title: 'Milestones',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="star" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="clock" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## Auth Stack (`app/(auth)/_layout.tsx`)

Simple stack with no tab bar. Slides left-to-right between welcome → login → register.

```typescript
import { Stack } from 'expo-router';
import { theme } from '@/core/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.backgroundPrimary },
        animation: 'slide_from_right',
      }}
    />
  );
}
```

---

## Onboarding Stack (`app/(onboarding)/_layout.tsx`)

First-time user flow after authentication.

```typescript
import { Stack } from 'expo-router';
import { theme } from '@/core/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.backgroundPrimary },
        animation: 'slide_from_right',
      }}
    />
  );
}
```

---

## Navigation Patterns

### After Successful Login (First Time)
```typescript
// User authenticated but hasn't completed onboarding
router.replace('/(onboarding)');
```

### After Successful Login (Returning User)
```typescript
// User authenticated and has completed onboarding
router.replace('/(app)');
```

### After Onboarding Complete
```typescript
// After adding first baby
authStore.setOnboardingComplete();
router.replace('/(app)');
```

### After Logout / Account Deletion
```typescript
// Clear state first, then navigate
authStore.clearUser();
await SecureStoreService.clearAll();
router.replace('/(auth)/welcome');
```

### Deep Linking Within App
```typescript
// From Dashboard to Baby Detail
router.push(`/babies/${baby.id}`);

// From Baby Detail to Add Growth Entry
router.push('/growth/add');

// From Milestones Overview to Category Detail
router.push(`/milestones/${category}`);
```

---

## Tab-based Navigation

The main app uses a bottom tab bar with 5 tabs:

| Tab | Route | Icon | Screen |
|---|---|---|---|
| Home | `/(app)` | home | Dashboard |
| Babies | `/(app)/babies` | baby-face | Baby Profiles List |
| Growth | `/(app)/growth` | chart-line | Growth Entries |
| Milestones | `/(app)/milestones` | star | Milestone Categories |
| Activity | `/(app)/activities` | clock | Activity Log |

Profile/Settings is accessible from the Dashboard screen header, not as a separate tab.
