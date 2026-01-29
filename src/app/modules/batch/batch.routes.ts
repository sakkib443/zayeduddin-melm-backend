// ===================================================================
// MotionBoss LMS - Batch Routes
// API routes for Batch module
// ব্যাচ রাউটস
// ===================================================================

import express from 'express';
import { BatchController } from './batch.controller';
import { BatchValidation } from './batch.validation';
import { authMiddleware } from '../../middlewares/auth';
import { checkRole } from '../../middlewares/chackRole';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== Admin Routes ====================
router.post(
    '/',
    authMiddleware,
    checkRole('admin', 'mentor'),
    validateRequest(BatchValidation.createBatchSchema),
    BatchController.createBatch
);

router.get(
    '/',
    authMiddleware,
    checkRole('admin', 'mentor'),
    BatchController.getAllBatches
);

router.get(
    '/course/:courseId',
    authMiddleware,
    BatchController.getBatchesByCourse
);

router.get(
    '/my-batches',
    authMiddleware,
    BatchController.getMyBatches
);

router.get(
    '/:id',
    authMiddleware,
    BatchController.getBatchById
);

router.patch(
    '/:id',
    authMiddleware,
    checkRole('admin', 'mentor'),
    validateRequest(BatchValidation.updateBatchSchema),
    BatchController.updateBatch
);

router.delete(
    '/:id',
    authMiddleware,
    checkRole('admin'),
    BatchController.deleteBatch
);

// ==================== Student Management ====================
router.post(
    '/:id/enroll',
    authMiddleware,
    checkRole('admin', 'mentor'),
    validateRequest(BatchValidation.enrollStudentSchema),
    BatchController.enrollStudent
);

router.get(
    '/:id/students',
    authMiddleware,
    checkRole('admin', 'mentor'),
    BatchController.getBatchStudents
);

router.delete(
    '/:id/students/:studentId',
    authMiddleware,
    checkRole('admin', 'mentor'),
    BatchController.removeStudent
);

export const BatchRoutes = router;
