# 15 — Verification Checklist

← [14_SDLC_Phases](./14_SDLC_Phases.md) | [Back to INDEX](./INDEX.md)

---

## How to Use This Checklist

Complete all items before submitting to TestFlight and before App Store submission. Items marked **[App Store]** will cause rejection if missing.

---

## Phase 0 — Foundation

- [ ] `npx expo start --ios` opens on simulator without errors
- [ ] All screens render with correct Soft Pastel design
- [ ] Navigation between all routes works (auth, onboarding, app tabs)
- [ ] Tab bar renders with correct active/inactive colors
- [ ] `SoftCard` renders with correct shadows and border radius
- [ ] `Typography` component renders all variants at correct iOS HIG sizes
- [ ] `Button` primary/secondary/ghost/destructive variants render correctly
- [ ] `Input` component handles text, password, numeric types
- [ ] `Avatar` shows photo or initials fallback correctly
- [ ] Path alias `@/` resolves correctly

---

## Phase 1 — Authentication

- [ ] Register with email/password → navigates to Onboarding
- [ ] Login with email/password → navigates to Dashboard (if onboarding complete)
- [ ] Apple Sign In works on physical device (not available on simulator)
- [ ] Google Sign In works on physical device
- [ ] Session persists: kill app → relaunch → lands on Dashboard (not Welcome)
- [ ] Onboarding slides display correctly
- [ ] "Get Started" navigates to Add First Baby
- [ ] Adding first baby completes onboarding
- [ ] Logout: clears session, navigates to Welcome, cannot go back
- [ ] Wrong password: `ErrorBanner` appears with correct message
- [ ] Duplicate email registration: shows "account exists" error
- [ ] Weak password: shows validation error

---

## Phase 2 — Baby Profiles

- [ ] Add baby with name, birth date, gender, photo
- [ ] Baby card displays in Babies list
- [ ] Tapping baby card navigates to Baby Detail
- [ ] Edit baby updates displayed information
- [ ] Photo picker opens camera or library
- [ ] Selected photo displays in avatar
- [ ] Photo persists after app restart
- [ ] Multiple babies can be added
- [ ] Baby switcher on Dashboard works
- [ ] Delete baby: confirmation sheet appears
- [ ] Delete baby: removes baby and all associated data
- [ ] Empty state shows when no babies exist

---

## Phase 3 — Growth Tracking

- [ ] Add growth entry with height, weight, head circumference
- [ ] Growth entry card displays in list
- [ ] Date picker works correctly
- [ ] Numeric inputs accept decimal values
- [ ] Entries sorted by date (newest first)
- [ ] Growth charts display data correctly
- [ ] Height chart shows line graph
- [ ] Weight chart shows line graph
- [ ] Head circumference chart shows line graph
- [ ] Chart toggles between Height/Weight/Head
- [ ] Delete entry removes from list
- [ ] Empty state shows when no entries exist
- [ ] Entries scoped to selected baby

---

## Phase 4 — Milestones

- [ ] Milestones Overview shows 4 categories
- [ ] Each category shows progress bar
- [ ] Tapping category navigates to category detail
- [ ] Milestones grouped by age range
- [ ] Age-appropriate milestones highlighted
- [ ] Checkbox marks milestone as complete
- [ ] Completion date recorded
- [ ] Haptic feedback on checkbox toggle
- [ ] Progress updates after marking complete
- [ ] Can uncheck to remove completion
- [ ] Milestone completion persists after restart
- [ ] Completions scoped to selected baby

---

## Phase 5 — Activities

- [ ] Activity type selector shows Feeding/Sleep/Diaper
- [ ] Feeding form: type (breast/bottle/solid), duration, amount
- [ ] Sleep form: start time, end time, duration, quality
- [ ] Diaper form: type (wet/dirty/both)
- [ ] Time picker works correctly
- [ ] Activity saved and displays in log
- [ ] Timeline groups by Morning/Afternoon/Evening
- [ ] Filter by activity type works
- [ ] Filter by date works
- [ ] Delete activity removes from log
- [ ] Empty state shows when no activities
- [ ] Activities scoped to selected baby

---

## Phase 6 — Dashboard & Polish

### Dashboard
- [ ] Baby summary shows name, photo, age
- [ ] Quick actions bar navigates to correct screens
- [ ] Growth summary shows latest measurements
- [ ] Milestone progress shows overall completion
- [ ] Recent activity shows today's summary
- [ ] Upcoming milestones shows age-appropriate items
- [ ] Baby switcher works (if multiple babies)

### Photos
- [ ] Photo gallery displays photos grid
- [ ] Add photo from camera works
- [ ] Add photo from library works
- [ ] Caption can be added
- [ ] Date can be set
- [ ] Milestone can be linked (optional)
- [ ] Photo displays in gallery after save
- [ ] Full-screen photo view works
- [ ] Delete photo removes from gallery
- [ ] Empty state shows when no photos

### Settings
- [ ] Profile shows user email and name
- [ ] Unit preference can be changed
- [ ] Logout navigates to Welcome
- [ ] **[App Store]** Delete Account button visible
- [ ] **[App Store]** Delete Account shows confirmation
- [ ] **[App Store]** Type "DELETE" required to confirm
- [ ] **[App Store]** Re-auth prompt for stale sessions
- [ ] **[App Store]** All data deleted on account deletion
- [ ] **[App Store]** User redirected to Welcome after deletion

### Animations & Haptics
- [ ] Card press scales down on touch
- [ ] Card press springs back on release
- [ ] Checkbox toggle has smooth animation
- [ ] Tab indicator slides between tabs
- [ ] List items fade in on load
- [ ] Haptic feedback on button press
- [ ] Haptic feedback on checkbox toggle
- [ ] No JS thread animation jank

---

## Phase 7 — Pre-Launch

### Performance
- [ ] App launches in under 2 seconds
- [ ] All lists scroll at 60fps
- [ ] No visible jank during navigation
- [ ] Images load quickly from cache
- [ ] Memory usage stays under 150MB

### Security
- [ ] All user input sanitized
- [ ] No sensitive data in error messages
- [ ] Tokens stored in SecureStore
- [ ] No console.log in production build

### Privacy
- [ ] **[App Store]** `PrivacyInfo.xcprivacy` present in project
- [ ] **[App Store]** All required reason APIs declared
- [ ] **[App Store]** All collected data types listed
- [ ] **[App Store]** Camera usage description set
- [ ] **[App Store]** Photo library usage description set

### Device Testing
- [ ] Works on iPhone SE (smallest supported)
- [ ] Works on iPhone 15 Pro Max (largest)
- [ ] Works on notched devices
- [ ] Works on Dynamic Island devices
- [ ] Landscape mode handled (or locked to portrait)

### App Store Requirements
- [ ] App icon 1024x1024
- [ ] Splash screen configured
- [ ] Screenshots for 6.7" display
- [ ] Screenshots for 6.1" display
- [ ] App description written
- [ ] Keywords selected
- [ ] **[App Store]** Privacy policy URL live
- [ ] **[App Store]** Privacy details match manifest
- [ ] **[App Store]** Age rating questionnaire complete
- [ ] **[App Store]** Review notes include deletion steps

### Final Build
- [ ] EAS build `--profile production` succeeds
- [ ] TestFlight build installs correctly
- [ ] Internal testing passes
- [ ] No crashes in crash reporting
- [ ] App submitted for review

---

## Critical Flows to Test

### New User Flow
1. Download app → Welcome screen
2. Sign up with email → Onboarding slides
3. Complete onboarding → Add first baby
4. Add baby → Dashboard with baby
5. All features accessible

### Returning User Flow
1. Kill app
2. Relaunch → Dashboard (not Welcome)
3. Data persists (babies, growth, milestones, activities)

### Multi-Baby Flow
1. Add second baby
2. Switch between babies
3. Each baby has separate data
4. Delete one baby → other baby's data intact

### Account Deletion Flow
1. Settings → Delete Account
2. Confirmation sheet → type "DELETE"
3. (If needed) Re-authenticate
4. All data deleted
5. Navigate to Welcome
6. Sign up again → fresh account
