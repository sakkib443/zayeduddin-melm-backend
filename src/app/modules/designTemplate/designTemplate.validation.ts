import { z } from 'zod';
import { DESIGN_TYPE_OPTIONS } from './designTemplate.interface';

/**
 * Create Design Template Validation
 */
export const createDesignTemplateValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(1).max(200),
        slug: z.string().optional(),
        designTools: z.array(z.string()).optional().default([]),
        category: z.string().optional().nullable(),
        templateType: z.string().optional().nullable(),
        accessType: z.enum(['free', 'paid']).optional().nullable().default('paid'),
        price: z.number().min(0).optional().nullable(),
        offerPrice: z.number().min(0).optional().nullable(),
        licenseType: z.enum(['regular', 'extended']).optional().nullable().default('regular'),
        regularLicensePrice: z.number().min(0).optional().nullable(),
        extendedLicensePrice: z.number().min(0).optional().nullable(),
        description: z.string().max(1000).optional().nullable(),
        longDescription: z.string().optional().nullable(),
        images: z.array(z.string()).optional().default([]),
        previewUrl: z.string().optional().nullable().or(z.literal('')),
        downloadFile: z.string().optional().nullable(),
        documentationUrl: z.string().optional().nullable().or(z.literal('')),
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
        designTools: z.array(z.string()).optional(),
        category: z.string().optional().nullable(),
        templateType: z.string().optional().nullable(),
        accessType: z.enum(['free', 'paid']).optional().nullable(),
        price: z.number().min(0).optional().nullable(),
        offerPrice: z.number().min(0).optional().nullable(),
        licenseType: z.enum(['regular', 'extended']).optional().nullable(),
        regularLicensePrice: z.number().min(0).optional().nullable(),
        extendedLicensePrice: z.number().min(0).optional().nullable(),
        description: z.string().max(1000).optional().nullable(),
        longDescription: z.string().optional().nullable(),
        images: z.array(z.string()).optional(),
        previewUrl: z.string().optional().nullable(),
        downloadFile: z.string().optional().nullable(),
        documentationUrl: z.string().optional().nullable(),
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
        templateType: z.enum(DESIGN_TYPE_OPTIONS).optional(),
        accessType: z.enum(['free', 'paid']).optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        minRating: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
});
