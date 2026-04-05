# Sprout MVP — Documentation Index

> **App:** Sprout — "Track every precious moment."
> **Platform:** iOS only (Expo Go, MVP)
> **Design Language:** Soft Pastel — warm pastels, rounded shapes, SF Pro, Sage Green (#7CB899), soft cream backgrounds

---

## Documents

| # | File | Contents |
|---|---|---|
| 1 | [01_Architecture.md](./01_Architecture.md) | Feature-based Clean Architecture, SDLC principles, full folder structure |
| 2 | [02_Tech_Stack.md](./02_Tech_Stack.md) | All dependencies with versions and purpose |
| 3 | [03_State_Management.md](./03_State_Management.md) | Zustand stores, custom hooks, AsyncStorage persistence |
| 4 | [04_Navigation.md](./04_Navigation.md) | Expo Router structure, navigation guard pattern |
| 5 | [05_Theme_System.md](./05_Theme_System.md) | Colors, typography, spacing, radii, animations, SoftCard |
| 6 | [06_Error_Handling.md](./06_Error_Handling.md) | DomainError union, error boundary |
| 7 | [07_Security.md](./07_Security.md) | Input sanitization, token storage rules, environment strategy |
| 8 | [08_Data_Layer.md](./08_Data_Layer.md) | AsyncStorage structure, Firebase Auth integration |
| 9 | [09_Features.md](./09_Features.md) | Feature modules breakdown with components and screens |
| 10 | [10_Screens.md](./10_Screens.md) | Component tree for all screens |
| 11 | [11_Performance.md](./11_Performance.md) | Rendering, FlatList config, image handling, animations |
| 12 | [12_Privacy_Manifest.md](./12_Privacy_Manifest.md) | iOS PrivacyInfo.xcprivacy — required entries + EAS integration |
| 13 | [13_Account_Deletion.md](./13_Account_Deletion.md) | Full cascade deletion, DeleteAccountUseCase, Firebase cleanup |
| 14 | [14_SDLC_Phases.md](./14_SDLC_Phases.md) | 6 development phases, feature-by-feature deliverables |
| 15 | [15_Verification.md](./15_Verification.md) | End-to-end QA checklist before TestFlight submission |

---

## Critical Build Order

Start here — these files must be implemented first as everything else depends on them:

1. `src/core/theme/index.ts` — every component imports from here
2. `app/_layout.tsx` — providers, Firebase init, splash control
3. `src/core/errors/DomainError.ts` — error contract for view-models
4. `src/core/storage/asyncStorage.ts` — local data persistence
5. `src/features/auth/store/authStore.ts` — drives navigation guard
6. `src/shared/components/ui/` — Button, Typography, Input, SoftCard

---

## Quick Reference

- **Soft Card component:** `SoftCard` → [05_Theme_System.md](./05_Theme_System.md)
- **Auth flow:** [04_Navigation.md](./04_Navigation.md) + Phase 1 in [14_SDLC_Phases.md](./14_SDLC_Phases.md)
- **Feature modules:** [09_Features.md](./09_Features.md)
- **App Store requirements:** [12_Privacy_Manifest.md](./12_Privacy_Manifest.md) + [13_Account_Deletion.md](./13_Account_Deletion.md)
- **Testing before ship:** [15_Verification.md](./15_Verification.md)

---

## MVP Feature Scope

| Feature | Priority | Description |
|---|---|---|
| Authentication | P0 | Firebase Auth (Email, Apple, Google) |
| Baby Profiles | P0 | Add/edit multiple baby profiles with photos |
| Growth Tracking | P0 | Log height, weight, head circumference with charts |
| Milestone Tracking | P0 | Developmental milestones checklist by category |
| Activity Logs | P1 | Feeding, sleep, diaper tracking |
| Photo Memories | P1 | Capture milestone moments with photos |
| Dashboard | P0 | Overview of baby's progress and recent activities |
