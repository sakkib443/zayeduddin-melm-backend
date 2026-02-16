// ===================================================================
// MotionBoss LMS - Live Class Routes
// API routes for Live Class module
// লাইভ ক্লাস রাউটস
// ===================================================================

import express from 'express';
import { LiveClassController } from './liveClass.controller';
import { LiveClassValidation } from './liveClass.validation';
import { authMiddleware } from '../../middlewares/auth';
import { checkRole } from '../../middlewares/chackRole';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== Student Routes ====================
router.get(
    '/my-classes',
    authMiddleware,
    LiveClassController.getMyUpcomingClasses
);

// ==================== Admin Routes ====================
router.post(
    '/',
    authMiddleware,
    checkRole('admin', 'instructor'),
    validateRequest(LiveClassValidation.createLiveClassSchema),
    LiveClassController.createLiveClass
);

router.get(
    '/',
    authMiddleware,
    checkRole('admin', 'instructor'),
    LiveClassController.getAllLiveClasses
);

router.get(
    '/today',
    authMiddleware,
    checkRole('admin', 'instructor'),
    LiveClassController.getTodayClasses
);

router.get(
    '/batch/:batchId',
    authMiddleware,
    LiveClassController.getClassesByBatch
);

router.get(
    '/:id',
    authMiddleware,
    LiveClassController.getLiveClassById
);

router.patch(
    '/:id',
    authMiddleware,
    checkRole('admin', 'instructor'),
    validateRequest(LiveClassValidation.updateLiveClassSchema),
    LiveClassController.updateLiveClass
);

router.delete(
    '/:id',
    authMiddleware,
    checkRole('admin', 'instructor'),
    LiveClassController.deleteLiveClass
);

// ==================== Status & Notifications ====================
router.patch(
    '/:id/status',
    authMiddleware,
    checkRole('admin', 'instructor'),
    validateRequest(LiveClassValidation.updateStatusSchema),
    LiveClassController.updateStatus
);

router.post(
    '/:id/notify',
    authMiddleware,
    checkRole('admin', 'instructor'),
    LiveClassController.sendNotification
);

router.post(
    '/:id/recording',
    authMiddleware,
    checkRole('admin', 'instructor'),
    LiveClassController.addRecording
);

// ==================== Attendance ====================
router.post(
    '/:id/attendee',
    authMiddleware,
    validateRequest(LiveClassValidation.addAttendeeSchema),
    LiveClassController.addAttendee
);

export const LiveClassRoutes = router;
