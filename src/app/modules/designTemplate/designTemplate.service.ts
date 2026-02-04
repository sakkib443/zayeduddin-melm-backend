import { FilterQuery, SortOrder, Types } from 'mongoose';
import config from '../../config';
import AppError from '../../utils/AppError';
import { IDesignTemplate, IDesignTemplateFilters, IDesignTemplateQuery } from './designTemplate.interface';
import { DesignTemplate } from './designTemplate.model';
import CategoryService from '../category/category.service';
import { User } from '../user/user.model';
import { NotificationService } from '../notification/notification.module';

interface IPaginatedResult<T> {
    data: T[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}

export const DesignTemplateService = {

    // ==================== CREATE DESIGN TEMPLATE ====================
    async createDesignTemplate(payload: Partial<IDesignTemplate>): Promise<IDesignTemplate> {
        // Generate slug if not provided
        if (!payload.slug) {
            payload.slug = payload.title!
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                + '-' + Date.now();
        }

        // Check slug uniqueness
        const existing = await DesignTemplate.findOne({ slug: payload.slug });
        if (existing) {
            throw new AppError(400, 'Design template with this slug already exists');
        }

        // Create template
        const template = await DesignTemplate.create({
            ...payload,
            publishDate: new Date(),
        });

        // Increment category product count
        if (payload.category) {
            await CategoryService.incrementProductCount(payload.category.toString());
        }

        return template;
    },


    // ==================== GET ALL DESIGN TEMPLATES (Public with filters) ====================
    async getAllDesignTemplates(
        filters: IDesignTemplateFilters,
        query: IDesignTemplateQuery
    ): Promise<IPaginatedResult<IDesignTemplate>> {
        const { searchTerm, category, platform, accessType, templateType, minPrice, maxPrice, minRating } = filters;
        const {
            page = config.pagination.default_page,
            limit = config.pagination.default_limit,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        // Build query conditions
        const conditions: FilterQuery<IDesignTemplate>[] = [
            { status: 'approved' },
            { isDeleted: false },
        ];

        // Text search
        if (searchTerm) {
            conditions.push({
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { features: { $regex: searchTerm, $options: 'i' } },
                ],
            });
        }

        if (category) {
            conditions.push({ category: new Types.ObjectId(category) });
        }
        if (platform) {
            conditions.push({ platform: platform });
        }
        if (templateType) {
            conditions.push({ templateType: templateType });
        }
        if (accessType) {
            conditions.push({ accessType });
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceCondition: any = {};
            if (minPrice !== undefined) priceCondition.$gte = minPrice;
            if (maxPrice !== undefined) priceCondition.$lte = maxPrice;
            conditions.push({
                $or: [{ offerPrice: priceCondition }, { price: priceCondition }],
            });
        }

        if (minRating !== undefined) {
            conditions.push({ rating: { $gte: minRating } });
        }

        const whereConditions = { $and: conditions };

        const sortConditions: { [key: string]: SortOrder } = {};
        sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const [templates, total] = await Promise.all([
            DesignTemplate.find(whereConditions)
                .populate('category', 'name slug')
                .sort(sortConditions)
                .skip(skip)
                .limit(limit),
            DesignTemplate.countDocuments(whereConditions),
        ]);

        return {
            data: templates,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    // ==================== GET FEATURED DESIGN TEMPLATES ====================
    async getFeaturedDesignTemplates(limit = 8): Promise<IDesignTemplate[]> {
        return await DesignTemplate.find({
            status: 'approved',
            isDeleted: false,
            isFeatured: true,
        })
            .populate('category', 'name slug')
            .sort({ salesCount: -1 })
            .limit(limit);
    },

    // ==================== GET SINGLE DESIGN TEMPLATE ====================
    async getDesignTemplateById(id: string): Promise<IDesignTemplate> {
        const template = await DesignTemplate.findById(id)
            .populate('category', 'name slug');

        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        return template;
    },

    // ==================== GET BY SLUG (Public) ====================
    async getDesignTemplateBySlug(slug: string): Promise<IDesignTemplate> {
        const template = await DesignTemplate.findOne({ slug, status: 'approved', isDeleted: false })
            .populate('category', 'name slug');

        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        return template;
    },

    // ==================== UPDATE DESIGN TEMPLATE ====================
    async updateDesignTemplate(id: string, payload: Partial<IDesignTemplate>, userId: string, isAdmin: boolean): Promise<IDesignTemplate> {
        const template = await DesignTemplate.findById(id);
        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        if (!isAdmin && template.author.toString() !== userId) {
            throw new AppError(403, 'You can only update your own templates');
        }

        payload.lastUpdate = new Date();

        const updated = await DesignTemplate.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true })
            .populate('category', 'name');

        return updated!;
    },

    // ==================== DELETE DESIGN TEMPLATE (Soft Delete) ====================
    async deleteDesignTemplate(id: string, userId: string, isAdmin: boolean): Promise<void> {
        const template = await DesignTemplate.findById(id);
        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        if (!isAdmin && template.author.toString() !== userId) {
            throw new AppError(403, 'You can only delete your own templates');
        }

        await DesignTemplate.findByIdAndUpdate(id, { isDeleted: true });

        await CategoryService.decrementProductCount(template.category.toString());
    },

    // ==================== APPROVE/REJECT DESIGN TEMPLATE (Admin) ====================
    async updateDesignTemplateStatus(id: string, status: 'approved' | 'rejected'): Promise<IDesignTemplate> {
        const template = await DesignTemplate.findByIdAndUpdate(
            id,
            { status, publishDate: status === 'approved' ? new Date() : undefined },
            { new: true }
        );

        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        return template;
    },

    // ==================== INCREMENT SALES COUNT ====================
    async incrementSalesCount(id: string): Promise<void> {
        await DesignTemplate.findByIdAndUpdate(id, { $inc: { salesCount: 1 } });
    },

    // ==================== UPDATE RATING ====================
    async updateRating(id: string, newRating: number, reviewCount: number): Promise<void> {
        await DesignTemplate.findByIdAndUpdate(id, { rating: newRating, reviewCount });
    },

    // ==================== INCREMENT VIEW COUNT ====================
    async incrementViewCount(id: string): Promise<void> {
        await DesignTemplate.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    },

    // ==================== TOGGLE LIKE ====================
    async toggleLike(id: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
        const template = await DesignTemplate.findById(id);
        if (!template) {
            throw new AppError(404, 'Design template not found');
        }

        const userObjectId = new Types.ObjectId(userId);
        const isLiked = template.likedBy?.some((likedUserId) => likedUserId.equals(userObjectId));

        if (isLiked) {
            await DesignTemplate.findByIdAndUpdate(id, {
                $pull: { likedBy: userObjectId },
                $inc: { likeCount: -1 },
            });

            // Remove from wishlist
            try {
                const WishlistService = (await import('../wishlist/wishlist.module')).default;
                await WishlistService.removeFromWishlist(userId, id);
            } catch (error) {
                console.error('Wishlist sync error (unlike):', error);
            }

            const updated = await DesignTemplate.findById(id).select('likeCount');
            return { liked: false, likeCount: Math.max(0, updated?.likeCount || 0) };
        } else {
            await DesignTemplate.findByIdAndUpdate(id, {
                $addToSet: { likedBy: userObjectId },
                $inc: { likeCount: 1 },
            });

            // Add to wishlist
            try {
                const WishlistService = (await import('../wishlist/wishlist.module')).default;
                await WishlistService.addToWishlist(userId, id, 'design-template');

                // Notification
                const user = await User.findById(userId);
                if (user && template) {
                    await NotificationService.createLikeNotification({
                        userId: user._id,
                        userName: `${user.firstName} ${user.lastName}`,
                        productId: template._id as Types.ObjectId,
                        productName: template.title,
                        productType: 'design-template'
                    });
                }
            } catch (error) {
                console.error('Wishlist/Notification sync error (like):', error);
            }

            const updated = await DesignTemplate.findById(id).select('likeCount');
            return { liked: true, likeCount: updated?.likeCount || 0 };
        }
    },

    // ==================== GET ADMIN DESIGN TEMPLATES ====================
    async getAdminDesignTemplates(filters: IDesignTemplateFilters, query: IDesignTemplateQuery): Promise<IPaginatedResult<IDesignTemplate>> {
        const { searchTerm, status, category, platform, templateType } = filters;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

        const conditions: FilterQuery<IDesignTemplate>[] = [{ isDeleted: false }];

        if (searchTerm) {
            conditions.push({ title: { $regex: searchTerm, $options: 'i' } });
        }
        if (status) {
            conditions.push({ status });
        }
        if (category) {
            conditions.push({ category: new Types.ObjectId(category) });
        }
        if (platform) {
            conditions.push({ platform: platform });
        }
        if (templateType) {
            conditions.push({ templateType: templateType });
        }

        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const skip = (page - 1) * limit;
        const sortConditions: { [key: string]: SortOrder } = {};
        sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [templates, total] = await Promise.all([
            DesignTemplate.find(whereConditions)
                .populate('category', 'name')
                .sort(sortConditions)
                .skip(skip)
                .limit(limit),
            DesignTemplate.countDocuments(whereConditions),
        ]);

        return {
            data: templates,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    },
};



