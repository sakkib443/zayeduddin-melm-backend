// ===================================================================
// MotionBoss LMS - Instructor Routes
// Instructor module এর API endpoints
// ===================================================================

import express from 'express';
import { InstructorController } from './instructor.controller';
import { createInstructorValidation, updateInstructorValidation } from './instructor.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// Published instructors (for homepage, public pages)
router.get(
    '/published',
    InstructorController.getPublishedInstructors
);

// Get single instructor by ID (public)
router.get(
    '/:id',
    InstructorController.getInstructorById
);

// ==================== ADMIN ONLY ROUTES ====================
// Only admin can manage instructors

// Get all instructors (admin dashboard - with pagination & filters)
router.get(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    InstructorController.getAllInstructors
);

// Create new instructor (Admin only - creates user + instructor profile)
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(createInstructorValidation),
    InstructorController.createInstructor
);

// Update instructor (Admin only)
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(updateInstructorValidation),
    InstructorController.updateInstructor
);

// Delete instructor - soft delete (Admin only)
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    InstructorController.deleteInstructor
);

export const InstructorRoutes = router;
