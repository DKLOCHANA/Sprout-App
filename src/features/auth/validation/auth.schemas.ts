/**
 * Auth Validation Schemas
 * Zod schemas for form validation
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .transform((email) => email.trim().toLowerCase());

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters');

/**
 * Name validation schema
 */
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .transform((name) => name.trim());

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form schema
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Validate login form data
 */
export function validateLoginForm(data: { email: string; password: string }): {
  success: boolean;
  data?: LoginFormData;
  error?: { field?: string; message: string };
} {
  const result = loginSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Zod v4 uses .issues instead of .errors
  const firstError = result.error.issues[0];
  return {
    success: false,
    error: {
      field: firstError.path[0] as string | undefined,
      message: firstError.message,
    },
  };
}

/**
 * Validate registration form data
 */
export function validateRegisterForm(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): {
  success: boolean;
  data?: RegisterFormData;
  error?: { field?: string; message: string };
} {
  const result = registerSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Zod v4 uses .issues instead of .errors
  const firstError = result.error.issues[0];
  return {
    success: false,
    error: {
      field: firstError.path[0] as string | undefined,
      message: firstError.message,
    },
  };
}
