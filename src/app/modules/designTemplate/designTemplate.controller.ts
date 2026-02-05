import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DesignTemplateService } from './designTemplate.service';

import pick from '../../utils/pick';
import { IDesignTemplateFilters, IDesignTemplateQuery } from './designTemplate.interface';
import AppError from '../../utils/AppError';

export const DesignTemplateController = {

    // ==================== CREATE (Seller/Admin) ====================
    createDesignTemplate: catchAsync(async (req: Request, res: Response) => {
        const template = await DesignTemplateService.createDesignTemplate(req.body);


        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Design template created successfully. Pending approval.',
            data: template,
        });
    }),

    // ==================== GET ALL (Public) ====================
    getAllDesignTemplates: catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, [
            'searchTerm', 'category', 'designTools', 'accessType', 'templateType', 'minPrice', 'maxPrice', 'minRating',
        ]) as IDesignTemplateFilters;

        // Convert string to number
        if (filters.minPrice) filters.minPrice = Number(filters.minPrice);
        if (filters.maxPrice) filters.maxPrice = Number(filters.maxPrice);
        if (filters.minRating) filters.minRating = Number(filters.minRating);

        const query: IDesignTemplateQuery = {
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
        };

        const result = await DesignTemplateService.getAllDesignTemplates(filters, query);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design templates fetched successfully',
            meta: result.meta,
            data: result.data,
        });
    }),

    // ==================== GET FEATURED ====================
    getFeaturedDesignTemplates: catchAsync(async (req: Request, res: Response) => {
        const limit = req.query.limit ? Number(req.query.limit) : 8;
        const templates = await DesignTemplateService.getFeaturedDesignTemplates(limit);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Featured design templates fetched',
            data: templates,
        });
    }),

    // ==================== GET BY ID ====================
    getDesignTemplateById: catchAsync(async (req: Request, res: Response) => {
        const template = await DesignTemplateService.getDesignTemplateById(req.params.id);

        // Increment view count
        DesignTemplateService.incrementViewCount(req.params.id).catch(() => { });

        // Check if user has liked
        const userId = req.user?.userId;
        const isLiked = userId && template.likedBy?.some((id: any) => id.toString() === userId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design template fetched successfully',
            data: { ...JSON.parse(JSON.stringify(template)), isLiked: !!isLiked },
        });
    }),

    // ==================== GET BY SLUG (Public) ====================
    getDesignTemplateBySlug: catchAsync(async (req: Request, res: Response) => {
        const template = await DesignTemplateService.getDesignTemplateBySlug(req.params.slug);

        // Check if user has liked
        const userId = req.user?.userId;
        const isLiked = userId && template.likedBy?.some((id: any) => id.toString() === userId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design template fetched successfully',
            data: { ...JSON.parse(JSON.stringify(template)), isLiked: !!isLiked },
        });
    }),

    // ==================== UPDATE ====================
    updateDesignTemplate: catchAsync(async (req: Request, res: Response) => {
        const isAdmin = req.user!.role === 'admin';
        const template = await DesignTemplateService.updateDesignTemplate(
            req.params.id,
            req.body,
            req.user!.userId,
            isAdmin
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design template updated successfully',
            data: template,
        });
    }),

    // ==================== DELETE ====================
    deleteDesignTemplate: catchAsync(async (req: Request, res: Response) => {
        const isAdmin = req.user!.role === 'admin';
        await DesignTemplateService.deleteDesignTemplate(req.params.id, req.user!.userId, isAdmin);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design template deleted successfully',
        });
    }),

    // ==================== ADMIN: GET ALL ====================
    getAdminDesignTemplates: catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ['searchTerm', 'status', 'category', 'designTools', 'templateType']) as IDesignTemplateFilters;
        const query: IDesignTemplateQuery = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
        };

        const result = await DesignTemplateService.getAdminDesignTemplates(filters, query);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Design templates fetched',
            meta: result.meta,
            data: result.data,
        });
    }),

    // ==================== ADMIN: APPROVE/REJECT ====================
    updateDesignTemplateStatus: catchAsync(async (req: Request, res: Response) => {
        const { status } = req.body;
        const template = await DesignTemplateService.updateDesignTemplateStatus(req.params.id, status);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `Design template ${status} successfully`,
            data: template,
        });
    }),

    // ==================== TOGGLE LIKE ====================
    toggleLike: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError(401, 'User ID not found in token');
        }
        const result = await DesignTemplateService.toggleLike(req.params.id, userId.toString());

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: result.liked ? 'Design template liked' : 'Design template unliked',
            data: result,
        });
    }),
};



