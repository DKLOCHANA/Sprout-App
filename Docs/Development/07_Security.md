# 07 — Security

← [06_Error_Handling](./06_Error_Handling.md) | Next → [08_Data_Layer](./08_Data_Layer.md)

---

## Security Overview

Sprout stores sensitive baby data locally on-device. Security measures protect:

1. **User authentication tokens** — Firebase Auth tokens in SecureStore
2. **Baby data privacy** — Local storage only, no cloud sync in MVP
3. **Photo privacy** — Photos stored locally on device file system
4. **Environment secrets** — API keys never hardcoded

---

## Token Storage Rules

| Data | Storage | Reason |
|---|---|---|
| Firebase Auth tokens | SecureStore | Encrypted, hardware-backed |
| User session state | SecureStore | Contains sensitive identifiers |
| Baby profiles | AsyncStorage | Non-sensitive, encrypted at rest on iOS |
| Growth/Activity data | AsyncStorage | Non-sensitive, encrypted at rest on iOS |
| Photos | Local file system | expo-file-system, sandboxed |

**Rule:** Never store authentication tokens in AsyncStorage. Always use SecureStore.

```typescript
// ✅ Correct
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('authToken', token);

// ❌ Wrong
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('authToken', token);  // NOT SECURE
```

---

## SecureStore Service (`src/core/storage/secureStore.ts`)

Typed wrapper for all SecureStore operations.

```typescript
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_STATE: 'auth-state',
} as const;

export const SecureStoreService = {
  async setAuthState(state: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.AUTH_STATE, state);
  },

  async getAuthState(): Promise<string | null> {
    return await SecureStore.getItemAsync(KEYS.AUTH_STATE);
  },

  async clearAuthState(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.AUTH_STATE);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.AUTH_STATE),
    ]);
  },
};
```

---

## Input Sanitization

Sanitize all user input before storing or displaying. Prevents XSS-like issues and ensures data integrity.

```typescript
// src/shared/utils/validation.ts

export function sanitizeTextInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')        // Remove angle brackets
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .slice(0, 500);              // Max length
}

export function sanitizeName(name: string): string {
  return sanitizeTextInput(name)
    .replace(/[^a-zA-Z\s'-]/g, '')  // Only letters, spaces, hyphens, apostrophes
    .slice(0, 100);
}

export function sanitizeNotes(notes: string): string {
  return notes
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 2000);             // Allow longer notes
}
```

---

## Validation with Zod

Use Zod schemas for all form validation.

```typescript
// src/features/baby-profile/types/baby.types.ts
import { z } from 'zod';

export const babySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .transform(sanitizeName),
  
  birthDate: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed <= new Date();
    }, 'Invalid birth date'),
  
  gender: z.enum(['male', 'female', 'other']),
});

export type BabyFormData = z.infer<typeof babySchema>;
```

---

## Environment Variable Strategy

### Files

| File | Purpose | Git Status |
|---|---|---|
| `.env` | Default values, safe to commit | Committed |
| `.env.local` | Developer overrides, secrets | Gitignored |

### Access Pattern

```typescript
// src/core/config/env.ts

export const env = {
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  },
};

// Validate at startup
export function validateEnv(): void {
  const required = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```

---

## Photo Storage Security

Photos are stored locally on the device file system, sandboxed to the app.

```typescript
// src/shared/hooks/useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

export async function savePhoto(uri: string): Promise<string> {
  // Ensure directory exists
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
  
  // Generate unique filename
  const filename = `${Date.now()}.jpg`;
  const destination = `${PHOTOS_DIR}${filename}`;
  
  // Copy to app's document directory
  await FileSystem.copyAsync({ from: uri, to: destination });
  
  return destination;
}

export async function deletePhoto(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri);
  }
}
```

---

## Firebase Auth Security

Firebase Auth handles authentication securely:

1. **Password hashing** — Handled by Firebase, never stored locally
2. **Token refresh** — Firebase SDK handles automatically
3. **Session management** — Tokens stored in SecureStore
4. **Account verification** — Email verification available (optional for MVP)

```typescript
// src/core/firebase/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function register(email: string, password: string): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
```

---

## Security Checklist

Before App Store submission:

- [ ] Firebase Auth configured correctly
- [ ] SecureStore used for all auth tokens
- [ ] No API keys hardcoded in source
- [ ] All user input sanitized
- [ ] Form validation with Zod
- [ ] Photos stored in app sandbox
- [ ] Error messages don't leak sensitive info
- [ ] Console logs disabled in production
- [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) complete
