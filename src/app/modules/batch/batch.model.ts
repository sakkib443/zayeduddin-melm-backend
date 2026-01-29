// ===================================================================
// MotionBoss LMS - Batch Model
// MongoDB Schema for Batch
// ব্যাচ মডেল - MongoDB Schema
// ===================================================================

import { Schema, model } from 'mongoose';
import { IBatch, BatchModel } from './batch.interface';

const batchScheduleSchema = new Schema(
    {
        day: {
            type: String,
            enum: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const batchSchema = new Schema<IBatch, BatchModel>(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        batchName: {
            type: String,
            required: [true, 'Batch name is required'],
            trim: true,
        },
        batchCode: {
            type: String,
            required: [true, 'Batch code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        enrollmentDeadline: {
            type: Date,
        },
        maxStudents: {
            type: Number,
            required: [true, 'Maximum students is required'],
            min: [1, 'At least 1 student required'],
            default: 50,
        },
        enrolledCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        schedule: {
            type: [batchScheduleSchema],
            default: [],
        },
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            default: 'upcoming',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        meetingLink: {
            type: String,
            trim: true,
        },
        platform: {
            type: String,
            enum: ['zoom', 'google_meet', 'microsoft_teams', 'custom'],
            default: 'zoom',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
batchSchema.index({ course: 1, status: 1 });
batchSchema.index({ batchCode: 1 }, { unique: true });
batchSchema.index({ instructor: 1 });
batchSchema.index({ startDate: 1, endDate: 1 });

// ==================== Virtual Fields ====================
batchSchema.virtual('availableSeats').get(function () {
    return this.maxStudents - this.enrolledCount;
});

batchSchema.virtual('isFull').get(function () {
    return this.enrolledCount >= this.maxStudents;
});

// ==================== Static Methods ====================
batchSchema.statics.isBatchFull = async function (batchId: string): Promise<boolean> {
    const batch = await this.findById(batchId);
    if (!batch) return true;
    return batch.enrolledCount >= batch.maxStudents;
};

batchSchema.statics.getBatchesByCourse = async function (courseId: string): Promise<IBatch[]> {
    return this.find({ course: courseId, isActive: true }).sort({ startDate: -1 });
};

// ==================== Pre-save Middleware ====================
batchSchema.pre('save', function (next) {
    // Auto-update status based on dates
    const now = new Date();
    if (this.startDate > now) {
        this.status = 'upcoming';
    } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'ongoing';
    } else if (this.endDate < now) {
        this.status = 'completed';
    }
    next();
});

export const Batch = model<IBatch, BatchModel>('Batch', batchSchema);
