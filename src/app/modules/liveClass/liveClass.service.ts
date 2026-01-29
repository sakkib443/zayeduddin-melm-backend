// ===================================================================
// MotionBoss LMS - Live Class Service
// Business logic for Live Class operations
// লাইভ ক্লাস সার্ভিস - ব্যবসায়িক লজিক
// ===================================================================

import { ILiveClass, ILiveClassFilters } from './liveClass.interface';
import { LiveClass } from './liveClass.model';
import { Batch } from '../batch/batch.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { Notification } from '../notification/notification.module';
import AppError from '../../utils/AppError';

// ==================== Create Live Class ====================
const createLiveClass = async (payload: ILiveClass): Promise<ILiveClass> => {
    // Check if batch exists
    const batch = await Batch.findById(payload.batch);
    if (!batch) {
        throw new AppError(404, 'Batch not found');
    }

    // Auto-assign class number if not provided
    if (!payload.classNumber) {
        const lastClass = await LiveClass.findOne({ batch: payload.batch })
            .sort({ classNumber: -1 });
        payload.classNumber = (lastClass?.classNumber || 0) + 1;
    }

    const liveClass = await LiveClass.create(payload);

    // Send notification to batch students
    await sendClassNotification(liveClass, 'scheduled');

    return liveClass;
};

// ==================== Get All Live Classes ====================
const getAllLiveClasses = async (
    filters: ILiveClassFilters,
    options: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<{ data: ILiveClass[]; meta: { total: number; page: number; limit: number } }> => {
    const { batch, instructor, status, classDate, searchTerm } = filters;
    const { page = 1, limit = 10, sortBy = 'classDate', sortOrder = 'desc' } = options;

    const query: Record<string, unknown> = {};

    if (batch) query.batch = batch;
    if (instructor) query.instructor = instructor;
    if (status) query.status = status;

    if (classDate) {
        const date = new Date(classDate);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        query.classDate = { $gte: date, $lt: nextDay };
    }

    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    const total = await LiveClass.countDocuments(query);
    const classes = await LiveClass.find(query)
        .populate({
            path: 'batch',
            select: 'batchName batchCode course',
            populate: { path: 'course', select: 'title slug' },
        })
        .populate('instructor', 'name email avatar')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        data: classes,
        meta: { total, page, limit },
    };
};

// ==================== Get Classes by Batch ====================
const getClassesByBatch = async (batchId: string): Promise<ILiveClass[]> => {
    const classes = await LiveClass.find({ batch: batchId })
        .populate('instructor', 'name avatar')
        .sort({ classDate: 1, startTime: 1 });
    return classes;
};

// ==================== Get Single Live Class ====================
const getLiveClassById = async (id: string): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findById(id)
        .populate({
            path: 'batch',
            select: 'batchName batchCode course enrolledCount',
            populate: { path: 'course', select: 'title slug thumbnail' },
        })
        .populate('instructor', 'name email avatar')
        .populate('attendees', 'name email avatar');

    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }
    return liveClass;
};

// ==================== Update Live Class ====================
const updateLiveClass = async (id: string, payload: Partial<ILiveClass>): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
        .populate({
            path: 'batch',
            select: 'batchName batchCode',
        })
        .populate('instructor', 'name avatar');

    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    // If class rescheduled, notify students
    if (payload.classDate || payload.startTime) {
        await sendClassNotification(liveClass, 'rescheduled');
    }

    return liveClass;
};

// ==================== Delete Live Class ====================
const deleteLiveClass = async (id: string): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    // Notify students about cancellation
    await sendClassNotification(liveClass, 'cancelled');

    await LiveClass.findByIdAndDelete(id);
    return liveClass;
};

// ==================== Update Class Status ====================
const updateClassStatus = async (id: string, status: string): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    liveClass.status = status as any;

    // Send appropriate notification
    if (status === 'live' && !liveClass.liveNotificationSent) {
        await sendClassNotification(liveClass, 'live');
        liveClass.liveNotificationSent = true;
    } else if (status === 'completed') {
        await sendClassNotification(liveClass, 'completed');
    } else if (status === 'cancelled') {
        await sendClassNotification(liveClass, 'cancelled');
    }

    await liveClass.save();
    return liveClass;
};

// ==================== Send Notification to Batch Students ====================
const sendClassNotification = async (
    liveClass: ILiveClass,
    type: 'scheduled' | 'rescheduled' | 'live' | 'completed' | 'cancelled' | 'reminder'
): Promise<void> => {
    try {
        // Get all students enrolled in the batch
        const enrollments = await Enrollment.find({ batch: liveClass.batch }).select('student');
        const studentIds = enrollments.map((e) => e.student);

        if (studentIds.length === 0) return;

        let title = '';
        let message = '';

        switch (type) {
            case 'scheduled':
                title = '📅 New Class Scheduled';
                message = `A new class "${liveClass.title}" has been scheduled for your batch.`;
                break;
            case 'rescheduled':
                title = '🔄 Class Rescheduled';
                message = `The class "${liveClass.title}" has been rescheduled. Please check the new timing.`;
                break;
            case 'live':
                title = '🔴 Class is Live!';
                message = `"${liveClass.title}" is now live! Join now.`;
                break;
            case 'completed':
                title = '✅ Class Completed';
                message = `"${liveClass.title}" has ended. Recording will be available soon.`;
                break;
            case 'cancelled':
                title = '❌ Class Cancelled';
                message = `"${liveClass.title}" has been cancelled.`;
                break;
            case 'reminder':
                title = '⏰ Class Starting Soon';
                message = `"${liveClass.title}" will start in 30 minutes!`;
                break;
        }

        // Create notifications for all students
        const notifications = studentIds.map((studentId) => ({
            user: studentId,
            title,
            message,
            type: 'live_class',
            data: {
                liveClassId: liveClass._id,
                batchId: liveClass.batch,
                meetingLink: type === 'live' ? liveClass.meetingLink : undefined,
            },
        }));

        await Notification.insertMany(notifications);
    } catch (error) {
        console.error('Error sending class notification:', error);
    }
};

// ==================== Send Manual Notification ====================
const sendManualNotification = async (id: string): Promise<void> => {
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    await sendClassNotification(liveClass, 'scheduled');
    liveClass.notificationSent = true;
    await liveClass.save();
};

// ==================== Add Attendee ====================
const addAttendee = async (classId: string, studentId: string): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findByIdAndUpdate(
        classId,
        { $addToSet: { attendees: studentId } },
        { new: true }
    );

    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }
    return liveClass;
};

// ==================== Get My Upcoming Classes (Student) ====================
const getMyUpcomingClasses = async (studentId: string) => {
    // Get batches where student is enrolled
    const enrollments = await Enrollment.find({
        student: studentId,
        batch: { $exists: true },
    }).select('batch');

    const batchIds = enrollments.map((e) => e.batch);

    if (batchIds.length === 0) return [];

    // Get upcoming classes for those batches
    const now = new Date();
    const classes = await LiveClass.find({
        batch: { $in: batchIds },
        classDate: { $gte: now },
        status: { $in: ['scheduled', 'live'] },
    })
        .populate({
            path: 'batch',
            select: 'batchName batchCode course',
            populate: { path: 'course', select: 'title thumbnail' },
        })
        .populate('instructor', 'name avatar')
        .sort({ classDate: 1 })
        .limit(20);

    return classes;
};

// ==================== Get Today's Classes ====================
const getTodayClasses = async () => {
    return LiveClass.getTodayClasses();
};

// ==================== Add Recording ====================
const addRecording = async (id: string, recordingUrl: string, recordingDuration?: number): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findByIdAndUpdate(
        id,
        {
            recordingUrl,
            recordingDuration,
            status: 'completed',
        },
        { new: true }
    );

    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    // Notify students about recording
    await sendClassNotification(liveClass, 'completed');

    return liveClass;
};

export const LiveClassService = {
    createLiveClass,
    getAllLiveClasses,
    getClassesByBatch,
    getLiveClassById,
    updateLiveClass,
    deleteLiveClass,
    updateClassStatus,
    sendManualNotification,
    addAttendee,
    getMyUpcomingClasses,
    getTodayClasses,
    addRecording,
};
