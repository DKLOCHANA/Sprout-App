# Family Management Feature - Implementation Plan

## Problem Statement

The Sprout app needs to support multiple children per family. Users should be able to:
1. Add and manage multiple babies
2. Quickly switch between children throughout the app
3. View child-specific data (growth, milestones, sleep, memories) for the selected child
4. Manage their family from the Profile page

## Current State Analysis

### ✅ What Already Exists (Foundation Ready)
- **Multi-child store structure**: `useBabyStore` has `selectedBabyId` + `babies[]` array
- **Child switching logic**: `selectBaby(id)` method already implemented
- **Data filtering by child**: All feature stores (growth, milestones, sleep, memories) filter by `babyId`
- **Firebase multi-child support**: Collections properly scoped by `userId` → `babyId`
- **Profile page structure**: "Family Management" section exists (currently shows "Coming Soon" alert)

### ❌ What's Missing
- **No UI for switching babies** - Users can't actually switch children
- **Family Management screen not implemented** - Just a placeholder alert
- **Some screens lack empty states** - Issues when no baby selected
- **No visual indicator** of which baby is currently selected

---

## Proposed Approach

### UI Pattern: Child Switcher
**Recommendation**: Add a **tappable header component** to main app screens that shows the selected baby with a dropdown to switch.

```
┌─────────────────────────────────────┐
│ [👶 Avatar] Baby Name        [⌄]   │  ← Tap opens modal
├─────────────────────────────────────┤
│                                     │
│    [Dashboard/Growth/etc content]   │
│                                     │
└─────────────────────────────────────┘
```

**Why this pattern:**
- Follows iOS design patterns (similar to account switchers)
- Non-intrusive - doesn't clutter the tab bar
- Scalable - works with 2+ children
- Clear visual context of which child's data is displayed

---

## Implementation Phases

### Phase 1: Core Child Switcher Component (MVP Critical)

**Goal**: Enable users to switch between children from any main screen

#### Tasks:
1. **Create BabySwitcher component** (`src/shared/components/BabySwitcher.tsx`)
   - Show selected baby avatar + name
   - Dropdown chevron indicator
   - Tap opens baby selection modal
   - List all babies with selection state
   - "Add another baby" option at bottom

2. **Create BabySelectorModal component** (`src/shared/components/BabySelectorModal.tsx`)
   - Modal with list of babies
   - Avatar, name, age for each
   - Checkmark on selected baby
   - Tap to select + close modal
   - "Add Baby" button

3. **Create useBabySwitcher hook** (`src/shared/hooks/useBabySwitcher.ts`)
   - Wrap `useBabyStore` logic
   - Handle selection persistence
   - Provide formatted display data

4. **Add to App Layout** (`app/(app)/_layout.tsx`)
   - Integrate BabySwitcher in header area
   - Available across all main tabs

---

### Phase 2: Family Management Screen

**Goal**: Full family management experience from Profile page

#### Tasks:
1. **Create FamilyManagementScreen** (`src/features/profile/screens/FamilyManagementScreen.tsx`)
   - List all babies with cards
   - Show selected indicator
   - Edit button per child → navigates to edit screen
   - Delete button with confirmation
   - "Add Another Baby" button at bottom

2. **Create FamilyMemberCard component** (`src/features/profile/components/FamilyMemberCard.tsx`)
   - Baby avatar (or placeholder)
   - Name and age display
   - Selected state (visual highlight)
   - Edit/Delete action buttons
   - Tap to select as active

3. **Create useFamilyManagement hook** (`src/features/profile/hooks/useFamilyManagement.ts`)
   - Manage delete confirmation state
   - Handle cascade delete logic
   - Provide formatted baby data

4. **Add navigation route** (`app/(app)/family-management.tsx`)
   - New screen in app navigation
   - Update ProfileScreen to navigate here

5. **Update ProfileScreen** (`src/features/profile/screens/ProfileScreen.tsx`)
   - Replace alert with navigation to FamilyManagementScreen
   - Show count of children in settings row

---

### Phase 3: Add Baby Flow (From Family Management)

**Goal**: Allow adding new babies after initial onboarding

#### Tasks:
1. **Create AddBabyScreen** (`src/features/baby-profile/screens/AddBabyScreen.tsx`)
   - Reuse BabySetupScreen form components
   - Simplified flow (no onboarding wrapper)
   - Save → auto-select new baby → return to family management

2. **Add navigation route** (`app/(app)/babies/add.tsx`)
   - Stack screen for add baby flow

3. **Create EditBabyScreen** (`src/features/baby-profile/screens/EditBabyScreen.tsx`)
   - Edit existing baby details (name, DOB, photo, etc.)
   - Delete option with confirmation
   - Update store + Firebase

4. **Add navigation route** (`app/(app)/babies/[id].tsx`)
   - Dynamic route for edit screen

---

### Phase 4: Empty States & Edge Cases

**Goal**: Handle all edge cases gracefully

#### Tasks:
1. **Add EmptyState component** (`src/shared/components/EmptyState.tsx`)
   - Icon, title, message, action button
   - Reusable across features

2. **Update DashboardScreen** - Add empty state when no baby selected
3. **Update GrowthScreen** - Add empty state
4. **Update MilestonesScreen** - Add empty state
5. **Update SleepScreen** - Add empty state
6. **Update MemoriesScreen** - Add empty state

7. **Handle delete selected baby**
   - When deleting selected baby, auto-select another or show empty state
   - Verify cascade delete for all related data (growth, milestones, sleep, memories)

8. **Auto-select first baby on initial load**
   - If babies exist but none selected, select first one
   - Handle in app initialization/layout

---

### Phase 5: Polish (Post-MVP)

#### Future Enhancements (Not MVP):
- Family member invite system (share access with caregivers)
- Per-child notification settings
- Multi-child comparison views
- Child data export
- Enhanced onboarding for multiple babies

---

## Technical Decisions

### State Management
- Continue using Zustand pattern with `useBabyStore`
- Create ViewModel hooks for UI logic
- No new stores needed - extend existing `babyStore`

### Component Location
| Component | Location | Reason |
|-----------|----------|--------|
| BabySwitcher | `src/shared/components/` | Used across all features |
| BabySelectorModal | `src/shared/components/` | Shared UI component |
| FamilyMemberCard | `src/features/profile/components/` | Profile-specific |
| FamilyManagementScreen | `src/features/profile/screens/` | Part of profile feature |
| AddBabyScreen | `src/features/baby-profile/screens/` | Part of baby-profile feature |
| EditBabyScreen | `src/features/baby-profile/screens/` | Part of baby-profile feature |
| EmptyState | `src/shared/components/` | Reusable across app |

### Navigation Structure
```
app/(app)/
├── _layout.tsx          # Add BabySwitcher to header
├── index.tsx            # Dashboard
├── family-management.tsx # NEW - Family Management Screen
└── babies/
    ├── add.tsx          # NEW - Add Baby Screen
    └── [id].tsx         # NEW - Edit Baby Screen (dynamic)
```

---

## File Changes Summary

### New Files to Create
```
src/shared/components/
├── BabySwitcher.tsx
├── BabySelectorModal.tsx
└── EmptyState.tsx

src/shared/hooks/
└── useBabySwitcher.ts

src/features/profile/
├── screens/FamilyManagementScreen.tsx
├── components/FamilyMemberCard.tsx
└── hooks/useFamilyManagement.ts

src/features/baby-profile/
├── screens/AddBabyScreen.tsx
└── screens/EditBabyScreen.tsx

app/(app)/
├── family-management.tsx
└── babies/
    ├── add.tsx
    └── [id].tsx
```

### Files to Modify
```
app/(app)/_layout.tsx           # Add BabySwitcher to header
src/features/profile/screens/ProfileScreen.tsx  # Update Family Management navigation
src/features/dashboard/screens/DashboardScreen.tsx  # Add empty state
src/features/growth/screens/GrowthScreen.tsx  # Add empty state
src/features/milestones/screens/MilestonesScreen.tsx  # Add empty state
src/features/sleep/screens/SleepScreen.tsx  # Add empty state
src/features/memories/screens/MemoriesScreen.tsx  # Add empty state
src/features/baby-profile/store/babyStore.ts  # Add auto-select logic
```

---

## MVP Scope

### In Scope (Must Have)
- [x] BabySwitcher component with dropdown
- [x] BabySelectorModal for child selection
- [x] Family Management screen in Profile
- [x] Add new baby from family management
- [x] Edit existing baby details
- [x] Delete baby with confirmation
- [x] Auto-select when current baby deleted
- [x] Empty states for main screens

### Out of Scope (Future)
- Family member invites (sharing)
- Multi-child comparison views
- Per-child notifications
- Multiple babies in onboarding
- Child data export

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing single-child flow | Test thoroughly after each phase |
| Data inconsistency when switching | Use existing store selectors (already filters by babyId) |
| Firebase sync issues with multiple babies | Leverage existing `syncToFirestore` which handles arrays |
| UX confusion about which baby is active | Clear visual indicator (avatar + name) in header |

---

## Success Criteria

1. ✅ User can add multiple children to their account
2. ✅ User can switch between children from any main screen
3. ✅ All screens display data for the currently selected child
4. ✅ User can edit and delete children from Family Management
5. ✅ App handles edge cases (no baby, delete selected baby) gracefully
6. ✅ Selected child persists across app restarts
