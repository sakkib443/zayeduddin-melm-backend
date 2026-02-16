// ===================================================================
// MotionBoss LMS - Instructor Controller
// HTTP handlers for Instructor module
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { InstructorService } from './instructor.service';
import catchAsync from '../../utils/catchAsync';

/**
 * Create Instructor (Admin Only)
 */
const createInstructor = catchAsync(async (req: Request, res: Response) => {
    const result = await InstructorService.createInstructor(req.body);
    res.status(201).json({
        success: true,
        message: 'Instructor created successfully',
        data: result,
    });
});

/**
 * Get All Instructors (Admin - with pagination)
 */
const getAllInstructors = catchAsync(async (req: Request, res: Response) => {
    const { searchTerm, status, isPublished, expertise, page = '1', limit = '10', sortBy, sortOrder } = req.query;

    const filters = {
        searchTerm: searchTerm as string,
        status: status as any,
        isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
        expertise: expertise as string,
    };

    const paginationOptions = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await InstructorService.getAllInstructors(filters, paginationOptions);
    res.status(200).json({
        success: true,
        message: 'Instructors retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Get Published Instructors (Public)
 */
const getPublishedInstructors = catchAsync(async (req: Request, res: Response) => {
    const result = await InstructorService.getPublishedInstructors();
    res.status(200).json({
        success: true,
        message: 'Published instructors retrieved successfully',
        data: result,
    });
});

/**
 * Get Single Instructor
 */
const getInstructorById = catchAsync(async (req: Request, res: Response) => {
    const result = await InstructorService.getInstructorById(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Instructor retrieved successfully',
        data: result,
    });
});

/**
 * Update Instructor (Admin Only)
 */
const updateInstructor = catchAsync(async (req: Request, res: Response) => {
    const result = await InstructorService.updateInstructor(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Instructor updated successfully',
        data: result,
    });
});

/**
 * Delete Instructor (Admin Only)
 */
const deleteInstructor = catchAsync(async (req: Request, res: Response) => {
    const result = await InstructorService.deleteInstructor(req.params.id);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export const InstructorController = {
    createInstructor,
    getAllInstructors,
    getPublishedInstructors,
    getInstructorById,
    updateInstructor,
    deleteInstructor,
};
