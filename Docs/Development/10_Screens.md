# 10 — Screen Breakdown

← [09_Features](./09_Features.md) | Next → [11_Performance](./11_Performance.md)

---

## Screen List

| Screen | Route | View-Model |
|---|---|---|
| Welcome | `/(auth)/welcome` | — (static) |
| Login | `/(auth)/login` | `useLoginViewModel` |
| Register | `/(auth)/register` | `useRegisterViewModel` |
| Onboarding | `/(onboarding)` | `useOnboardingViewModel` |
| Add First Baby | `/(onboarding)/add-baby` | `useAddBabyViewModel` |
| Dashboard | `/(app)` | `useDashboardViewModel` |
| Baby List | `/(app)/babies` | `useBabyListViewModel` |
| Baby Detail | `/(app)/babies/[id]` | `useBabyDetailViewModel` |
| Add Baby | `/(app)/babies/add` | `useAddBabyViewModel` |
| Growth List | `/(app)/growth` | `useGrowthListViewModel` |
| Add Growth | `/(app)/growth/add` | `useAddGrowthViewModel` |
| Growth Charts | `/(app)/growth/charts` | `useGrowthChartsViewModel` |
| Milestones Overview | `/(app)/milestones` | `useMilestonesViewModel` |
| Milestone Category | `/(app)/milestones/[category]` | `useMilestoneCategoryViewModel` |
| Activity Log | `/(app)/activities` | `useActivityLogViewModel` |
| Add Activity | `/(app)/activities/add` | `useAddActivityViewModel` |
| Photo Gallery | `/(app)/photos` | `usePhotoGalleryViewModel` |
| Add Photo | `/(app)/photos/add` | `useAddPhotoViewModel` |
| Settings | `/(app)/profile` | `useSettingsViewModel` |

---

## Screen: Welcome / Login / Register

```
WelcomeScreen
  SafeScrollView
    Logo + App Name ("Sprout")
    Tagline ("Track every precious moment")
    Illustration (baby-related)
    
    AppleSignInButton          ← expo-apple-authentication (primary)
    AuthFormDivider ("or")
    GoogleSignInButton         ← @react-native-google-signin
    AuthFormDivider ("or")
    Button (variant="ghost")   ← "Sign in with Email" → LoginScreen
    Typography (caption)       ← "New here? Create an account" → RegisterScreen

LoginScreen
  SafeScrollView
    ScreenHeader ("Sign In", back button)
    SoftCard
      Input (label="Email", keyboardType="email-address")
      Input (label="Password", secureTextEntry)
    Button (variant="primary") ← "Sign In"
    ErrorBanner (if error)
    Typography (caption)       ← "Forgot password?" link

RegisterScreen
  SafeScrollView
    ScreenHeader ("Create Account", back button)
    SoftCard
      Input (label="Full Name")
      Input (label="Email", keyboardType="email-address")
      Input (label="Password", secureTextEntry)
      Input (label="Confirm Password", secureTextEntry)
    Button (variant="primary") ← "Create Account"
    ErrorBanner (if error)
```

---

## Screen: Onboarding

```
OnboardingScreen
  PagerView (swipeable slides)
    OnboardingSlide (x 3)
      Image (illustration)
      Typography (title)
      Typography (description)
    
  SlideIndicator (dots)
  
  [Last slide:]
    Button (variant="primary") ← "Get Started" → Add First Baby

AddFirstBabyScreen
  SafeScrollView
    ScreenHeader ("Add Your Baby")
    Typography ("Let's set up your baby's profile")
    
    BabyForm
      BabyAvatar (tap to add photo)
      Input (label="Baby's Name")
      DatePicker (label="Birth Date")
      GenderSelector
        Chip ("Boy")
        Chip ("Girl")
        Chip ("Other")
    
    Button (variant="primary") ← "Continue"
```

---

## Screen: Dashboard

```
DashboardScreen
  SafeScrollView
    Row: [Baby Avatar + Name + Age]  [Settings Icon →]
    
    [If multiple babies:]
      BabySwitcher (horizontal scroll)
        BabyChip (x N, tap to switch)
    
    QuickActionsBar
      IconButton ("Add Growth")
      IconButton ("Log Activity")  
      IconButton ("Add Photo")
    
    SoftCard: GrowthSummaryWidget
      Row: [Height] [Weight] [Head]
      Typography (last updated date)
      Button (ghost) ← "View Charts →"
    
    SoftCard: MilestoneProgressWidget
      ProgressBar (overall completion)
      Typography ("X of Y milestones achieved")
      Row: CategoryBadge (x 4 with mini progress)
      Button (ghost) ← "View All →"
    
    SoftCard: RecentActivityCard
      Typography ("Today's Activity")
      Row: ActivitySummary (feeding count, sleep hours, diaper count)
      Button (ghost) ← "View Log →"
    
    SoftCard: UpcomingMilestonesCard
      Typography ("Coming Up")
      MilestoneRow (x 3, age-appropriate)
```

---

## Screen: Baby Profiles

```
BabyListScreen
  ScreenHeader ("Babies", + button → Add Baby)
  
  [State: empty]
    EmptyState
      Illustration
      Typography ("No babies yet")
      Button ← "Add Baby"
  
  [State: data]
    FlatList (grid, 2 columns)
      BabyCard (x N)
        BabyAvatar (large)
        Typography (name)
        Typography (age, e.g., "3 months")
        [Selected indicator if active]
        [onPress] → BabyDetailScreen
        [onLongPress] → Options menu (edit, delete)

BabyDetailScreen
  SafeScrollView
    ScreenHeader (baby name, edit button)
    
    BabyAvatar (xlarge, tap to change)
    
    SoftCard: Info
      Row: Label + Value (Name)
      Row: Label + Value (Birth Date)
      Row: Label + Value (Gender)
      Row: Label + Value (Age)
    
    SoftCard: Quick Stats
      Row: [Latest Height] [Latest Weight]
      Row: [Milestones Completed]
    
    Button (variant="secondary") ← "Edit Profile"
    Button (variant="destructive") ← "Delete Baby"
    
    ConfirmSheet (delete confirmation)

AddBabyScreen
  SafeScrollView
    ScreenHeader ("Add Baby", close button)
    BabyForm (same as onboarding)
    Button (variant="primary") ← "Save"
```

---

## Screen: Growth Tracking

```
GrowthListScreen
  ScreenHeader ("Growth", + button → Add Entry, charts button)
  
  [State: empty]
    EmptyState
      Illustration (measuring tape)
      Typography ("No growth entries yet")
      Button ← "Add First Entry"
  
  [State: data]
    FlatList
      GrowthEntryCard (x N)
        Typography (date)
        Row: [Height badge] [Weight badge] [Head badge]
        Typography (notes preview)
        [onPress] → Edit modal
        [swipe] → Delete

AddGrowthScreen
  SafeScrollView
    ScreenHeader ("Add Growth Entry")
    
    DatePicker (default: today)
    
    SoftCard
      Input (label="Height", suffix="cm", keyboardType="decimal-pad")
      Input (label="Weight", suffix="kg", keyboardType="decimal-pad")
      Input (label="Head Circumference", suffix="cm", keyboardType="decimal-pad")
      Input (label="Notes", multiline)
    
    Button (variant="primary") ← "Save"

GrowthChartsScreen
  ScreenHeader ("Growth Charts")
  
  SegmentedControl (Height / Weight / Head)
  
  [Selected: Height]
    HeightChart
      LineChart (date vs height)
      Typography (percentile, if available)
  
  [Selected: Weight]
    WeightChart
      LineChart (date vs weight)
  
  [Selected: Head]
    HeadCircumferenceChart
      LineChart (date vs circumference)
```

---

## Screen: Milestones

```
MilestonesOverviewScreen
  SafeScrollView
    ScreenHeader ("Milestones")
    
    SoftCard: Overall Progress
      ProgressBar
      Typography ("X of Y milestones")
    
    Typography (section header, "Categories")
    
    CategoryCard (Motor Skills)
      Icon (🏃)
      Typography ("Motor Skills")
      ProgressBar (category progress)
      Typography ("X of Y")
      [onPress] → MilestoneCategoryScreen
    
    CategoryCard (Cognitive)
      Icon (🧠)
      ... same structure
    
    CategoryCard (Social)
      Icon (👶)
      ... same structure
    
    CategoryCard (Language)
      Icon (💬)
      ... same structure

MilestoneCategoryScreen
  SafeScrollView
    ScreenHeader (category name, back button)
    
    ProgressBar (category progress)
    
    Typography (section, "Age-Appropriate Now")
    FlatList
      MilestoneCard (x N, for current age range)
        MilestoneCheckbox
        Typography (title)
        Typography (description)
        [If completed:]
          Badge ("Completed", date)
          Photo thumbnail (if attached)
    
    Typography (section, "Coming Up")
    FlatList
      MilestoneCard (x N, for future age range)
        [Disabled checkbox]
        Typography (title, dimmed)
```

---

## Screen: Activity Log

```
ActivityLogScreen
  ScreenHeader ("Activity", + button → Add Activity)
  
  SegmentedControl (All / Feeding / Sleep / Diaper)
  DateSelector (today, yesterday, date picker)
  
  [State: empty]
    EmptyState
      Illustration
      Typography ("No activities logged")
      Button ← "Log Activity"
  
  [State: data]
    ActivityTimeline
      TimeMarker ("Morning")
        ActivityCard (x N)
          Icon (activity type)
          Typography (time)
          Typography (details, e.g., "Bottle, 120ml")
          [onPress] → Edit
          [swipe] → Delete
      
      TimeMarker ("Afternoon")
        ActivityCard (x N)
      
      TimeMarker ("Evening")
        ActivityCard (x N)

AddActivityScreen
  SafeScrollView
    ScreenHeader ("Log Activity")
    
    ActivityTypeSelector
      Chip ("Feeding", icon 🍼)
      Chip ("Sleep", icon 😴)
      Chip ("Diaper", icon 🧷)
    
    TimePicker (label="Time")
    
    [If Feeding:]
      FeedingForm
        SegmentedControl (Breast / Bottle / Solid)
        [If Breast:]
          SegmentedControl (Left / Right / Both)
          Input (duration, minutes)
        [If Bottle:]
          Input (amount, ml)
          Input (duration, minutes)
        [If Solid:]
          Input (notes)
    
    [If Sleep:]
      SleepForm
        TimePicker (start)
        TimePicker (end, optional)
        SegmentedControl (Quality: Good / Fair / Poor)
    
    [If Diaper:]
      DiaperForm
        SegmentedControl (Wet / Dirty / Both)
    
    Input (notes, optional)
    
    Button (variant="primary") ← "Save"
```

---

## Screen: Photos

```
PhotoGalleryScreen
  ScreenHeader ("Photos", + button → Add Photo)
  
  [State: empty]
    EmptyState
      Illustration (camera)
      Typography ("No photos yet")
      Button ← "Add Photo"
  
  [State: data]
    FlatList (grid, 3 columns)
      PhotoCard (x N)
        Image (thumbnail)
        [If milestone linked:]
          Badge (milestone icon)
        [onPress] → PhotoViewer (full screen)
        [onLongPress] → Options (delete)

AddPhotoScreen
  SafeScrollView
    ScreenHeader ("Add Photo")
    
    [No photo selected:]
      PhotoPlaceholder
        Button ("Take Photo")
        Button ("Choose from Library")
    
    [Photo selected:]
      Image (preview)
      Button (ghost) ← "Change Photo"
    
    Input (label="Caption", multiline)
    DatePicker (label="Date Taken")
    
    [Optional:]
      Typography ("Link to Milestone")
      MilestoneSelector
        Dropdown → Select milestone
    
    Button (variant="primary") ← "Save"
```

---

## Screen: Settings

```
SettingsScreen
  SafeScrollView
    ProfileHeader
      Avatar (user photo or initials)
      Typography (user.displayName)
      Typography (user.email)
    
    SettingsGroup (title="Preferences")
      SettingsRow ("Units", value="Metric", chevron)
        → Picker: Metric / Imperial
      SettingsRow ("Notifications", toggle switch)
    
    SettingsGroup (title="Information")
      SettingsRow ("Privacy Policy", external link icon)
      SettingsRow ("Terms of Service", external link icon)
      SettingsRow ("Version", value="1.0.0")
    
    Divider
    
    Button (variant="ghost") ← "Log Out"
    Button (variant="destructive") ← "Delete Account"
    
    DeleteAccountSheet
      Typography ("Are you sure?")
      Typography (warning about data loss)
      Input ("Type DELETE to confirm")
      Button (destructive) ← "Delete My Account"
      Button (ghost) ← "Cancel"
```
