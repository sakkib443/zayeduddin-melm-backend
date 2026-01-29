// ===================================================================
// MotionBoss LMS - Batch Interface
// Batch module TypeScript interface definitions
// ব্যাচ মডিউলের TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * Batch Status Types
 */
export type TBatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Weekly Schedule Interface
 */
export interface IBatchSchedule {
    day: 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
    startTime: string;  // "10:00 AM"
    endTime: string;    // "12:00 PM"
}

/**
 * IBatch - Main Batch Interface
 * Course এর under এ batch data
 */
export interface IBatch {
    _id?: Types.ObjectId;

    // ==================== Core References ====================
    course: Types.ObjectId;           // Course reference (only online courses)
    instructor?: Types.ObjectId;      // Instructor/Mentor reference (optional)

    // ==================== Batch Info ====================
    batchName: string;                // "Batch-01", "Morning Batch"
    batchCode: string;                // "WEB-B01" (unique)
    description?: string;             // Batch description

    // ==================== Dates ====================
    startDate: Date;                  // Batch start date
    endDate: Date;                    // Batch end date
    enrollmentDeadline?: Date;        // Last date to enroll

    // ==================== Capacity ====================
    maxStudents: number;              // Maximum students allowed
    enrolledCount: number;            // Current enrolled count

    // ==================== Schedule ====================
    schedule: IBatchSchedule[];       // Weekly class schedule

    // ==================== Status ====================
    status: TBatchStatus;
    isActive: boolean;
    meetingLink?: string;             // Batch-wise meeting link
    platform?: 'zoom' | 'google_meet' | 'microsoft_teams' | 'custom';

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IBatchFilters - Query Filters
 */
export interface IBatchFilters {
    course?: string;
    instructor?: string;
    status?: TBatchStatus;
    isActive?: boolean;
    searchTerm?: string;
}

/**
 * BatchModel - Mongoose Model Type
 */
export interface BatchModel extends Model<IBatch> {
    isBatchFull(batchId: string): Promise<boolean>;
    getBatchesByCourse(courseId: string): Promise<IBatch[]>;
}
