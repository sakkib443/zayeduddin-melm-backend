import { z } from 'zod';
import { DESIGN_PLATFORM_OPTIONS, DESIGN_TYPE_OPTIONS } from './designTemplate.interface';

/**
 * Create Design Template Validation
 */
export const createDesignTemplateValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(1).max(200),
        slug: z.string().optional(),
        platform: z.enum(DESIGN_PLATFORM_OPTIONS, { required_error: 'Platform is required' }),
        category: z.string({ required_error: 'Category is required' }),
        templateType: z.enum(DESIGN_TYPE_OPTIONS, { required_error: 'Template type is required' }),
        accessType: z.enum(['free', 'paid']).optional().default('paid'),
        price: z.number({ required_error: 'Price is required' }).min(0),
        offerPrice: z.number().min(0).optional().nullable(),
        licenseType: z.enum(['regular', 'extended']).optional().default('regular'),
        regularLicensePrice: z.number({ required_error: 'Regular license price is required' }).min(0),
        extendedLicensePrice: z.number().min(0).optional().nullable(),
        version: z.string().optional().default('1.0.0'),
        features: z.array(z.string()).optional().default([]),
        filesIncluded: z.array(z.string()).optional().default([]),
        description: z.string({ required_error: 'Description is required' }).max(1000),
        longDescription: z.string().optional(),
        compatibility: z.array(z.string()).optional().default([]),
        images: z.array(z.string()).optional().default([]),
        previewUrl: z.string().url().optional().or(z.literal('')),
        downloadFile: z.string({ required_error: 'Download file is required' }),
        documentationUrl: z.string().url().optional().or(z.literal('')),
        status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
        isFeatured: z.boolean().optional(),
    }),
});

/**
 * Update Design Template Validation
 */
export const updateDesignTemplateValidation = z.object({
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        slug: z.string().optional(),
        platform: z.enum(DESIGN_PLATFORM_OPTIONS).optional(),
        category: z.string().optional(),
        templateType: z.enum(DESIGN_TYPE_OPTIONS).optional(),
        accessType: z.enum(['free', 'paid']).optional(),
        price: z.number().min(0).optional(),
        offerPrice: z.number().min(0).optional().nullable(),
        licenseType: z.enum(['regular', 'extended']).optional(),
        regularLicensePrice: z.number().min(0).optional(),
        extendedLicensePrice: z.number().min(0).optional().nullable(),
        version: z.string().optional(),
        features: z.array(z.string()).optional(),
        filesIncluded: z.array(z.string()).optional(),
        description: z.string().max(1000).optional(),
        longDescription: z.string().optional(),
        compatibility: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        previewUrl: z.string().optional(),
        downloadFile: z.string().optional(),
        documentationUrl: z.string().optional(),
        status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
        isFeatured: z.boolean().optional(),
    }),
});

/**
 * Design Template Query Validation
 */
export const designTemplateQueryValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        searchTerm: z.string().optional(),
        category: z.string().optional(),
        platform: z.enum(DESIGN_PLATFORM_OPTIONS).optional(),
        templateType: z.enum(DESIGN_TYPE_OPTIONS).optional(),
        accessType: z.enum(['free', 'paid']).optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        minRating: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});
