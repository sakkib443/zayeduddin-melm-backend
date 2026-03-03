// ===================================================================
// MotionBoss LMS - Instructor Validation
// Zod দিয়ে Instructor data validation schemas
// ===================================================================

import { z } from 'zod';

/**
 * Create Instructor Validation Schema
 * নতুন instructor তৈরি করার সময় এই validation চলবে
 * Admin creates user + instructor profile together
 */
export const createInstructorValidation = z.object({
    body: z.object({
        // User fields (will create a new user with role: instructor)
        email: z
            .string({ required_error: 'Email is required' })
            .email('Please provide a valid email'),

        password: z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters')
            .max(50, 'Password cannot exceed 50 characters'),

        firstName: z
            .string({ required_error: 'First name is required' })
            .min(1, 'First name is required')
            .max(50, 'First name cannot exceed 50 characters'),

        lastName: z
            .string({ required_error: 'Last name is required' })
            .min(1, 'Last name is required')
            .max(50, 'Last name cannot exceed 50 characters'),

        phone: z
            .string()
            .optional()
            .default(''),

        // Instructor profile fields
        title: z
            .string()
            .max(200, 'Title cannot exceed 200 characters')
            .optional()
            .default(''),

        titleBn: z.string().max(200).optional(),

        bio: z
            .string()
            .max(500, 'Bio cannot exceed 500 characters')
            .optional()
            .default(''),

        bioBn: z.string().optional(),
        longBio: z.string().optional(),
        longBioBn: z.string().optional(),

        avatar: z.string().optional(),
        coverImage: z.string().optional(),

        expertise: z.array(z.string()).optional().default([]),
        experience: z.number().min(0).optional().default(0),
        specializations: z.number().min(0).optional().default(0),
        education: z.array(z.string()).optional().default([]),
        workExperience: z.array(z.string()).optional().default([]),
        certifications: z.array(z.string()).optional().default([]),

        whatsAppNumber: z.string().optional(),

        socialLinks: z.object({
            facebook: z.string().optional(),
            twitter: z.string().optional(),
            linkedin: z.string().optional(),
            youtube: z.string().optional(),
            github: z.string().optional(),
            instagram: z.string().optional(),
            website: z.string().optional(),
        }).optional(),

        isPublished: z.boolean().optional().default(true),
        order: z.number().optional().default(0),
        totalStudents: z.number().min(0).optional().default(0),
    }),
});

/**
 * Update Instructor Validation Schema
 * Instructor profile update করার সময় এই validation চলবে
 */
export const updateInstructorValidation = z.object({
    body: z.object({
        // User fields (optional update)
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        phone: z.string().max(14).optional(),

        // Instructor profile fields
        title: z.string().max(200).optional(),
        titleBn: z.string().max(200).optional(),
        bio: z.string().max(500).optional(),
        bioBn: z.string().optional(),
        longBio: z.string().optional(),
        longBioBn: z.string().optional(),

        avatar: z.string().optional(),
        coverImage: z.string().optional(),

        expertise: z.array(z.string()).optional(),
        experience: z.number().min(0).optional(),
        specializations: z.number().min(0).optional(),
        education: z.array(z.string()).optional(),
        workExperience: z.array(z.string()).optional(),
        certifications: z.array(z.string()).optional(),

        whatsAppNumber: z.string().optional(),

        socialLinks: z.object({
            facebook: z.string().optional(),
            twitter: z.string().optional(),
            linkedin: z.string().optional(),
            youtube: z.string().optional(),
            github: z.string().optional(),
            instagram: z.string().optional(),
            website: z.string().optional(),
        }).optional(),

        status: z.enum(['active', 'inactive']).optional(),
        isPublished: z.boolean().optional(),
        order: z.number().optional(),

        // Password change (optional, admin only)
        password: z.string().min(6).max(50).optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'Instructor ID is required' }),
    }),
});

// Export types
export type TCreateInstructorInput = z.infer<typeof createInstructorValidation>['body'];
export type TUpdateInstructorInput = z.infer<typeof updateInstructorValidation>['body'];
