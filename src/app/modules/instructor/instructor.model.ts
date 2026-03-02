// ===================================================================
// MotionBoss LMS - Instructor Model
// MongoDB Instructor Schema with Mongoose
// ===================================================================

import { Schema, model } from 'mongoose';
import { IInstructor, InstructorModel } from './instructor.interface';

/**
 * Instructor Schema Definition
 */
const instructorSchema = new Schema<IInstructor, InstructorModel>(
    {
        // ==================== User Reference ====================
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            unique: true,
        },

        // ==================== Basic Info ====================
        title: {
            type: String,
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            default: '',
        },
        titleBn: {
            type: String,
            trim: true,
            default: '',
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: '',
        },
        bioBn: {
            type: String,
            default: '',
        },
        longBio: {
            type: String,
            default: '',
        },
        longBioBn: {
            type: String,
            default: '',
        },

        // ==================== Media ====================
        avatar: {
            type: String,
            default: '',
        },
        coverImage: {
            type: String,
            default: '',
        },

        // ==================== Professional Info ====================
        expertise: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            default: 0,
            min: [0, 'Experience cannot be negative'],
        },
        specializations: {
            type: Number,
            default: 0,
            min: [0, 'Specializations cannot be negative'],
        },
        education: {
            type: [String],
            default: [],
        },
        workExperience: {
            type: [String],
            default: [],
        },
        certifications: {
            type: [String],
            default: [],
        },


        // ==================== Contact ====================
        whatsAppNumber: {
            type: String,
            default: '',
        },

        // ==================== Social Links ====================
        socialLinks: {
            facebook: { type: String, default: '' },
            twitter: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            youtube: { type: String, default: '' },
            github: { type: String, default: '' },
            instagram: { type: String, default: '' },
            website: { type: String, default: '' },
        },

        // ==================== Course References ====================
        assignedCourses: [{
            type: Schema.Types.ObjectId,
            ref: 'Course',
        }],

        // ==================== Statistics ====================
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        totalStudents: {
            type: Number,
            default: 0,
        },
        totalCourses: {
            type: Number,
            default: 0,
        },

        // ==================== Status & Visibility ====================
        status: {
            type: String,
            enum: {
                values: ['active', 'inactive'],
                message: '{VALUE} is not a valid status',
            },
            default: 'active',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// ==================== Indexes ====================
instructorSchema.index({ userId: 1 });
instructorSchema.index({ status: 1, isPublished: 1 });
instructorSchema.index({ order: 1 });

// ==================== Pre-find middleware ====================
// Deleted instructors কে query থেকে বাদ দেওয়া
instructorSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

instructorSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

// ==================== Static Methods ====================
instructorSchema.statics.isInstructorExists = async function (id: string) {
    const instructor = await this.findById(id);
    return !!instructor;
};

// ==================== Export Model ====================
export const Instructor = model<IInstructor, InstructorModel>('Instructor', instructorSchema);
