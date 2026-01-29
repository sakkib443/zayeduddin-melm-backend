// ===================================================================
// MotionBoss LMS - Batch Validation
// Zod validation schemas for Batch
// ব্যাচ ভ্যালিডেশন স্কিমা
// ===================================================================

import { z } from 'zod';

const scheduleSchema = z.object({
    day: z.enum(['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
});

const createBatchSchema = z.object({
    body: z.object({
        course: z.string({ required_error: 'Course ID is required' }),
        instructor: z.string().optional(),
        batchName: z.string({ required_error: 'Batch name is required' }).min(1),
        batchCode: z.string({ required_error: 'Batch code is required' }).min(1),
        description: z.string().optional(),
        startDate: z.string({ required_error: 'Start date is required' }),
        endDate: z.string({ required_error: 'End date is required' }),
        enrollmentDeadline: z.string().optional(),
        maxStudents: z.number().min(1).default(50),
        schedule: z.array(scheduleSchema).optional(),
        isActive: z.boolean().optional(),
        meetingLink: z.string().url().optional().or(z.literal('')),
        platform: z.enum(['zoom', 'google_meet', 'microsoft_teams', 'custom']).optional(),
    }),
});

const updateBatchSchema = z.object({
    body: z.object({
        batchName: z.string().min(1).optional(),
        batchCode: z.string().min(1).optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        enrollmentDeadline: z.string().optional(),
        maxStudents: z.number().min(1).optional(),
        schedule: z.array(scheduleSchema).optional(),
        status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
        isActive: z.boolean().optional(),
        meetingLink: z.string().url().optional().or(z.literal('')),
        platform: z.enum(['zoom', 'google_meet', 'microsoft_teams', 'custom']).optional(),
    }),
});

const enrollStudentSchema = z.object({
    body: z.object({
        studentId: z.string({ required_error: 'Student ID is required' }),
    }),
});

export const BatchValidation = {
    createBatchSchema,
    updateBatchSchema,
    enrollStudentSchema,
};
