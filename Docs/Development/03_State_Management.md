# 03 — State Management

← [02_Tech_Stack](./02_Tech_Stack.md) | Next → [04_Navigation](./04_Navigation.md)

---

## State Management Strategy

| State Type | Tool | What it holds |
|---|---|---|
| Auth state | Zustand + SecureStore | User session, tokens |
| App data | Zustand + AsyncStorage | Babies, growth, milestones, activities, photos |
| UI state | Zustand (in-memory) | Loading states, modals, form drafts |

**Rule:** All persistent data uses Zustand stores with AsyncStorage persistence. Sensitive auth tokens use SecureStore.

---

## Zustand Stores Overview

```
src/features/
├── auth/store/authStore.ts           # User authentication state
├── baby-profile/store/babyStore.ts   # Baby profiles
├── growth/store/growthStore.ts       # Growth entries
├── milestones/store/milestoneStore.ts # Milestone completions
├── activities/store/activityStore.ts # Activity logs
└── photos/store/photoStore.ts        # Photo memories
```

---

## `authStore.ts` — Authentication State

Persisted to SecureStore via a custom storage adapter. Drives the navigation guard.

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setOnboardingComplete: () => void;
}

const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      hasCompletedOnboarding: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        hasCompletedOnboarding: false
      }),
      
      setOnboardingComplete: () => set({ 
        hasCompletedOnboarding: true 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    }
  )
);
```

---

## `babyStore.ts` — Baby Profiles

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Baby {
  id: string;
  name: string;
  birthDate: string;          // ISO date string
  gender: 'male' | 'female' | 'other';
  photoUri: string | null;    // Local file path
  createdAt: string;
  updatedAt: string;
}

interface BabyState {
  babies: Baby[];
  selectedBabyId: string | null;
  
  addBaby: (baby: Omit<Baby, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBaby: (id: string, updates: Partial<Baby>) => void;
  deleteBaby: (id: string) => void;
  selectBaby: (id: string) => void;
  getSelectedBaby: () => Baby | null;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      babies: [],
      selectedBabyId: null,
      
      addBaby: (babyData) => {
        const baby: Baby = {
          ...babyData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ 
          babies: [...state.babies, baby],
          selectedBabyId: state.selectedBabyId ?? baby.id,
        }));
      },
      
      updateBaby: (id, updates) => {
        set((state) => ({
          babies: state.babies.map((baby) =>
            baby.id === id
              ? { ...baby, ...updates, updatedAt: new Date().toISOString() }
              : baby
          ),
        }));
      },
      
      deleteBaby: (id) => {
        set((state) => {
          const newBabies = state.babies.filter((baby) => baby.id !== id);
          return {
            babies: newBabies,
            selectedBabyId: state.selectedBabyId === id 
              ? newBabies[0]?.id ?? null 
              : state.selectedBabyId,
          };
        });
      },
      
      selectBaby: (id) => set({ selectedBabyId: id }),
      
      getSelectedBaby: () => {
        const state = get();
        return state.babies.find((b) => b.id === state.selectedBabyId) ?? null;
      },
    }),
    {
      name: 'baby-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## `growthStore.ts` — Growth Entries

```typescript
interface GrowthEntry {
  id: string;
  babyId: string;
  date: string;               // ISO date string
  heightCm: number | null;    // Height in centimeters
  weightKg: number | null;    // Weight in kilograms
  headCircumferenceCm: number | null;
  notes: string;
  createdAt: string;
}

interface GrowthState {
  entries: GrowthEntry[];
  
  addEntry: (entry: Omit<GrowthEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, updates: Partial<GrowthEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesForBaby: (babyId: string) => GrowthEntry[];
  getLatestEntry: (babyId: string) => GrowthEntry | null;
}
```

---

## `milestoneStore.ts` — Milestone Completions

```typescript
type MilestoneCategory = 'motor' | 'cognitive' | 'social' | 'language';

interface MilestoneCompletion {
  id: string;
  babyId: string;
  milestoneId: string;        // Reference to predefined milestone
  completedAt: string;
  photoUri: string | null;
  notes: string;
}

interface MilestoneState {
  completions: MilestoneCompletion[];
  
  markComplete: (babyId: string, milestoneId: string, photoUri?: string, notes?: string) => void;
  unmarkComplete: (babyId: string, milestoneId: string) => void;
  isCompleted: (babyId: string, milestoneId: string) => boolean;
  getCompletionsForBaby: (babyId: string) => MilestoneCompletion[];
  getCompletionsByCategory: (babyId: string, category: MilestoneCategory) => MilestoneCompletion[];
}
```

---

## `activityStore.ts` — Activity Logs

```typescript
type ActivityType = 'feeding' | 'sleep' | 'diaper';
type FeedingType = 'breast' | 'bottle' | 'solid';
type DiaperType = 'wet' | 'dirty' | 'both';

interface BaseActivity {
  id: string;
  babyId: string;
  type: ActivityType;
  startTime: string;
  notes: string;
  createdAt: string;
}

interface FeedingActivity extends BaseActivity {
  type: 'feeding';
  feedingType: FeedingType;
  durationMinutes: number | null;  // For breast/bottle
  amountMl: number | null;         // For bottle
}

interface SleepActivity extends BaseActivity {
  type: 'sleep';
  endTime: string | null;
  durationMinutes: number | null;
}

interface DiaperActivity extends BaseActivity {
  type: 'diaper';
  diaperType: DiaperType;
}

type Activity = FeedingActivity | SleepActivity | DiaperActivity;

interface ActivityState {
  activities: Activity[];
  
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  getActivitiesForBaby: (babyId: string) => Activity[];
  getActivitiesByDate: (babyId: string, date: string) => Activity[];
  getLastActivity: (babyId: string, type: ActivityType) => Activity | null;
}
```

---

## `photoStore.ts` — Photo Memories

```typescript
interface Photo {
  id: string;
  babyId: string;
  uri: string;                // Local file path
  caption: string;
  takenAt: string;            // ISO date string
  milestoneId: string | null; // Optional link to milestone
  createdAt: string;
}

interface PhotoState {
  photos: Photo[];
  
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  getPhotosForBaby: (babyId: string) => Photo[];
  getPhotosByMonth: (babyId: string, year: number, month: number) => Photo[];
}
```

---

## Storage Keys (`src/core/storage/storageKeys.ts`)

Centralized storage key management prevents collisions.

```typescript
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  BABIES: 'baby-storage',
  GROWTH: 'growth-storage',
  MILESTONES: 'milestone-storage',
  ACTIVITIES: 'activity-storage',
  PHOTOS: 'photo-storage',
  SETTINGS: 'settings-storage',
} as const;
```

---

## Data Relationships

```
User (Firebase Auth)
  └── Baby[] (AsyncStorage)
        ├── GrowthEntry[]
        ├── MilestoneCompletion[]
        ├── Activity[]
        └── Photo[]
```

All data is scoped to the authenticated user. When a user logs out, all local data remains on device (offline-first). A future cloud sync feature could backup/restore this data.

---

## Hooks Pattern

View-models **never** access stores directly. All store usage is wrapped in custom hooks:

```typescript
// src/features/baby-profile/hooks/useBabyListViewModel.ts
export function useBabyListViewModel() {
  const babies = useBabyStore((state) => state.babies);
  const selectedBabyId = useBabyStore((state) => state.selectedBabyId);
  const selectBaby = useBabyStore((state) => state.selectBaby);
  const deleteBaby = useBabyStore((state) => state.deleteBaby);
  
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  const handleDelete = useCallback(() => {
    if (pendingDeleteId) {
      deleteBaby(pendingDeleteId);
      setDeleteConfirmVisible(false);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, deleteBaby]);
  
  return {
    babies,
    selectedBabyId,
    isDeleteConfirmVisible,
    selectBaby,
    confirmDelete: (id: string) => {
      setPendingDeleteId(id);
      setDeleteConfirmVisible(true);
    },
    cancelDelete: () => {
      setDeleteConfirmVisible(false);
      setPendingDeleteId(null);
    },
    executeDelete: handleDelete,
  };
}
```
