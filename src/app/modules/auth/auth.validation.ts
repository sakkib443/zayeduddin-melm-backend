// ===================================================================
// MotionBoss LMS - Auth Validation
// Zod validation schemas for authentication
// ===================================================================

import { z } from 'zod';

/**
 * Register Validation Schema
 * নতুন user registration এর জন্য validation
 */
export const registerValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password cannot exceed 50 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&#)'
      ),

    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters'),

    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters'),

    phone: z.string().optional().or(z.literal('')),
    countryCode: z.string().optional().default('+880'),

    // Address fields (optional)
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    country: z.string().max(100).optional(),

    // Profile fields (optional)
    gender: z.enum(['male', 'female', 'other', '']).optional(),
    aboutStudent: z.string().max(1000).optional(),

    role: z.enum(['student', 'admin', 'mentor']).optional().default('student'),
  }),
});

/**
 * Login Validation Schema
 * Login করার সময় validation
 */
export const loginValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'),
  }),
});

/**
 * Refresh Token Validation Schema
 * Token refresh করার সময় validation
 */
export const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z
      .string({
        required_error: 'Refresh token is required',
      })
      .min(1, 'Refresh token is required'),
  }),
});

/**
 * Forgot Password Validation Schema
 * Password reset email request এর জন্য validation
 */
export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email'),
  }),
});

/**
 * Reset Password Validation Schema
 * Password reset করার সময় validation
 */
export const resetPasswordValidation = z.object({
  body: z.object({
    token: z
      .string({
        required_error: 'Reset token is required',
      })
      .min(1, 'Reset token is required'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password cannot exceed 50 characters'),

    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
      }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

/**
 * Update Password Validation Schema
 * Logged-in user এর password change করার সময় validation
 */
export const updatePasswordValidation = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current password is required',
      })
      .min(1, 'Current password is required'),

    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'New password must be at least 6 characters')
      .max(50, 'New password cannot exceed 50 characters'),

    confirmNewPassword: z
      .string({
        required_error: 'Confirm new password is required',
      }),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  }),
});

// Export types
export type TRegisterInput = z.infer<typeof registerValidation>['body'];
export type TLoginInput = z.infer<typeof loginValidation>['body'];

/**
 * Verify Email Validation Schema
 * Email verification token validation
 */
export const verifyEmailValidation = z.object({
  body: z.object({
    token: z
      .string({
        required_error: 'Verification token is required',
      })
      .min(1, 'Verification token is required'),
  }),
});

/**
 * Resend Verification Email Validation Schema
 * Resend verification email validation
 */
export const resendVerificationValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Please provide a valid email'),
  }),
});