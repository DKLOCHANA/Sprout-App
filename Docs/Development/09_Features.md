# 09 — Features

← [08_Data_Layer](./08_Data_Layer.md) | Next → [10_Screens](./10_Screens.md)

---

## Feature Modules Overview

Each feature is a self-contained module with its own components, screens, hooks, store, and types.

```
src/features/
├── auth/               # Authentication
├── onboarding/         # First-time user flow
├── baby-profile/       # Baby profile management
├── growth/             # Growth tracking & charts
├── milestones/         # Milestone tracking
├── activities/         # Activity logging
├── photos/             # Photo memories
├── dashboard/          # Home dashboard
└── settings/           # User settings
```

---

## Feature: Authentication (`auth/`)

**Purpose:** User sign-in, registration, and session management.

### Screens
| Screen | Route | Description |
|---|---|---|
| WelcomeScreen | `/(auth)/welcome` | App introduction with sign-in options |
| LoginScreen | `/(auth)/login` | Email/password login |
| RegisterScreen | `/(auth)/register` | New account registration |

### Components
- `AppleSignInButton` — Native Apple Sign In
- `GoogleSignInButton` — Google Sign In
- `AuthFormDivider` — "or" divider between auth methods

### Hooks
- `useLoginViewModel` — Login form state and submission
- `useRegisterViewModel` — Registration form state and validation

### Store
- `authStore` — User session, authentication status, onboarding flag

---

## Feature: Onboarding (`onboarding/`)

**Purpose:** First-time user experience and initial setup.

### Screens
| Screen | Route | Description |
|---|---|---|
| OnboardingScreen | `/(onboarding)` | Welcome slides explaining app features |
| AddFirstBabyScreen | `/(onboarding)/add-baby` | Add first baby profile |

### Components
- `OnboardingSlide` — Individual slide with image and text
- `SlideIndicator` — Dot indicators for slide position

### Hooks
- `useOnboardingViewModel` — Slide navigation, completion tracking

### Data
- `onboardingSlides.ts` — Slide content (title, description, image)

---

## Feature: Baby Profile (`baby-profile/`)

**Purpose:** Manage baby profiles (add, edit, view, delete).

### Screens
| Screen | Route | Description |
|---|---|---|
| BabyListScreen | `/(app)/babies` | Grid/list of baby profiles |
| BabyDetailScreen | `/(app)/babies/[id]` | View/edit baby details |
| AddBabyScreen | `/(app)/babies/add` | Add new baby form |

### Components
- `BabyCard` — Baby profile card with avatar and name
- `BabyAvatar` — Baby photo or initials avatar
- `BabyForm` — Reusable form for add/edit
- `GenderSelector` — Gender selection chips

### Hooks
- `useBabyListViewModel` — List management, selection, deletion
- `useBabyDetailViewModel` — Single baby details, editing
- `useAddBabyViewModel` — Form submission, validation

### Store
- `babyStore` — Baby profiles array, selected baby ID

### Types
```typescript
interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  photoUri: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Feature: Growth Tracking (`growth/`)

**Purpose:** Track and visualize baby's physical growth.

### Screens
| Screen | Route | Description |
|---|---|---|
| GrowthListScreen | `/(app)/growth` | List of growth entries |
| AddGrowthScreen | `/(app)/growth/add` | Add growth entry form |
| GrowthChartsScreen | `/(app)/growth/charts` | Growth charts visualization |

### Components
- `GrowthEntryCard` — Display single growth entry
- `GrowthForm` — Form for height, weight, head circumference
- `GrowthChart` — Wrapper for chart components
- `HeightChart` — Height over time line chart
- `WeightChart` — Weight over time line chart
- `HeadCircumferenceChart` — Head circumference line chart

### Hooks
- `useGrowthListViewModel` — Entries list, filtering, deletion
- `useAddGrowthViewModel` — Form state, validation, submission
- `useGrowthChartsViewModel` — Chart data preparation

### Store
- `growthStore` — Growth entries array

### Utils
- `growthCalculations.ts` — Age calculation, growth percentiles
- `percentileData.ts` — WHO growth percentile reference data

### Types
```typescript
interface GrowthEntry {
  id: string;
  babyId: string;
  date: string;
  heightCm: number | null;
  weightKg: number | null;
  headCircumferenceCm: number | null;
  notes: string;
  createdAt: string;
}
```

---

## Feature: Milestones (`milestones/`)

**Purpose:** Track developmental milestones by category.

### Screens
| Screen | Route | Description |
|---|---|---|
| MilestonesOverviewScreen | `/(app)/milestones` | Categories overview with progress |
| MilestoneCategoryScreen | `/(app)/milestones/[category]` | Milestones in specific category |

### Components
- `CategoryCard` — Category with icon and progress bar
- `MilestoneCard` — Individual milestone with checkbox
- `MilestoneCheckbox` — Checkmark with animation
- `MilestoneProgress` — Progress indicator for category

### Hooks
- `useMilestonesViewModel` — Category progress, navigation
- `useMilestoneCategoryViewModel` — Category milestones, completion toggle

### Store
- `milestoneStore` — Milestone completions array

### Data
- `milestoneData.ts` — Predefined milestones by category and age

### Types
```typescript
type MilestoneCategory = 'motor' | 'cognitive' | 'social' | 'language';

interface Milestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  description: string;
  ageRangeMonths: { min: number; max: number };
}

interface MilestoneCompletion {
  id: string;
  babyId: string;
  milestoneId: string;
  completedAt: string;
  photoUri: string | null;
  notes: string;
}
```

---

## Feature: Activities (`activities/`)

**Purpose:** Log daily activities (feeding, sleep, diaper).

### Screens
| Screen | Route | Description |
|---|---|---|
| ActivityLogScreen | `/(app)/activities` | Timeline of activities |
| AddActivityScreen | `/(app)/activities/add` | Add activity form |

### Components
- `ActivityCard` — Display single activity entry
- `ActivityTimeline` — Timeline view of activities
- `ActivityTypeSelector` — Tabs for feeding/sleep/diaper
- `FeedingForm` — Feeding-specific form fields
- `SleepForm` — Sleep-specific form fields
- `DiaperForm` — Diaper-specific form fields

### Hooks
- `useActivityLogViewModel` — Activities list, filtering by type/date
- `useAddActivityViewModel` — Form state, type switching, submission

### Store
- `activityStore` — Activities array

### Types
```typescript
type ActivityType = 'feeding' | 'sleep' | 'diaper';

interface FeedingActivity {
  type: 'feeding';
  feedingType: 'breast' | 'bottle' | 'solid';
  durationMinutes: number | null;
  amountMl: number | null;
  side: 'left' | 'right' | 'both' | null;
}

interface SleepActivity {
  type: 'sleep';
  endTime: string | null;
  durationMinutes: number | null;
  quality: 'good' | 'fair' | 'poor' | null;
}

interface DiaperActivity {
  type: 'diaper';
  diaperType: 'wet' | 'dirty' | 'both';
}
```

---

## Feature: Photos (`photos/`)

**Purpose:** Capture and organize milestone memories.

### Screens
| Screen | Route | Description |
|---|---|---|
| PhotoGalleryScreen | `/(app)/photos` | Photo grid gallery |
| AddPhotoScreen | `/(app)/photos/add` | Capture/select and add photo |

### Components
- `PhotoCard` — Photo thumbnail with caption
- `PhotoGrid` — Grid layout for photos
- `PhotoViewer` — Full-screen photo view

### Hooks
- `usePhotoGalleryViewModel` — Photos list, filtering, deletion
- `useAddPhotoViewModel` — Image picker, caption, milestone linking

### Store
- `photoStore` — Photos array

### Types
```typescript
interface Photo {
  id: string;
  babyId: string;
  uri: string;
  caption: string;
  takenAt: string;
  milestoneId: string | null;
  createdAt: string;
}
```

---

## Feature: Dashboard (`dashboard/`)

**Purpose:** Home screen with overview and quick actions.

### Screens
| Screen | Route | Description |
|---|---|---|
| DashboardScreen | `/(app)` | Main home screen |

### Components
- `BabySummaryCard` — Selected baby overview with age
- `QuickActionsBar` — Quick action buttons (add growth, activity, photo)
- `RecentActivityCard` — Recent activities summary
- `GrowthSummaryWidget` — Latest growth measurements
- `MilestoneProgressWidget` — Overall milestone progress
- `UpcomingMilestonesCard` — Age-appropriate milestones to track

### Hooks
- `useDashboardViewModel` — Aggregated data for all widgets

---

## Feature: Settings (`settings/`)

**Purpose:** User preferences and account management.

### Screens
| Screen | Route | Description |
|---|---|---|
| SettingsScreen | `/(app)/profile` | Settings and account |

### Components
- `SettingsGroup` — Grouped settings section
- `SettingsRow` — Individual setting row
- `DeleteAccountSheet` — Account deletion confirmation

### Hooks
- `useSettingsViewModel` — Settings management, logout, account deletion

### Types
```typescript
interface Settings {
  units: 'metric' | 'imperial';
  notifications: boolean;
}
```

---

## Feature Dependencies

```
auth ← (no deps)
onboarding ← auth
baby-profile ← auth
growth ← baby-profile
milestones ← baby-profile
activities ← baby-profile
photos ← baby-profile, milestones (optional)
dashboard ← baby-profile, growth, milestones, activities
settings ← auth, baby-profile
```
