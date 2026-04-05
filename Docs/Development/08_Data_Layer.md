# 08 — Data Layer

← [07_Security](./07_Security.md) | Next → [09_Features](./09_Features.md)

---

## Data Storage Strategy

Sprout uses a **local-first architecture** for MVP:

| Data Type | Storage | Persistence |
|---|---|---|
| User Auth | Firebase Auth + SecureStore | Persistent |
| Baby Profiles | AsyncStorage (Zustand) | Persistent |
| Growth Entries | AsyncStorage (Zustand) | Persistent |
| Milestones | AsyncStorage (Zustand) | Persistent |
| Activities | AsyncStorage (Zustand) | Persistent |
| Photos | Local File System | Persistent |
| UI State | Zustand (in-memory) | Session only |

---

## AsyncStorage Structure

Each Zustand store persists to a separate AsyncStorage key.

```typescript
// Storage Key → Data Shape

'auth-storage' → {
  user: { id, email, displayName, photoURL } | null,
  isAuthenticated: boolean,
  hasCompletedOnboarding: boolean,
}

'baby-storage' → {
  babies: Baby[],
  selectedBabyId: string | null,
}

'growth-storage' → {
  entries: GrowthEntry[],
}

'milestone-storage' → {
  completions: MilestoneCompletion[],
}

'activity-storage' → {
  activities: Activity[],
}

'photo-storage' → {
  photos: Photo[],
}
```

---

## Data Types

### Baby Profile

```typescript
interface Baby {
  id: string;
  name: string;
  birthDate: string;              // ISO 8601: "2024-01-15"
  gender: 'male' | 'female' | 'other';
  photoUri: string | null;        // Local file path
  createdAt: string;              // ISO 8601 with time
  updatedAt: string;
}
```

### Growth Entry

```typescript
interface GrowthEntry {
  id: string;
  babyId: string;
  date: string;                   // ISO 8601: "2024-03-20"
  heightCm: number | null;        // Height in centimeters
  weightKg: number | null;        // Weight in kilograms
  headCircumferenceCm: number | null;
  notes: string;
  createdAt: string;
}
```

### Milestone Completion

```typescript
type MilestoneCategory = 'motor' | 'cognitive' | 'social' | 'language';

interface MilestoneCompletion {
  id: string;
  babyId: string;
  milestoneId: string;            // Reference to predefined milestone
  completedAt: string;            // ISO 8601 with time
  photoUri: string | null;
  notes: string;
}

// Predefined milestone structure (static data)
interface Milestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  description: string;
  ageRangeMonths: {
    min: number;
    max: number;
  };
}
```

### Activity Log

```typescript
type ActivityType = 'feeding' | 'sleep' | 'diaper';
type FeedingType = 'breast' | 'bottle' | 'solid';
type DiaperType = 'wet' | 'dirty' | 'both';

interface BaseActivity {
  id: string;
  babyId: string;
  type: ActivityType;
  startTime: string;              // ISO 8601 with time
  notes: string;
  createdAt: string;
}

interface FeedingActivity extends BaseActivity {
  type: 'feeding';
  feedingType: FeedingType;
  durationMinutes: number | null;
  amountMl: number | null;
  side: 'left' | 'right' | 'both' | null;  // For breastfeeding
}

interface SleepActivity extends BaseActivity {
  type: 'sleep';
  endTime: string | null;
  durationMinutes: number | null;
  quality: 'good' | 'fair' | 'poor' | null;
}

interface DiaperActivity extends BaseActivity {
  type: 'diaper';
  diaperType: DiaperType;
}

type Activity = FeedingActivity | SleepActivity | DiaperActivity;
```

### Photo

```typescript
interface Photo {
  id: string;
  babyId: string;
  uri: string;                    // Local file path
  caption: string;
  takenAt: string;                // ISO 8601 with time
  milestoneId: string | null;     // Optional link to milestone
  createdAt: string;
}
```

---

## Predefined Milestone Data

Static data embedded in the app. Located at `src/features/milestones/data/milestoneData.ts`.

```typescript
export const MILESTONES: Milestone[] = [
  // Motor Skills (0-3 months)
  {
    id: 'motor-001',
    category: 'motor',
    title: 'Lifts head briefly',
    description: 'Can lift head while on tummy',
    ageRangeMonths: { min: 0, max: 3 },
  },
  {
    id: 'motor-002',
    category: 'motor',
    title: 'Holds head steady',
    description: 'Holds head steady without support',
    ageRangeMonths: { min: 2, max: 4 },
  },
  // ... more milestones
  
  // Cognitive Skills
  {
    id: 'cognitive-001',
    category: 'cognitive',
    title: 'Follows moving objects',
    description: 'Follows moving objects with eyes',
    ageRangeMonths: { min: 1, max: 3 },
  },
  
  // Social Skills
  {
    id: 'social-001',
    category: 'social',
    title: 'First social smile',
    description: 'Smiles in response to interaction',
    ageRangeMonths: { min: 1, max: 2 },
  },
  
  // Language Skills
  {
    id: 'language-001',
    category: 'language',
    title: 'Coos and gurgles',
    description: 'Makes cooing sounds',
    ageRangeMonths: { min: 1, max: 4 },
  },
];

// Helper functions
export function getMilestonesByCategory(category: MilestoneCategory): Milestone[] {
  return MILESTONES.filter(m => m.category === category);
}

export function getMilestonesForAge(ageMonths: number): Milestone[] {
  return MILESTONES.filter(
    m => ageMonths >= m.ageRangeMonths.min && ageMonths <= m.ageRangeMonths.max
  );
}

export function getMilestoneById(id: string): Milestone | undefined {
  return MILESTONES.find(m => m.id === id);
}
```

---

## Firebase Auth Integration

Firebase Auth is used only for authentication, not for data storage.

```typescript
// src/core/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '@/core/config/env';

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

let app: any;
let auth: any;

export function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return { app, auth };
}

export { auth };
```

---

## Data Cleanup on Account Deletion

When user deletes their account, all local data must be cleared:

```typescript
// src/features/settings/hooks/useSettingsViewModel.ts

async function deleteAccount() {
  try {
    // 1. Delete Firebase Auth account
    const user = auth.currentUser;
    if (user) {
      await user.delete();
    }
    
    // 2. Clear all local storage
    await AsyncStorage.multiRemove([
      'baby-storage',
      'growth-storage',
      'milestone-storage',
      'activity-storage',
      'photo-storage',
    ]);
    
    // 3. Delete all local photos
    const photosDir = `${FileSystem.documentDirectory}photos/`;
    const dirInfo = await FileSystem.getInfoAsync(photosDir);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(photosDir, { idempotent: true });
    }
    
    // 4. Clear auth state (SecureStore)
    await SecureStoreService.clearAll();
    
    // 5. Reset Zustand stores
    useAuthStore.getState().clearUser();
    useBabyStore.getState().reset();
    useGrowthStore.getState().reset();
    useMilestoneStore.getState().reset();
    useActivityStore.getState().reset();
    usePhotoStore.getState().reset();
    
    // 6. Navigate to welcome screen
    router.replace('/(auth)/welcome');
    
  } catch (error) {
    // Handle re-auth requirement for Firebase
    if (error.code === 'auth/requires-recent-login') {
      // Show re-auth modal
      setShowReauthModal(true);
    } else {
      throw error;
    }
  }
}
```

---

## Data Export (Future Feature)

MVP does not include data export, but the structure supports it:

```typescript
// Future: Export all data as JSON
async function exportAllData(babyId: string) {
  const baby = useBabyStore.getState().babies.find(b => b.id === babyId);
  const growthEntries = useGrowthStore.getState().getEntriesForBaby(babyId);
  const milestones = useMilestoneStore.getState().getCompletionsForBaby(babyId);
  const activities = useActivityStore.getState().getActivitiesForBaby(babyId);
  const photos = usePhotoStore.getState().getPhotosForBaby(babyId);
  
  return {
    exportedAt: new Date().toISOString(),
    baby,
    growthEntries,
    milestones,
    activities,
    photoCount: photos.length,  // Photos would need separate handling
  };
}
```
