// ===================================================================
// MotionBoss LMS - Live Class Controller
// HTTP request handlers for Live Class
// লাইভ ক্লাস কন্ট্রোলার
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LiveClassService } from './liveClass.service';
import pick from '../../utils/pick';

// ==================== Create Live Class ====================
const createLiveClass = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.createLiveClass(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Live class created successfully',
        data: result,
    });
});

// ==================== Get All Live Classes ====================
const getAllLiveClasses = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['batch', 'instructor', 'status', 'classDate', 'searchTerm']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await LiveClassService.getAllLiveClasses(filters, {
        page: Number(options.page) || 1,
        limit: Number(options.limit) || 10,
        sortBy: options.sortBy as string,
        sortOrder: options.sortOrder as 'asc' | 'desc',
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live classes retrieved successfully',
        meta: {
            ...result.meta,
            totalPages: Math.ceil(result.meta.total / result.meta.limit),
        },
        data: result.data,
    });
});

// ==================== Get Classes by Batch ====================
const getClassesByBatch = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.getClassesByBatch(req.params.batchId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batch classes retrieved successfully',
        data: result,
    });
});

// ==================== Get Single Live Class ====================
const getLiveClassById = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.getLiveClassById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class retrieved successfully',
        data: result,
    });
});

// ==================== Update Live Class ====================
const updateLiveClass = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.updateLiveClass(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class updated successfully',
        data: result,
    });
});

// ==================== Delete Live Class ====================
const deleteLiveClass = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.deleteLiveClass(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class deleted successfully',
        data: result,
    });
});

// ==================== Update Status ====================
const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.updateClassStatus(req.params.id, req.body.status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Class status updated successfully',
        data: result,
    });
});

// ==================== Send Notification ====================
const sendNotification = catchAsync(async (req: Request, res: Response) => {
    await LiveClassService.sendManualNotification(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Notification sent successfully',
        data: null,
    });
});

// ==================== Add Attendee ====================
const addAttendee = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.addAttendee(req.params.id, req.body.studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Attendee added successfully',
        data: result,
    });
});

// ==================== Get My Upcoming Classes (Student) ====================
const getMyUpcomingClasses = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user._id;
    const result = await LiveClassService.getMyUpcomingClasses(studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Upcoming classes retrieved successfully',
        data: result,
    });
});

// ==================== Get Today's Classes ====================
const getTodayClasses = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.getTodayClasses();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Today's classes retrieved successfully",
        data: result,
    });
});

// ==================== Add Recording ====================
const addRecording = catchAsync(async (req: Request, res: Response) => {
    const { recordingUrl, recordingDuration } = req.body;
    const result = await LiveClassService.addRecording(req.params.id, recordingUrl, recordingDuration);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Recording added successfully',
        data: result,
    });
});

export const LiveClassController = {
    createLiveClass,
    getAllLiveClasses,
    getClassesByBatch,
    getLiveClassById,
    updateLiveClass,
    deleteLiveClass,
    updateStatus,
    sendNotification,
    addAttendee,
    getMyUpcomingClasses,
    getTodayClasses,
    addRecording,
};
