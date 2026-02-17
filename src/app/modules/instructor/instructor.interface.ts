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
    title: string;                      // e.g. "UX/UI Designer"
    titleBn?: string;                   // Title in Bengali
    bio: string;                        // Short biography (card display)
    bioBn?: string;                     // Bio in Bengali
    longBio?: string;                   // Life Journey / Detailed biography
    longBioBn?: string;                 // Detailed bio in Bengali

    // ==================== Media ====================
    avatar?: string;                    // Profile image URL
    coverImage?: string;                // Cover/banner image URL

    // ==================== Professional Info ====================
    expertise: string[];                // e.g. ["User Experience Design", "Figma", "Adobe XD"]
    experience: number;                 // Years of experience (e.g. 16)
    specializations: number;            // Total specialization count (e.g. 5)
    education: string[];                // e.g. ["BSc in Computer Science", "Diploma in UX/UI Design"]
    workExperience: string[];           // e.g. ["Lead UX Designer at Creative IT", "Freelance Designer"]
    certifications?: string[];          // Professional certifications

    // ==================== Contact ====================
    whatsAppNumber?: string;            // WhatsApp contact number

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
    totalStudents: number;              // Total students taught (e.g. 2500)
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
