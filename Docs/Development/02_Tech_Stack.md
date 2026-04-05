# 02 — Tech Stack

← [01_Architecture](./01_Architecture.md) | Next → [03_State_Management](./03_State_Management.md)

---

## All Dependencies

| Category | Library | Version | Purpose |
|---|---|---|---|
| Framework | Expo SDK | ~52.0.0 | Core Expo platform |
| Runtime | React Native | 0.76.x | iOS native runtime |
| Language | TypeScript | ^5.3.0 | Type safety, strict mode |
| Routing | Expo Router | ~4.0.0 | File-based navigation |
| Client State | Zustand | ^5.0.0 | Auth session + UI state + data stores |
| Local Storage | @react-native-async-storage/async-storage | ^2.0.0 | Persistent local data |
| Animations | React Native Reanimated | ~3.16.0 | UI-thread animations |
| Gestures | React Native Gesture Handler | ~2.20.0 | Touch interactions |
| Token Storage | expo-secure-store | ~14.0.0 | Secure token persistence |
| Images | expo-image | ~2.0.0 | Cached images (SDWebImage) |
| Image Picker | expo-image-picker | ~16.0.0 | Photo capture & gallery access |
| Auth — Apple | expo-apple-authentication | ~7.0.0 | Apple Sign In |
| Auth — Google | @react-native-google-signin/google-signin | ^13.0.0 | Google Sign In |
| Auth — Firebase | firebase | ^11.0.0 | Firebase Auth |
| Charts | react-native-chart-kit | ^6.12.0 | Growth charts visualization |
| SVG | react-native-svg | ^15.8.0 | Chart rendering support |
| Date Utils | date-fns | ^3.6.0 | Date manipulation |
| Date Picker | @react-native-community/datetimepicker | 8.2.0 | Native date picker |
| Forms | react-hook-form | ^7.53.0 | Form state management |
| Validation | zod | ^3.23.0 | Schema validation |
| Haptics | expo-haptics | ~14.0.0 | Tactile feedback |
| Safe Area | react-native-safe-area-context | 4.12.0 | Notch/island handling |
| Screens | react-native-screens | ~4.1.0 | Native screen containers |
| Fonts | expo-font | ~13.0.0 | Font loading (if custom) |
| Splash | expo-splash-screen | ~0.29.0 | Splash screen control |
| Status Bar | expo-status-bar | ~2.0.0 | iOS status bar styling |
| Constants | expo-constants | ~17.0.0 | App config access |
| File System | expo-file-system | ~18.0.0 | Local file management |
| Icons | @expo/vector-icons | ^14.0.0 | Icon library |

---

## package.json Reference

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.x",

    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0",

    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",

    "expo-secure-store": "~14.0.0",
    "expo-apple-authentication": "~7.0.0",
    "expo-haptics": "~14.0.0",
    "expo-image": "~2.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-file-system": "~18.0.0",
    "expo-font": "~13.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-status-bar": "~2.0.0",
    "expo-constants": "~17.0.0",

    "firebase": "^11.0.0",
    "@react-native-google-signin/google-signin": "^13.0.0",

    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "^15.8.0",

    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",

    "@react-native-community/datetimepicker": "8.2.0",
    "date-fns": "^3.6.0",
    
    "@expo/vector-icons": "^14.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "~18.3.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

## Key Decisions

**Why Expo Router (not React Navigation)?**
File-based routing matches the mental model of the screen structure. Group routes `(auth)`, `(onboarding)`, and `(app)` cleanly separate different app states. Easy to understand for maintainability.

**Why Zustand + AsyncStorage (not SQLite)?**
For MVP, AsyncStorage with Zustand persistence is simpler to implement and debug. JSON-based storage is sufficient for baby profiles, growth entries, and activity logs. SQLite adds complexity we don't need for MVP scope.

**Why Firebase Auth (not local-only)?**
Firebase Auth provides secure authentication with Apple/Google Sign In support out of the box. Even for local-first data, user accounts allow future cloud sync capability without refactoring.

**Why react-native-chart-kit (not Victory Native)?**
`react-native-chart-kit` is simpler, well-documented, and sufficient for MVP growth charts (line charts for height/weight/head circumference). Victory Native offers more customization but adds complexity.

**Why expo-image (not Image from react-native)?**
`expo-image` provides automatic disk caching via SDWebImage, progressive loading, and better performance for photo galleries. Essential for photo-heavy features like milestone photos.

**Why react-hook-form + zod (not Formik)?**
Better TypeScript integration, smaller bundle size, and cleaner validation patterns with Zod schemas. Forms are central to this app (baby profiles, growth entries, activities).

**Why Reanimated (not Animated)?**
`Animated` from React Native core runs on the JS thread — it will jank during heavy renders. Reanimated runs on the UI thread via worklets, delivering smooth 60fps animations.

---

## Development Environment Requirements

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 24.x | JavaScript runtime |
| npm | 11.x | Package manager |
| Xcode | 16+ | iOS simulator & builds |
| Expo CLI | 55.x | Development commands |
| EAS CLI | Latest | Build & submit |

---

## Environment Variables

```env
# .env (committed, no secrets)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# .env.local (gitignored, developer overrides)
# Any local development overrides
```
