# 06 — Error Handling

← [05_Theme_System](./05_Theme_System.md) | Next → [07_Security](./07_Security.md)

---

## DomainError Union Type (`src/core/errors/DomainError.ts`)

All errors in the presentation layer must be typed. **Never pass raw `Error` objects to the UI.**

```typescript
export type DomainError =
  | AuthError
  | ValidationError
  | StorageError
  | NotFoundError;

// AuthError — Firebase auth failures, session issues
export interface AuthError {
  type: 'AuthError';
  message: string;
  code: 'INVALID_CREDENTIALS' | 'SESSION_EXPIRED' | 'ACCOUNT_EXISTS' | 'WEAK_PASSWORD' | 'UNKNOWN';
}

// ValidationError — form or input constraint violations
export interface ValidationError {
  type: 'ValidationError';
  message: string;
  field?: string;       // which field failed, if applicable
}

// StorageError — AsyncStorage or file system failures
export interface StorageError {
  type: 'StorageError';
  message: string;
  operation: 'read' | 'write' | 'delete';
}

// NotFoundError — baby/entry/photo not found
export interface NotFoundError {
  type: 'NotFoundError';
  message: string;
  resourceType: 'baby' | 'growth' | 'milestone' | 'activity' | 'photo';
  resourceId?: string;
}

// Type guards
export function isAuthError(error: DomainError): error is AuthError {
  return error.type === 'AuthError';
}

export function isValidationError(error: DomainError): error is ValidationError {
  return error.type === 'ValidationError';
}
```

---

## Firebase Auth Error Mapping

Map Firebase auth error codes to user-friendly `DomainError`.

```typescript
// src/core/firebase/auth.ts

export function mapFirebaseAuthError(error: any): AuthError {
  const code = error?.code || '';
  
  switch (code) {
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        type: 'AuthError',
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    case 'auth/email-already-in-use':
      return {
        type: 'AuthError',
        message: 'An account with this email already exists',
        code: 'ACCOUNT_EXISTS',
      };
    case 'auth/weak-password':
      return {
        type: 'AuthError',
        message: 'Password must be at least 6 characters',
        code: 'WEAK_PASSWORD',
      };
    case 'auth/user-disabled':
      return {
        type: 'AuthError',
        message: 'This account has been disabled',
        code: 'SESSION_EXPIRED',
      };
    default:
      return {
        type: 'AuthError',
        message: 'An authentication error occurred',
        code: 'UNKNOWN',
      };
  }
}
```

---

## Screen-Level Error Boundary (`src/core/errors/errorBoundary.tsx`)

Catches any unhandled render error at screen level. Prevents a full app crash from a single screen's error.

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/core/theme';

interface State {
  hasError: boolean;
}

export class ScreenErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to crash reporting service in production
    console.error('[ScreenErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😢</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.subtitle}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.screen,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.title2,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.button,
  },
  buttonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.fontSize.headline,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
```

---

## ErrorBanner Component

Inline error display used by all view-models. Maps `DomainError.type` to user-friendly messages.

```typescript
// src/shared/components/common/ErrorBanner.tsx

interface ErrorBannerProps {
  error: DomainError;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorBanner = ({ error, onDismiss, onRetry }: ErrorBannerProps) => {
  const getMessage = () => {
    switch (error.type) {
      case 'AuthError':
        return error.message;
      case 'ValidationError':
        return error.message;
      case 'StorageError':
        return 'Unable to save data. Please try again.';
      case 'NotFoundError':
        return `${error.resourceType} not found`;
      default:
        return 'Something went wrong';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
        <Typography 
          variant="subheadline" 
          color="error" 
          style={styles.message}
        >
          {getMessage()}
        </Typography>
      </View>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity onPress={onRetry}>
            <Typography variant="subheadline" color="primary">
              Retry
            </Typography>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
```

---

## Error Handling Rules

1. **View-models catch errors and set local `error` state** — never let errors propagate to the screen unhandled

2. **StorageError → show retry option** — AsyncStorage operations should be retryable

3. **AuthError with `SESSION_EXPIRED` → sign out automatically** — do not show an error banner

4. **ValidationError → display inline on the relevant form field**, not in a banner

5. **Never display raw error messages** — always use mapped, user-friendly messages

6. **Log all errors for debugging** — console.error in dev, crash reporting in prod

---

## Error Handling in View-Models

```typescript
// Example: useAddBabyViewModel.ts

export function useAddBabyViewModel() {
  const [error, setError] = useState<DomainError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addBaby = useBabyStore((state) => state.addBaby);
  const router = useRouter();

  const handleSubmit = async (data: BabyFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Validate
      const validationResult = validateBabyData(data);
      if (!validationResult.success) {
        setError({
          type: 'ValidationError',
          message: validationResult.error,
          field: validationResult.field,
        });
        return;
      }
      
      // Save
      addBaby(data);
      router.back();
      
    } catch (err) {
      setError({
        type: 'StorageError',
        message: 'Failed to save baby profile',
        operation: 'write',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleSubmit,
    clearError: () => setError(null),
  };
}
```
