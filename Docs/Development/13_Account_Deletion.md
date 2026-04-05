# 13 — Account Deletion

← [12_Privacy_Manifest](./12_Privacy_Manifest.md) | Next → [14_SDLC_Phases](./14_SDLC_Phases.md)

---

## Overview

**App Store Requirement:** Apps that support account creation must also provide account deletion. This is mandatory for App Store approval.

For Sprout, account deletion must:

1. Delete the Firebase Auth account
2. Clear all local data (AsyncStorage)
3. Delete all local photos
4. Clear secure storage (tokens)
5. Reset all Zustand stores
6. Navigate to welcome screen

---

## Deletion Flow

```
User taps "Delete Account"
    ↓
Show confirmation sheet with warning
    ↓
User types "DELETE" to confirm
    ↓
[If Firebase token stale]
    Show re-authentication modal
    User enters password / uses Apple/Google
    ↓
Delete Firebase Auth account
    ↓
Clear AsyncStorage (all stores)
    ↓
Delete local photos directory
    ↓
Clear SecureStore
    ↓
Reset Zustand stores
    ↓
Navigate to /(auth)/welcome
```

---

## DeleteAccountSheet Component

Two-step confirmation UI for account deletion.

```typescript
// src/features/settings/components/DeleteAccountSheet.tsx

interface DeleteAccountSheetProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteAccountSheet = ({
  isVisible,
  onCancel,
  onConfirm,
  isLoading,
}: DeleteAccountSheetProps) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmEnabled = confirmText.toUpperCase() === 'DELETE';

  return (
    <BottomSheet isVisible={isVisible} onClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={48} color={theme.colors.error} />
        </View>
        
        <Typography variant="title2" align="center">
          Delete Your Account?
        </Typography>
        
        <Typography 
          variant="body" 
          color="textSecondary" 
          align="center"
          style={styles.warning}
        >
          This will permanently delete all your data including baby profiles, 
          growth records, milestones, activities, and photos. This action cannot be undone.
        </Typography>
        
        <Typography variant="subheadline" style={styles.label}>
          Type DELETE to confirm
        </Typography>
        
        <Input
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="DELETE"
          autoCapitalize="characters"
          style={styles.input}
        />
        
        <View style={styles.buttons}>
          <Button
            variant="ghost"
            onPress={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            onPress={onConfirm}
            disabled={!isConfirmEnabled || isLoading}
            loading={isLoading}
          >
            Delete My Account
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
};
```

---

## Re-Authentication Modal

Firebase requires recent authentication for account deletion.

```typescript
// src/features/settings/components/ReauthModal.tsx

interface ReauthModalProps {
  isVisible: boolean;
  authProvider: 'email' | 'apple' | 'google';
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReauthModal = ({
  isVisible,
  authProvider,
  onSuccess,
  onCancel,
}: ReauthModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReauth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user');
      
      if (authProvider === 'email') {
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
      } else if (authProvider === 'apple') {
        // Trigger Apple Sign In again
        const appleCredential = await signInWithApple();
        const oauthCredential = OAuthProvider.credential(appleCredential);
        await reauthenticateWithCredential(user, oauthCredential);
      } else if (authProvider === 'google') {
        // Trigger Google Sign In again
        const googleCredential = await signInWithGoogle();
        await reauthenticateWithCredential(user, googleCredential);
      }
      
      onSuccess();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SoftCard style={styles.modal}>
          <Typography variant="title3">Verify Your Identity</Typography>
          <Typography variant="body" color="textSecondary">
            For security, please verify your identity to delete your account.
          </Typography>
          
          {authProvider === 'email' ? (
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error}
            />
          ) : (
            <Typography variant="body" color="textSecondary">
              Sign in with {authProvider === 'apple' ? 'Apple' : 'Google'} to continue.
            </Typography>
          )}
          
          {error && <ErrorBanner error={{ type: 'AuthError', message: error, code: 'UNKNOWN' }} />}
          
          <View style={styles.buttons}>
            <Button variant="ghost" onPress={onCancel}>Cancel</Button>
            <Button 
              variant="primary" 
              onPress={handleReauth}
              loading={isLoading}
            >
              {authProvider === 'email' ? 'Verify' : `Continue with ${authProvider}`}
            </Button>
          </View>
        </SoftCard>
      </View>
    </Modal>
  );
};
```

---

## useSettingsViewModel Hook

Complete deletion logic in the view-model.

```typescript
// src/features/settings/hooks/useSettingsViewModel.ts

export function useSettingsViewModel() {
  const [isDeleteSheetVisible, setDeleteSheetVisible] = useState(false);
  const [isReauthModalVisible, setReauthModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [authProvider, setAuthProvider] = useState<'email' | 'apple' | 'google'>('email');
  const router = useRouter();

  const getAuthProvider = (): 'email' | 'apple' | 'google' => {
    const user = auth.currentUser;
    if (!user) return 'email';
    
    const providerId = user.providerData[0]?.providerId;
    if (providerId === 'apple.com') return 'apple';
    if (providerId === 'google.com') return 'google';
    return 'email';
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user found');
      
      // 1. Delete Firebase Auth account
      await user.delete();
      
      // 2. Clear all AsyncStorage data
      await AsyncStorage.multiRemove([
        'baby-storage',
        'growth-storage',
        'milestone-storage',
        'activity-storage',
        'photo-storage',
        'settings-storage',
      ]);
      
      // 3. Delete local photos directory
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(photosDir, { idempotent: true });
      }
      
      // 4. Clear SecureStore
      await SecureStoreService.clearAll();
      
      // 5. Reset all Zustand stores
      useAuthStore.getState().clearUser();
      useBabyStore.getState().reset?.();
      useGrowthStore.getState().reset?.();
      useMilestoneStore.getState().reset?.();
      useActivityStore.getState().reset?.();
      usePhotoStore.getState().reset?.();
      
      // 6. Navigate to welcome
      router.replace('/(auth)/welcome');
      
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        // Need re-authentication
        setAuthProvider(getAuthProvider());
        setReauthModalVisible(true);
      } else {
        // Show error to user
        Alert.alert('Error', 'Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReauthSuccess = async () => {
    setReauthModalVisible(false);
    // Retry deletion after successful re-auth
    await deleteAccount();
  };

  return {
    // Delete account
    isDeleteSheetVisible,
    isReauthModalVisible,
    isDeleting,
    authProvider,
    showDeleteSheet: () => setDeleteSheetVisible(true),
    hideDeleteSheet: () => setDeleteSheetVisible(false),
    confirmDelete: deleteAccount,
    handleReauthSuccess,
    cancelReauth: () => setReauthModalVisible(false),
    
    // Logout
    handleLogout: async () => {
      await signOut(auth);
      useAuthStore.getState().clearUser();
      router.replace('/(auth)/welcome');
    },
  };
}
```

---

## Store Reset Methods

Each store should have a reset method for account deletion.

```typescript
// Example: babyStore.ts
export const useBabyStore = create<BabyState>()(
  persist(
    (set) => ({
      babies: [],
      selectedBabyId: null,
      
      // ... other methods
      
      reset: () => set({
        babies: [],
        selectedBabyId: null,
      }),
    }),
    {
      name: 'baby-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## Verification Checklist

Before App Store submission:

- [ ] "Delete Account" button visible in Settings screen
- [ ] Two-step confirmation (warning + type "DELETE")
- [ ] Re-authentication works for email users
- [ ] Re-authentication works for Apple Sign In users
- [ ] Re-authentication works for Google Sign In users
- [ ] Firebase Auth account is deleted
- [ ] All AsyncStorage data is cleared
- [ ] Local photos directory is deleted
- [ ] SecureStore tokens are cleared
- [ ] All Zustand stores are reset
- [ ] User navigates to Welcome screen after deletion
- [ ] Cannot navigate back to authenticated screens
- [ ] App works correctly for new sign-up after deletion

---

## App Store Review Notes

Include these notes for the App Store reviewer:

```
ACCOUNT DELETION:

Account deletion is available in:
Settings > Delete Account

Steps:
1. Tap "Delete Account" at the bottom of Settings
2. Read the warning about permanent data deletion
3. Type "DELETE" in the text field to confirm
4. Tap "Delete My Account"
5. If prompted, re-authenticate with your sign-in method

This permanently deletes:
- Your user account
- All baby profiles
- All growth records
- All milestone completions
- All activity logs
- All photos

This action cannot be undone.
```
