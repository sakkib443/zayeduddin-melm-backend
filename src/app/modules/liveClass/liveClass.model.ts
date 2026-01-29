// ===================================================================
// MotionBoss LMS - Live Class Model
// MongoDB Schema for Live Class
// লাইভ ক্লাস মডেল - MongoDB Schema
// ===================================================================

import { Schema, model } from 'mongoose';
import { ILiveClass, LiveClassModel } from './liveClass.interface';

const resourceSchema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: {
            type: String,
            enum: ['pdf', 'video', 'link', 'file'],
            default: 'file',
        },
    },
    { _id: false }
);

const liveClassSchema = new Schema<ILiveClass, LiveClassModel>(
    {
        batch: {
            type: Schema.Types.ObjectId,
            ref: 'Batch',
            required: [true, 'Batch is required'],
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        classNumber: {
            type: Number,
            min: 1,
        },
        classDate: {
            type: Date,
        },
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
        duration: {
            type: Number,
            min: 0,
        },
        meetingLink: {
            type: String,
        },
        meetingId: {
            type: String,
        },
        meetingPassword: {
            type: String,
        },
        platform: {
            type: String,
            enum: ['zoom', 'google_meet', 'microsoft_teams', 'custom'],
            default: 'zoom',
        },
        status: {
            type: String,
            enum: ['scheduled', 'live', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        recordingUrl: {
            type: String,
        },
        recordingDuration: {
            type: Number,
        },
        notificationSent: {
            type: Boolean,
            default: false,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        liveNotificationSent: {
            type: Boolean,
            default: false,
        },
        attendees: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        resources: {
            type: [resourceSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ==================== Indexes ====================
liveClassSchema.index({ batch: 1, classDate: 1 });
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ status: 1, classDate: 1 });
liveClassSchema.index({ classDate: 1 });

// ==================== Virtual Fields ====================
liveClassSchema.virtual('isUpcoming').get(function () {
    return this.status === 'scheduled' && new Date(this.classDate) > new Date();
});

liveClassSchema.virtual('attendeeCount').get(function () {
    return this.attendees?.length || 0;
});

// ==================== Static Methods ====================
liveClassSchema.statics.getUpcomingClasses = async function (batchId: string): Promise<ILiveClass[]> {
    const now = new Date();
    return this.find({
        batch: batchId,
        classDate: { $gte: now },
        status: { $in: ['scheduled', 'live'] },
    })
        .sort({ classDate: 1 })
        .populate('instructor', 'name avatar');
};

liveClassSchema.statics.getTodayClasses = async function (): Promise<ILiveClass[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.find({
        classDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['scheduled', 'live'] },
    })
        .populate('batch', 'batchName batchCode course')
        .populate('instructor', 'name avatar')
        .sort({ startTime: 1 });
};

export const LiveClass = model<ILiveClass, LiveClassModel>('LiveClass', liveClassSchema);
