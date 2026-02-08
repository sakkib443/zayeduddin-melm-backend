import express from 'express';
import { DesignTemplateController } from './designTemplate.controller';

import validateRequest from '../../middlewares/validateRequest';
import { authMiddleware, authorizeRoles, optionalAuth } from '../../middlewares/auth';
import { createDesignTemplateValidation, updateDesignTemplateValidation, designTemplateQueryValidation } from './designTemplate.validation';
import { uploadDesignTemplateImages, uploadDesignTemplateFile } from '../../utils/cloudinary';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// GET /api/design-templates - Get all approved templates
router.get('/', validateRequest(designTemplateQueryValidation), DesignTemplateController.getAllDesignTemplates);

// GET /api/design-templates/featured - Get featured templates
router.get('/featured', DesignTemplateController.getFeaturedDesignTemplates);

// GET /api/design-templates/slug/:slug - Get by slug
router.get('/slug/:slug', optionalAuth, DesignTemplateController.getDesignTemplateBySlug);

// ==================== ADMIN/MENTOR ROUTES ====================

// POST /api/design-templates/admin/upload-images - Upload images to Cloudinary
router.post(
    '/admin/upload-images',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    uploadDesignTemplateImages,
    DesignTemplateController.uploadImages
);

// POST /api/design-templates/admin/upload-file - Upload download file to Cloudinary
router.post(
    '/admin/upload-file',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    uploadDesignTemplateFile,
    DesignTemplateController.uploadDownloadFile
);

// POST /api/design-templates/admin - Create new template
router.post(
    '/admin',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    validateRequest(createDesignTemplateValidation),
    DesignTemplateController.createDesignTemplate
);

// PATCH /api/design-templates/admin/managed/:id - Update template
router.patch(
    '/admin/managed/:id',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    validateRequest(updateDesignTemplateValidation),
    DesignTemplateController.updateDesignTemplate
);

// DELETE /api/design-templates/admin/managed/:id - Delete template
router.delete(
    '/admin/managed/:id',
    authMiddleware,
    authorizeRoles('admin'),
    DesignTemplateController.deleteDesignTemplate
);

// GET /api/design-templates/admin/all - Get all templates (for admin)
router.get(
    '/admin/all',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    DesignTemplateController.getAdminDesignTemplates
);

// PATCH /api/design-templates/admin/:id/status - Approve/Reject template
router.patch(
    '/admin/:id/status',
    authMiddleware,
    authorizeRoles('admin', 'mentor'),
    DesignTemplateController.updateDesignTemplateStatus
);

// ==================== DYNAMIC ID ROUTES ====================

// GET /api/design-templates/:id/download - Download file (authenticated)
router.get(
    '/:id/download',
    authMiddleware,
    DesignTemplateController.downloadFile
);

// POST /api/design-templates/:id/like - Toggle like
router.post(
    '/:id/like',
    authMiddleware,
    DesignTemplateController.toggleLike
);

// GET /api/design-templates/:id - Get by ID
router.get('/:id', optionalAuth, DesignTemplateController.getDesignTemplateById);

export const DesignTemplateRoutes = router;
