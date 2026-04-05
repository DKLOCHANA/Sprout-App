/**
 * Domain Error Types
 * Typed error system for consistent error handling across the app
 */

// ============================================================================
// Error Type Definitions
// ============================================================================

/**
 * AuthError — Firebase auth failures, session issues
 */
export interface AuthError {
  type: 'AuthError';
  message: string;
  code:
    | 'INVALID_CREDENTIALS'
    | 'SESSION_EXPIRED'
    | 'ACCOUNT_EXISTS'
    | 'WEAK_PASSWORD'
    | 'NETWORK_ERROR'
    | 'TOO_MANY_REQUESTS'
    | 'UNKNOWN';
}

/**
 * ValidationError — form or input constraint violations
 */
export interface ValidationError {
  type: 'ValidationError';
  message: string;
  field?: string;
}

/**
 * StorageError — AsyncStorage or file system failures
 */
export interface StorageError {
  type: 'StorageError';
  message: string;
  operation: 'read' | 'write' | 'delete';
}

/**
 * NotFoundError — baby/entry/photo not found
 */
export interface NotFoundError {
  type: 'NotFoundError';
  message: string;
  resourceType: 'baby' | 'growth' | 'milestone' | 'activity' | 'photo' | 'sleep' | 'memory';
  resourceId?: string;
}

/**
 * NetworkError — API/sync failures
 */
export interface NetworkError {
  type: 'NetworkError';
  message: string;
  retryable: boolean;
}

// ============================================================================
// Union Type
// ============================================================================

export type DomainError =
  | AuthError
  | ValidationError
  | StorageError
  | NotFoundError
  | NetworkError;

// ============================================================================
// Type Guards
// ============================================================================

export function isAuthError(error: DomainError): error is AuthError {
  return error.type === 'AuthError';
}

export function isValidationError(error: DomainError): error is ValidationError {
  return error.type === 'ValidationError';
}

export function isStorageError(error: DomainError): error is StorageError {
  return error.type === 'StorageError';
}

export function isNotFoundError(error: DomainError): error is NotFoundError {
  return error.type === 'NotFoundError';
}

export function isNetworkError(error: DomainError): error is NetworkError {
  return error.type === 'NetworkError';
}

// ============================================================================
// Error Creators
// ============================================================================

export function createAuthError(
  message: string,
  code: AuthError['code'] = 'UNKNOWN'
): AuthError {
  return { type: 'AuthError', message, code };
}

export function createValidationError(
  message: string,
  field?: string
): ValidationError {
  return { type: 'ValidationError', message, field };
}

export function createStorageError(
  message: string,
  operation: StorageError['operation']
): StorageError {
  return { type: 'StorageError', message, operation };
}

export function createNotFoundError(
  resourceType: NotFoundError['resourceType'],
  resourceId?: string
): NotFoundError {
  return {
    type: 'NotFoundError',
    message: `${resourceType} not found`,
    resourceType,
    resourceId,
  };
}

export function createNetworkError(
  message: string,
  retryable = true
): NetworkError {
  return { type: 'NetworkError', message, retryable };
}

// ============================================================================
// User-Friendly Message Helper
// ============================================================================

export function getErrorMessage(error: DomainError): string {
  switch (error.type) {
    case 'AuthError':
      return error.message;
    case 'ValidationError':
      return error.message;
    case 'StorageError':
      return 'Unable to save data. Please try again.';
    case 'NotFoundError':
      return `${error.resourceType.charAt(0).toUpperCase() + error.resourceType.slice(1)} not found`;
    case 'NetworkError':
      return error.retryable
        ? 'Network error. Please check your connection and try again.'
        : error.message;
    default:
      return 'Something went wrong';
  }
}
