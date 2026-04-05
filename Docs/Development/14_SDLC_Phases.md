# 14 — SDLC Phases

← [13_Account_Deletion](./13_Account_Deletion.md) | Next → [15_Verification](./15_Verification.md)

---

## Phase Overview

| Phase | Focus | Deliverable |
|---|---|---|
| 0 — Foundation | Project scaffold, theme, UI atoms | Working skeleton app |
| 1 — Authentication | Firebase Auth, session, onboarding | Full auth flow |
| 2 — Baby Profiles | Add/edit babies, photos | Baby management complete |
| 3 — Growth Tracking | Growth entries, charts | Growth feature complete |
| 4 — Milestones | Milestone checklist, progress | Milestone feature complete |
| 5 — Activities | Feeding, sleep, diaper logs | Activity feature complete |
| 6 — Dashboard & Polish | Dashboard, photos, animations | Feature complete |
| 7 — Pre-Launch | Security, testing, submission | App Store ready |

---

## Phase 0 — Foundation

**Goal:** Project runs on simulator, navigation works, all screens render with correct design.

### Tasks

1. **Project Setup**
   - `npx create-expo-app@latest Sprout --template expo-template-blank-typescript`
   - Configure path alias `@/` → `src/`
   - Install all dependencies (see [02_Tech_Stack.md](./02_Tech_Stack.md))
   - ESLint + Prettier + Husky setup

2. **Core Infrastructure**
   - Build theme system: `colors`, `typography`, `spacing`, `radii`, `shadows`, `animations`
   - Create `src/core/` structure
   - Build `DomainError` types and error boundary

3. **UI Components**
   - Build all shared UI atoms:
     - `Button` (primary, secondary, ghost, destructive)
     - `Typography` (all variants)
     - `Input` (text, password, numeric)
     - `SoftCard` (default, elevated, outlined)
     - `Avatar` (with initials fallback)
     - `Badge`, `Chip`, `ProgressBar`
     - `Skeleton`, `Divider`, `IconButton`
   - Build common components:
     - `ScreenHeader`, `SafeScrollView`
     - `LoadingOverlay`, `ErrorBanner`
     - `EmptyState`, `ConfirmSheet`
     - `TabBarIcon`

4. **Navigation**
   - Configure Expo Router: `(auth)`, `(onboarding)`, `(app)` groups
   - Build layout files for each group
   - Navigation guard with hardcoded `isAuthenticated = false`
   - Stub all screen files with placeholder content

**Deliverable:** All screens render with correct design. Navigation between all routes works. Design system complete.

---

## Phase 1 — Authentication

**Goal:** Users can sign up, sign in, and have sessions persist across app restarts.

### Tasks

1. **Firebase Setup**
   - Create Firebase project
   - Enable Authentication (Email, Apple, Google)
   - Add `GoogleService-Info.plist` to iOS project
   - Build `firebaseConfig.ts` and `auth.ts`

2. **Auth Store**
   - `authStore.ts` with SecureStore persistence
   - `isHydrated` flag for splash control
   - `hasCompletedOnboarding` flag

3. **Auth Screens**
   - `WelcomeScreen` — static hero with auth buttons
   - `LoginScreen` — email/password form with validation
   - `RegisterScreen` — registration form with validation
   - `AppleSignInButton` via `expo-apple-authentication`
   - `GoogleSignInButton` via `@react-native-google-signin`

4. **Auth Logic**
   - `useLoginViewModel` — form state, validation, Firebase sign in
   - `useRegisterViewModel` — form state, validation, Firebase register
   - Error mapping from Firebase to `DomainError`

5. **Onboarding**
   - `OnboardingScreen` — 3 welcome slides
   - `AddFirstBabyScreen` — add baby form (basic version)
   - `useOnboardingViewModel` — slide navigation, completion

6. **Navigation Guard**
   - Update `(app)/_layout.tsx` with real auth state
   - Redirect logic for auth + onboarding states
   - Splash screen control

**Deliverable:** Full auth flow working. Apple/Google/Email sign-in on device. Sessions persist. Onboarding flow complete.

---

## Phase 2 — Baby Profiles

**Goal:** Users can add, view, edit, and delete baby profiles with photos.

### Tasks

1. **Baby Store**
   - `babyStore.ts` with AsyncStorage persistence
   - CRUD operations for babies
   - Selected baby tracking

2. **Baby Screens**
   - `BabyListScreen` — grid of baby cards
   - `BabyDetailScreen` — view/edit baby
   - `AddBabyScreen` — add baby form (full version)

3. **Baby Components**
   - `BabyCard` — profile card with avatar
   - `BabyAvatar` — photo or initials
   - `BabyForm` — reusable form component
   - `GenderSelector` — chips for gender selection

4. **Image Handling**
   - `useImagePicker` hook with `expo-image-picker`
   - Photo save to local file system
   - Photo resize for storage optimization

5. **View Models**
   - `useBabyListViewModel` — list, selection, delete
   - `useBabyDetailViewModel` — single baby, editing
   - `useAddBabyViewModel` — form validation, photo upload

**Deliverable:** Full baby profile management. Photos stored locally. Multiple babies supported.

---

## Phase 3 — Growth Tracking

**Goal:** Users can log growth entries and view growth charts.

### Tasks

1. **Growth Store**
   - `growthStore.ts` with AsyncStorage persistence
   - CRUD operations for growth entries
   - Entries linked to baby ID

2. **Growth Screens**
   - `GrowthListScreen` — list of entries for selected baby
   - `AddGrowthScreen` — add growth entry form
   - `GrowthChartsScreen` — line charts for growth data

3. **Growth Components**
   - `GrowthEntryCard` — display entry with badges
   - `GrowthForm` — height, weight, head inputs
   - `HeightChart`, `WeightChart`, `HeadCircumferenceChart`

4. **Chart Implementation**
   - Configure `react-native-chart-kit`
   - Data transformation for chart display
   - Responsive chart sizing

5. **View Models**
   - `useGrowthListViewModel` — entries, filtering
   - `useAddGrowthViewModel` — form, validation
   - `useGrowthChartsViewModel` — chart data prep

**Deliverable:** Growth logging complete. Charts display historical data. Entries linked to correct baby.

---

## Phase 4 — Milestones

**Goal:** Users can track developmental milestones by category.

### Tasks

1. **Milestone Data**
   - Create `milestoneData.ts` with predefined milestones
   - Organize by category and age range
   - Helper functions for filtering

2. **Milestone Store**
   - `milestoneStore.ts` with AsyncStorage persistence
   - Completion tracking per baby
   - Photo attachment support

3. **Milestone Screens**
   - `MilestonesOverviewScreen` — categories with progress
   - `MilestoneCategoryScreen` — milestones in category

4. **Milestone Components**
   - `CategoryCard` — category with progress bar
   - `MilestoneCard` — milestone with checkbox
   - `MilestoneCheckbox` — animated checkbox
   - `MilestoneProgress` — progress indicator

5. **View Models**
   - `useMilestonesViewModel` — category progress
   - `useMilestoneCategoryViewModel` — milestones, completion toggle

**Deliverable:** Milestone tracking complete. Progress shown by category. Age-appropriate filtering.

---

## Phase 5 — Activities

**Goal:** Users can log daily activities (feeding, sleep, diaper).

### Tasks

1. **Activity Store**
   - `activityStore.ts` with AsyncStorage persistence
   - Support for all activity types
   - Filtering by type and date

2. **Activity Screens**
   - `ActivityLogScreen` — timeline of activities
   - `AddActivityScreen` — dynamic form by type

3. **Activity Components**
   - `ActivityCard` — display activity with icon
   - `ActivityTimeline` — grouped by time of day
   - `ActivityTypeSelector` — tabs for type selection
   - `FeedingForm`, `SleepForm`, `DiaperForm`

4. **View Models**
   - `useActivityLogViewModel` — activities, filtering
   - `useAddActivityViewModel` — form state by type

**Deliverable:** Activity logging complete. All three activity types supported. Timeline display.

---

## Phase 6 — Dashboard & Polish

**Goal:** Dashboard complete, photos feature, animations, haptics.

### Tasks

1. **Dashboard**
   - `DashboardScreen` — home screen with widgets
   - `BabySummaryCard` — selected baby overview
   - `QuickActionsBar` — quick action buttons
   - `RecentActivityCard` — today's activities
   - `GrowthSummaryWidget` — latest measurements
   - `MilestoneProgressWidget` — overall progress
   - `UpcomingMilestonesCard` — upcoming milestones

2. **Photos Feature**
   - `photoStore.ts` with AsyncStorage persistence
   - `PhotoGalleryScreen` — grid gallery
   - `AddPhotoScreen` — capture/select photo
   - Milestone linking support

3. **Settings**
   - `SettingsScreen` — user settings
   - Unit preferences (metric/imperial)
   - Account deletion (full implementation)
   - Logout functionality

4. **Animations & Haptics**
   - Card press animations
   - Checkbox toggle animations
   - Tab indicator sliding
   - List item fade-in
   - Haptic feedback on interactions

5. **Performance**
   - `React.memo` on all list items
   - `useCallback` / `useMemo` audit
   - Image optimization
   - FlatList optimization

**Deliverable:** All features complete. Polished interactions. Performance optimized.

---

## Phase 7 — Pre-Launch

**Goal:** Production-ready. App Store submission.

### Tasks

1. **Security & Privacy**
   - Privacy manifest (`PrivacyInfo.xcprivacy`)
   - Input sanitization verification
   - Error message review (no sensitive data)

2. **Testing**
   - Complete verification checklist ([15_Verification.md](./15_Verification.md))
   - Test on multiple device sizes
   - Test all auth providers
   - Test account deletion flow

3. **Build & Distribution**
   - EAS build profiles: development, preview, production
   - App icons and splash screen
   - TestFlight build and internal testing

4. **App Store Connect**
   - App metadata (description, keywords)
   - Screenshots for required device sizes
   - Privacy policy URL
   - Age rating questionnaire
   - Review notes (account deletion steps)

5. **Submission**
   - Final production build
   - Submit for App Store review

**Deliverable:** App submitted to App Store review.

---

## Feature Dependencies

```
Phase 0 ← (no deps)
Phase 1 ← Phase 0
Phase 2 ← Phase 1
Phase 3 ← Phase 2
Phase 4 ← Phase 2
Phase 5 ← Phase 2
Phase 6 ← Phase 3, 4, 5
Phase 7 ← Phase 6
```

Phases 3, 4, and 5 can be developed in parallel after Phase 2 is complete.
