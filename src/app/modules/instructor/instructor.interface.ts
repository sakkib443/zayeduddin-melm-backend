// ===================================================================
// MotionBoss LMS - Instructor Interface
// Instructor module TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * Instructor Status
 */
export type TInstructorStatus = 'active' | 'inactive';

/**
 * IInstructor - Main Instructor Interface
 * Database এ যে format এ instructor data save হবে
 */
export interface IInstructor {
    _id?: Types.ObjectId;

    // ==================== User Reference ====================
    userId: Types.ObjectId;             // Reference to User (role: instructor)

    // ==================== Basic Info ====================
    title: string;                      // e.g. "Senior UI/UX Designer"
    titleBn?: string;                   // Title in Bengali
    bio: string;                        // Short biography
    bioBn?: string;                     // Bio in Bengali
    longBio?: string;                   // Detailed biography
    longBioBn?: string;                 // Detailed bio in Bengali

    // ==================== Media ====================
    avatar?: string;                    // Profile image
    coverImage?: string;                // Cover/banner image

    // ==================== Professional Info ====================
    expertise: string[];                // Areas of expertise
    experience: number;                 // Years of experience
    education?: string;                 // Educational background
    certifications?: string[];          // Professional certifications

    // ==================== Social Links ====================
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        github?: string;
        instagram?: string;
        website?: string;
    };

    // ==================== Course References ====================
    assignedCourses?: Types.ObjectId[]; // Courses assigned to this instructor

    // ==================== Statistics ====================
    rating: number;                     // Average rating
    reviewCount: number;                // Total reviews
    totalStudents: number;              // Total students taught
    totalCourses: number;               // Total courses

    // ==================== Status & Visibility ====================
    status: TInstructorStatus;          // Active/Inactive
    isPublished: boolean;               // Show on public pages
    isDeleted: boolean;                 // Soft delete
    order: number;                      // Display order

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IInstructorFilters - Query Filters
 */
export interface IInstructorFilters {
    searchTerm?: string;
    status?: TInstructorStatus;
    isPublished?: boolean;
    expertise?: string;
}

/**
 * InstructorModel - Mongoose Model Type
 */
export interface InstructorModel extends Model<IInstructor> {
    isInstructorExists(id: string): Promise<boolean>;
}
