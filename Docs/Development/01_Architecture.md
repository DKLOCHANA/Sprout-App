# 01 — Architecture & Folder Structure

← [INDEX](./INDEX.md) | Next → [02_Tech_Stack](./02_Tech_Stack.md)

---

## Feature-Based Clean Architecture

Sprout follows **Feature-Based Architecture** combined with Clean Architecture principles. Each feature is self-contained with its own components, screens, hooks, and types. Shared code lives in `shared/` and `core/`.

```
┌─────────────────────────────────────────────────────┐
│                    Features                          │
│  (auth, baby-profile, growth, milestones, etc.)     │
│  Each feature: screens, components, hooks, types     │
├─────────────────────────────────────────────────────┤
│                     Shared                           │
│  (components/ui, hooks, utils, types)               │
├─────────────────────────────────────────────────────┤
│                      Core                            │
│  (storage, theme, errors, navigation, config)       │
└─────────────────────────────────────────────────────┘
```

### Layer Rules

| Layer | Can import from | Cannot import from |
|---|---|---|
| Features | Shared, Core | Other Features (unless explicitly shared) |
| Shared | Core | Features |
| Core | Nothing | Features, Shared |

---

## SDLC Principles

- Feature branches per phase — PR reviews before merge
- TypeScript strict mode — no `any` allowed
- ESLint + Prettier enforced via pre-commit hooks (Husky)
- Environment variables for all API keys — never hardcoded
- Firebase Auth for authentication
- AsyncStorage for local data persistence
- `PrivacyInfo.xcprivacy` required before App Store submission
- In-app account deletion mandatory (App Store requirement)

---

## Full Folder Structure

```
Sprout/
├── app.json
├── babel.config.js
├── tsconfig.json
├── eas.json
├── .env                            # EXPO_PUBLIC_* vars (committed, no secrets)
├── .env.local                      # Developer overrides (gitignored)
├── .eslintrc.js
├── .prettierrc
│
├── app/                            # Expo Router — route files only, thin shells
│   ├── _layout.tsx                 # Root: providers, Firebase init, fonts, splash
│   ├── +not-found.tsx
│   │
│   ├── (auth)/                     # Unauthenticated stack (no tab bar)
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   ├── (onboarding)/               # First-time user onboarding
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Welcome slides
│   │   └── add-baby.tsx            # Add first baby profile
│   │
│   └── (app)/                      # Authenticated tabs
│       ├── _layout.tsx             # ← Navigation Guard lives here
│       ├── index.tsx               # Dashboard (Home)
│       ├── babies/
│       │   ├── index.tsx           # Baby profiles list
│       │   ├── [id].tsx            # Baby detail/edit
│       │   └── add.tsx             # Add new baby
│       ├── growth/
│       │   ├── index.tsx           # Growth entries list
│       │   ├── add.tsx             # Add growth entry
│       │   └── charts.tsx          # Growth charts
│       ├── milestones/
│       │   ├── index.tsx           # Milestones overview
│       │   └── [category].tsx      # Category detail
│       ├── activities/
│       │   ├── index.tsx           # Activity log
│       │   └── add.tsx             # Add activity (feeding/sleep/diaper)
│       ├── photos/
│       │   ├── index.tsx           # Photo gallery
│       │   └── add.tsx             # Add photo
│       └── profile/
│           └── index.tsx           # User settings & account
│
├── src/
│   │
│   ├── features/                   # ══ FEATURE MODULES ══
│   │   │
│   │   ├── auth/                   # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── AppleSignInButton.tsx
│   │   │   │   ├── GoogleSignInButton.tsx
│   │   │   │   └── AuthFormDivider.tsx
│   │   │   ├── screens/
│   │   │   │   ├── WelcomeScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLoginViewModel.ts
│   │   │   │   └── useRegisterViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── onboarding/             # First-time onboarding feature
│   │   │   ├── components/
│   │   │   │   ├── OnboardingSlide.tsx
│   │   │   │   └── SlideIndicator.tsx
│   │   │   ├── screens/
│   │   │   │   ├── OnboardingScreen.tsx
│   │   │   │   └── AddFirstBabyScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useOnboardingViewModel.ts
│   │   │   └── data/
│   │   │       └── onboardingSlides.ts
│   │   │
│   │   ├── baby-profile/           # Baby profile management
│   │   │   ├── components/
│   │   │   │   ├── BabyCard.tsx
│   │   │   │   ├── BabyAvatar.tsx
│   │   │   │   ├── BabyForm.tsx
│   │   │   │   └── GenderSelector.tsx
│   │   │   ├── screens/
│   │   │   │   ├── BabyListScreen.tsx
│   │   │   │   ├── BabyDetailScreen.tsx
│   │   │   │   └── AddBabyScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBabyListViewModel.ts
│   │   │   │   ├── useBabyDetailViewModel.ts
│   │   │   │   └── useAddBabyViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── babyStore.ts
│   │   │   └── types/
│   │   │       └── baby.types.ts
│   │   │
│   │   ├── growth/                 # Growth tracking feature
│   │   │   ├── components/
│   │   │   │   ├── GrowthEntryCard.tsx
│   │   │   │   ├── GrowthForm.tsx
│   │   │   │   ├── GrowthChart.tsx
│   │   │   │   ├── HeightChart.tsx
│   │   │   │   ├── WeightChart.tsx
│   │   │   │   └── HeadCircumferenceChart.tsx
│   │   │   ├── screens/
│   │   │   │   ├── GrowthListScreen.tsx
│   │   │   │   ├── AddGrowthScreen.tsx
│   │   │   │   └── GrowthChartsScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGrowthListViewModel.ts
│   │   │   │   ├── useAddGrowthViewModel.ts
│   │   │   │   └── useGrowthChartsViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── growthStore.ts
│   │   │   ├── utils/
│   │   │   │   ├── growthCalculations.ts
│   │   │   │   └── percentileData.ts
│   │   │   └── types/
│   │   │       └── growth.types.ts
│   │   │
│   │   ├── milestones/             # Milestone tracking feature
│   │   │   ├── components/
│   │   │   │   ├── MilestoneCard.tsx
│   │   │   │   ├── MilestoneCheckbox.tsx
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   └── MilestoneProgress.tsx
│   │   │   ├── screens/
│   │   │   │   ├── MilestonesOverviewScreen.tsx
│   │   │   │   └── MilestoneCategoryScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMilestonesViewModel.ts
│   │   │   │   └── useMilestoneCategoryViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── milestoneStore.ts
│   │   │   ├── data/
│   │   │   │   └── milestoneData.ts  # Predefined milestones by age/category
│   │   │   └── types/
│   │   │       └── milestone.types.ts
│   │   │
│   │   ├── activities/             # Activity logging (feeding, sleep, diaper)
│   │   │   ├── components/
│   │   │   │   ├── ActivityCard.tsx
│   │   │   │   ├── FeedingForm.tsx
│   │   │   │   ├── SleepForm.tsx
│   │   │   │   ├── DiaperForm.tsx
│   │   │   │   ├── ActivityTypeSelector.tsx
│   │   │   │   └── ActivityTimeline.tsx
│   │   │   ├── screens/
│   │   │   │   ├── ActivityLogScreen.tsx
│   │   │   │   └── AddActivityScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useActivityLogViewModel.ts
│   │   │   │   └── useAddActivityViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── activityStore.ts
│   │   │   └── types/
│   │   │       └── activity.types.ts
│   │   │
│   │   ├── photos/                 # Photo memories feature
│   │   │   ├── components/
│   │   │   │   ├── PhotoCard.tsx
│   │   │   │   ├── PhotoGrid.tsx
│   │   │   │   └── PhotoViewer.tsx
│   │   │   ├── screens/
│   │   │   │   ├── PhotoGalleryScreen.tsx
│   │   │   │   └── AddPhotoScreen.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePhotoGalleryViewModel.ts
│   │   │   │   └── useAddPhotoViewModel.ts
│   │   │   ├── store/
│   │   │   │   └── photoStore.ts
│   │   │   └── types/
│   │   │       └── photo.types.ts
│   │   │
│   │   ├── dashboard/              # Home dashboard feature
│   │   │   ├── components/
│   │   │   │   ├── BabySummaryCard.tsx
│   │   │   │   ├── QuickActionsBar.tsx
│   │   │   │   ├── RecentActivityCard.tsx
│   │   │   │   ├── GrowthSummaryWidget.tsx
│   │   │   │   ├── MilestoneProgressWidget.tsx
│   │   │   │   └── UpcomingMilestonesCard.tsx
│   │   │   ├── screens/
│   │   │   │   └── DashboardScreen.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboardViewModel.ts
│   │   │
│   │   └── settings/               # User settings & account
│   │       ├── components/
│   │       │   ├── SettingsGroup.tsx
│   │       │   ├── SettingsRow.tsx
│   │       │   └── DeleteAccountSheet.tsx
│   │       ├── screens/
│   │       │   └── SettingsScreen.tsx
│   │       ├── hooks/
│   │       │   └── useSettingsViewModel.ts
│   │       └── types/
│   │           └── settings.types.ts
│   │
│   ├── shared/                     # ══ SHARED LAYER ══
│   │   ├── components/
│   │   │   ├── ui/                 # Design system atoms
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── SoftCard/
│   │   │   │   │   ├── SoftCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Input.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Typography/
│   │   │   │   │   ├── Typography.tsx
│   │   │   │   │   ├── Typography.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Avatar/
│   │   │   │   │   └── Avatar.tsx
│   │   │   │   ├── Badge/
│   │   │   │   │   └── Badge.tsx
│   │   │   │   ├── Chip/
│   │   │   │   │   └── Chip.tsx
│   │   │   │   ├── Skeleton/
│   │   │   │   │   └── Skeleton.tsx
│   │   │   │   ├── Divider/
│   │   │   │   │   └── Divider.tsx
│   │   │   │   ├── ProgressBar/
│   │   │   │   │   └── ProgressBar.tsx
│   │   │   │   └── IconButton/
│   │   │   │       └── IconButton.tsx
│   │   │   └── common/
│   │   │       ├── ScreenHeader.tsx
│   │   │       ├── SafeScrollView.tsx
│   │   │       ├── LoadingOverlay.tsx
│   │   │       ├── ErrorBanner.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ConfirmSheet.tsx
│   │   │       └── TabBarIcon.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useHaptic.ts
│   │   │   ├── useImagePicker.ts
│   │   │   └── useColorScheme.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── date.ts             # Date formatting helpers
│   │   │   ├── age.ts              # Age calculation helpers
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── types/
│   │       ├── common.types.ts
│   │       └── navigation.ts
│   │
│   └── core/                       # ══ CORE LAYER ══
│       ├── storage/
│       │   ├── asyncStorage.ts     # Typed AsyncStorage wrapper
│       │   ├── storageKeys.ts      # All storage key constants
│       │   └── secureStore.ts      # For sensitive data (tokens)
│       │
│       ├── firebase/
│       │   ├── config.ts           # Firebase initialization
│       │   └── auth.ts             # Firebase Auth helpers
│       │
│       ├── theme/
│       │   ├── colors.ts
│       │   ├── typography.ts
│       │   ├── spacing.ts
│       │   ├── radii.ts
│       │   ├── shadows.ts
│       │   ├── animations.ts
│       │   └── index.ts
│       │
│       ├── errors/
│       │   ├── DomainError.ts
│       │   └── errorBoundary.tsx
│       │
│       └── config/
│           └── env.ts
│
└── assets/
    ├── images/
    │   ├── logo.png
    │   ├── onboarding/
    │   │   ├── slide1.png
    │   │   ├── slide2.png
    │   │   └── slide3.png
    │   ├── empty-states/
    │   │   ├── no-babies.png
    │   │   ├── no-photos.png
    │   │   └── no-activities.png
    │   └── icons/
    │       ├── milestone-motor.png
    │       ├── milestone-cognitive.png
    │       ├── milestone-social.png
    │       └── milestone-language.png
    └── fonts/                      # If custom fonts needed (optional)
```
