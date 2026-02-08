import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DesignTemplateService } from './designTemplate.service';
import https from 'https';
import http from 'http';
import { v2 as cloudinary } from 'cloudinary';

import pick from '../../utils/pick';
import { IDesignTemplateFilters, IDesignTemplateQuery } from './designTemplate.interface';
import AppError from '../../utils/AppError';

export const DesignTemplateController = {

    // ==================== UPLOAD IMAGES ====================
    uploadImages: catchAsync(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            throw new AppError(400, 'No images uploaded');
        }

        // Extract URLs from Cloudinary upload
        const imageUrls = files.map(file => (file as any).path || (file as any).secure_url);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `${files.length} image(s) uploaded successfully`,
            data: { urls: imageUrls },
        });
    }),

    // ==================== UPLOAD DOWNLOAD FILE ====================
    uploadDownloadFile: catchAsync(async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File;

        if (!file) {
            throw new AppError(400, 'No file uploaded');
        }

        // Extract URL from Cloudinary upload
        const fileUrl = (file as any).path || (file as any).secure_url;

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Download file uploaded successfully',
            data: { url: fileUrl },
        });
    }),

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

    // ==================== DOWNLOAD FILE ====================
    downloadFile: catchAsync(async (req: Request, res: Response) => {
        const template = await DesignTemplateService.getDesignTemplateById(req.params.id);

        if (!template.downloadFile) {
            throw new AppError(404, 'Download file not found');
        }

        const downloadUrl = template.downloadFile;
        console.log(`[Download] Processing: ${template.title}`);

        // Extract Cloudinary info
        const urlParts = downloadUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        const authIndex = urlParts.indexOf('authenticated');
        const baseIndex = uploadIndex !== -1 ? uploadIndex : authIndex;

        if (baseIndex === -1) {
            return res.status(200).json({ success: true, redirectUrl: downloadUrl });
        }

        const isImage = downloadUrl.includes('/image/');
        const resourceType = isImage ? 'image' : 'raw';
        const deliveryType = urlParts[baseIndex];

        // Extract version and public ID
        let pathStartIndex = baseIndex + 1;
        let version: string | undefined = undefined;
        if (urlParts[baseIndex + 1] && urlParts[baseIndex + 1].startsWith('v')) {
            version = urlParts[baseIndex + 1].substring(1);
            pathStartIndex = baseIndex + 2;
        }

        const publicId = urlParts.slice(pathStartIndex).join('/');
        const extMatch = downloadUrl.match(/\.([a-z0-9]+)(\?|$)/i);
        const ext = extMatch ? extMatch[1] : (isImage ? 'png' : 'zip');
        const sanitizedTitle = template.title.replace(/[^a-z0-9]/gi, '_');

        try {
            // Generate Signed URL - this is more robust for 'raw' files with extensions in ID
            const secureUrl = cloudinary.url(publicId, {
                resource_type: resourceType,
                type: deliveryType,
                version: version,
                secure: true,
                sign_url: true,
                flags: 'attachment',
                attachment: `${sanitizedTitle}.${ext}`,
                expires_at: Math.floor(Date.now() / 1000) + 3600
            });

            console.log(`[Download] Signed URL generated successfully.`);

            return res.status(200).json({
                success: true,
                redirectUrl: secureUrl
            });
        } catch (err) {
            console.error('[Download] Cloudinary Error:', err);
            return res.status(200).json({
                success: true,
                redirectUrl: downloadUrl // Fallback
            });
        }
    }),
};



