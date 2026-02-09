// ===================================================================
// MotionBoss LMS - Batch Service
// Business logic for Batch operations
// ব্যাচ সার্ভিস - ব্যবসায়িক লজিক
// ===================================================================

import { IBatch, IBatchFilters } from './batch.interface';
import { Batch } from './batch.model';
import { Course } from '../course/course.model';
import { Enrollment } from '../enrollment/enrollment.model';
import AppError from '../../utils/AppError';
import { NotificationService } from '../notification/notification.module';


// ==================== Create Batch ====================
const createBatch = async (payload: IBatch): Promise<IBatch> => {
    // Check if course exists and is online type
    const course = await Course.findById(payload.course);
    if (!course) {
        throw new AppError(404, 'Course not found');
    }
    if (course.courseType !== 'online') {
        throw new AppError(400, 'Batches can only be created for online courses');
    }

    // Check for duplicate batch code
    const existingBatch = await Batch.findOne({ batchCode: payload.batchCode });
    if (existingBatch) {
        throw new AppError(400, 'Batch code already exists');
    }

    const batch = await Batch.create(payload);
    return batch;
};

// ==================== Get All Batches ====================
const getAllBatches = async (
    filters: IBatchFilters,
    options: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
): Promise<{ data: IBatch[]; meta: { total: number; page: number; limit: number } }> => {
    const { course, instructor, status, isActive, searchTerm } = filters;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const query: Record<string, unknown> = {};

    if (course) query.course = course;
    if (instructor) query.instructor = instructor;
    if (status) query.status = status;
    if (typeof isActive === 'boolean') query.isActive = isActive;

    if (searchTerm) {
        query.$or = [
            { batchName: { $regex: searchTerm, $options: 'i' } },
            { batchCode: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    const total = await Batch.countDocuments(query);
    const batches = await Batch.find(query)
        .populate('course', 'title slug thumbnail')
        .populate('instructor', 'name email avatar')
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        data: batches,
        meta: { total, page, limit },
    };
};

// ==================== Get Batches by Course ====================
const getBatchesByCourse = async (courseId: string): Promise<IBatch[]> => {
    const batches = await Batch.find({ course: courseId, isActive: true })
        .populate('instructor', 'name email avatar')
        .sort({ startDate: -1 });
    return batches;
};

// ==================== Get Single Batch ====================
const getBatchById = async (id: string): Promise<IBatch> => {
    const batch = await Batch.findById(id)
        .populate('course', 'title slug thumbnail courseType')
        .populate('instructor', 'name email avatar');

    if (!batch) {
        throw new AppError(404, 'Batch not found');
    }
    return batch;
};

// ==================== Update Batch ====================
const updateBatch = async (id: string, payload: Partial<IBatch>): Promise<IBatch> => {
    // Get original batch to check if meetingLink is being added/updated
    const originalBatch = await Batch.findById(id);
    const isNewMeetingLink = payload.meetingLink && (!originalBatch?.meetingLink || originalBatch.meetingLink !== payload.meetingLink);

    const batch = await Batch.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
        .populate('course', 'title slug thumbnail')
        .populate('instructor', 'name email avatar');

    if (!batch) {
        throw new AppError(404, 'Batch not found');
    }

    // Send notifications to enrolled students when meeting link is added/updated
    if (isNewMeetingLink) {
        try {
            // Find all students enrolled in courses that this batch belongs to
            const enrollments = await Enrollment.find({
                course: batch.course,
                status: 'active'
            }).select('student');

            const courseTitle = (batch.course as any)?.title || 'your course';

            // Send notification to each student
            for (const enrollment of enrollments) {
                await NotificationService.createNotification({
                    type: 'live_class' as any,
                    title: '🎥 Live Class Link Added!',
                    message: `A live class link has been added for "${batch.batchName}" (${courseTitle}). Join your scheduled classes now!`,
                    data: {
                        batchId: batch._id,
                        link: '/dashboard/user/live-classes',
                        meetingLink: payload.meetingLink,
                    } as any,
                    isRead: false,
                    forAdmin: false,
                    forUser: enrollment.student,
                });
            }

            console.log(`Notifications sent to ${enrollments.length} students for batch ${batch.batchName}`);
        } catch (error) {
            console.error('Error sending batch notifications:', error);
            // Don't throw error, just log it - notifications are not critical
        }
    }

    return batch;
};


// ==================== Delete Batch ====================
const deleteBatch = async (id: string): Promise<IBatch> => {
    // Check if batch has enrolled students
    const enrollmentCount = await Enrollment.countDocuments({ batch: id });
    if (enrollmentCount > 0) {
        throw new AppError(400, `Cannot delete batch with ${enrollmentCount} enrolled students`);
    }

    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) {
        throw new AppError(404, 'Batch not found');
    }
    return batch;
};

// ==================== Enroll Student to Batch ====================
const enrollStudentToBatch = async (batchId: string, studentId: string): Promise<IBatch> => {
    const batch = await Batch.findById(batchId);
    if (!batch) {
        throw new AppError(404, 'Batch not found');
    }

    if (batch.enrolledCount >= batch.maxStudents) {
        throw new AppError(400, 'Batch is full');
    }

    // Check enrollment deadline
    if (batch.enrollmentDeadline && new Date() > batch.enrollmentDeadline) {
        throw new AppError(400, 'Enrollment deadline has passed');
    }

    // Check if student is already enrolled in course
    const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: batch.course,
    });

    if (!existingEnrollment) {
        throw new AppError(400, 'Student must be enrolled in the course first');
    }

    // Check if already in a batch for this course
    if (existingEnrollment.batch) {
        throw new AppError(400, 'Student is already enrolled in a batch for this course');
    }

    // Update enrollment with batch
    await Enrollment.findByIdAndUpdate(existingEnrollment._id, { batch: batchId });

    // Increment enrolled count
    const updatedBatch = await Batch.findByIdAndUpdate(
        batchId,
        { $inc: { enrolledCount: 1 } },
        { new: true }
    );

    return updatedBatch as IBatch;
};

// ==================== Get Batch Students ====================
const getBatchStudents = async (batchId: string) => {
    const enrollments = await Enrollment.find({ batch: batchId })
        .populate('student', 'name email avatar phone')
        .populate('course', 'title')
        .sort({ enrolledAt: -1 });

    return enrollments;
};

// ==================== Remove Student from Batch ====================
const removeStudentFromBatch = async (batchId: string, studentId: string): Promise<void> => {
    const enrollment = await Enrollment.findOne({ batch: batchId, student: studentId });
    if (!enrollment) {
        throw new AppError(404, 'Student not found in this batch');
    }

    await Enrollment.findByIdAndUpdate(enrollment._id, { $unset: { batch: 1 } });
    await Batch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: -1 } });
};

// ==================== Get My Batches (Student) ====================
const getMyBatches = async (studentId: string) => {
    console.log('=== getMyBatches called ===');
    console.log('Student ID:', studentId);

    // First, get all courses the student is enrolled in
    const enrollments = await Enrollment.find({
        student: studentId,
    }).select('course batch status');

    console.log('Enrollments found:', enrollments.length);
    console.log('Enrollments:', JSON.stringify(enrollments, null, 2));

    if (enrollments.length === 0) {
        console.log('No enrollments found for student');
        return [];
    }

    const courseIds = enrollments.map(e => e.course);
    const directBatchIds = enrollments.map(e => e.batch).filter(Boolean);

    console.log('Course IDs:', courseIds);
    console.log('Direct Batch IDs:', directBatchIds);

    // Find ALL batches for courses the student is enrolled in
    const batches = await Batch.find({
        course: { $in: courseIds }
    })
        .populate('course', 'title slug thumbnail')
        .populate('instructor', 'name email avatar')
        .sort({ startDate: -1 });

    console.log('Batches found:', batches.length);
    if (batches.length > 0) {
        console.log('Batch details:', batches.map(b => ({
            id: b._id,
            name: b.batchName,
            courseId: b.course,
            status: b.status,
            isActive: b.isActive
        })));
    } else {
        // Check if any batches exist at all
        const allBatches = await Batch.find({}).select('course batchName status isActive');
        console.log('All batches in DB:', JSON.stringify(allBatches, null, 2));
    }

    return batches;
};



export const BatchService = {
    createBatch,
    getAllBatches,
    getBatchesByCourse,
    getBatchById,
    updateBatch,
    deleteBatch,
    enrollStudentToBatch,
    getBatchStudents,
    removeStudentFromBatch,
    getMyBatches,
};
