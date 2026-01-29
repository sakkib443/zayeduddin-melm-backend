// ===================================================================
// MotionBoss LMS - Live Class Interface
// Live Class module TypeScript interface definitions
// লাইভ ক্লাস মডিউলের TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * Live Class Status Types
 */
export type TLiveClassStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

/**
 * ILiveClass - Main Live Class Interface
 * Batch এর under এ live class data
 */
export interface ILiveClass {
    _id?: Types.ObjectId;

    // ==================== Core References ====================
    batch: Types.ObjectId;            // Batch reference
    instructor: Types.ObjectId;       // Instructor reference

    // ==================== Class Info ====================
    title: string;                    // "Class 01 - JavaScript Basics"
    description?: string;             // Class description
    classNumber?: number;             // Class sequence number

    // ==================== Schedule ====================
    classDate: Date;                  // Class date
    startTime: string;                // "10:00 AM"
    endTime: string;                  // "12:00 PM"
    duration?: number;                // Duration in minutes

    // ==================== Meeting Details ====================
    meetingLink: string;              // Zoom/Meet/Custom link
    meetingId?: string;               // Meeting ID (optional)
    meetingPassword?: string;         // Meeting password (optional)
    platform?: 'zoom' | 'google_meet' | 'microsoft_teams' | 'custom';

    // ==================== Status & Recording ====================
    status: TLiveClassStatus;
    recordingUrl?: string;            // Recording URL after class
    recordingDuration?: number;       // Recording duration in minutes

    // ==================== Notifications ====================
    notificationSent: boolean;        // Initial notification sent
    reminderSent: boolean;            // 30 min reminder sent
    liveNotificationSent: boolean;    // "Class is live" notification

    // ==================== Attendance ====================
    attendees: Types.ObjectId[];      // Students who attended

    // ==================== Resources ====================
    resources?: {
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'link' | 'file';
    }[];

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * ILiveClassFilters - Query Filters
 */
export interface ILiveClassFilters {
    batch?: string;
    instructor?: string;
    status?: TLiveClassStatus;
    classDate?: string;
    searchTerm?: string;
}

/**
 * LiveClassModel - Mongoose Model Type
 */
export interface LiveClassModel extends Model<ILiveClass> {
    getUpcomingClasses(batchId: string): Promise<ILiveClass[]>;
    getTodayClasses(): Promise<ILiveClass[]>;
}
