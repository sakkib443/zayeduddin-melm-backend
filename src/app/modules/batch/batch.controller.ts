// ===================================================================
// MotionBoss LMS - Batch Controller
// HTTP request handlers for Batch
// ব্যাচ কন্ট্রোলার
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BatchService } from './batch.service';
import pick from '../../utils/pick';

// ==================== Create Batch ====================
const createBatch = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.createBatch(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Batch created successfully',
        data: result,
    });
});

// ==================== Get All Batches ====================
const getAllBatches = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['course', 'instructor', 'status', 'isActive', 'searchTerm']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await BatchService.getAllBatches(filters, {
        page: Number(options.page) || 1,
        limit: Number(options.limit) || 10,
        sortBy: options.sortBy as string,
        sortOrder: options.sortOrder as 'asc' | 'desc',
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batches retrieved successfully',
        meta: {
            ...result.meta,
            totalPages: Math.ceil(result.meta.total / result.meta.limit),
        },
        data: result.data,
    });
});

// ==================== Get Batches by Course ====================
const getBatchesByCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.getBatchesByCourse(req.params.courseId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Course batches retrieved successfully',
        data: result,
    });
});

// ==================== Get Single Batch ====================
const getBatchById = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.getBatchById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batch retrieved successfully',
        data: result,
    });
});

// ==================== Update Batch ====================
const updateBatch = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.updateBatch(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batch updated successfully',
        data: result,
    });
});

// ==================== Delete Batch ====================
const deleteBatch = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.deleteBatch(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batch deleted successfully',
        data: result,
    });
});

// ==================== Enroll Student ====================
const enrollStudent = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.enrollStudentToBatch(req.params.id, req.body.studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Student enrolled to batch successfully',
        data: result,
    });
});

// ==================== Get Batch Students ====================
const getBatchStudents = catchAsync(async (req: Request, res: Response) => {
    const result = await BatchService.getBatchStudents(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Batch students retrieved successfully',
        data: result,
    });
});

// ==================== Remove Student ====================
const removeStudent = catchAsync(async (req: Request, res: Response) => {
    await BatchService.removeStudentFromBatch(req.params.id, req.params.studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Student removed from batch successfully',
        data: null,
    });
});

// ==================== Get My Batches (Student) ====================
const getMyBatches = catchAsync(async (req: Request, res: Response) => {
    const studentId = (req as any).user._id;
    const result = await BatchService.getMyBatches(studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'My batches retrieved successfully',
        data: result,
    });
});

export const BatchController = {
    createBatch,
    getAllBatches,
    getBatchesByCourse,
    getBatchById,
    updateBatch,
    deleteBatch,
    enrollStudent,
    getBatchStudents,
    removeStudent,
    getMyBatches,
};
