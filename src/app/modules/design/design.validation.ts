// ===================================================================
// MotionBoss LMS - Design Validation
// Zod validation schemas for Design module
// ===================================================================

import { z } from 'zod';

const heroContentValidation = z.object({
    badge: z.object({
        text: z.string().optional(),
        textBn: z.string().optional(),
        showNew: z.boolean().optional()
    }).optional(),
    heading: z.object({
        line1: z.string().optional(),
        line1Bn: z.string().optional()
    }).optional(),
    dynamicTexts: z.array(z.string()).optional(),
    dynamicTextsBn: z.array(z.string()).optional(),
    description: z.object({
        text: z.string().optional(),
        textBn: z.string().optional(),
        brandName: z.string().optional()
    }).optional(),
    features: z.array(z.object({
        text: z.string(),
        textBn: z.string()
    })).optional(),
    searchPlaceholder: z.object({
        text: z.string().optional(),
        textBn: z.string().optional()
    }).optional(),
    stats: z.object({
        activeUsers: z.number().optional(),
        downloads: z.number().optional(),
        avgRating: z.number().optional(),
        totalCourses: z.number().optional()
    }).optional()
});

const contactContentValidation = z.object({
    hero: z.object({
        badge: z.string().optional(),
        badgeBn: z.string().optional(),
        title1: z.string().optional(),
        title1Bn: z.string().optional(),
        title2: z.string().optional(),
        title2Bn: z.string().optional(),
        subtitle: z.string().optional(),
        subtitleBn: z.string().optional(),
    }).optional(),
    contactInfo: z.object({
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        addressBn: z.string().optional(),
        officeHours: z.string().optional(),
        officeHoursBn: z.string().optional(),
    }).optional(),
    socialLinks: z.object({
        facebook: z.string().optional(),
        youtube: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
        instagram: z.string().optional(),
    }).optional(),
    whatsappSection: z.object({
        title: z.string().optional(),
        titleBn: z.string().optional(),
        description: z.string().optional(),
        descriptionBn: z.string().optional(),
        buttonText: z.string().optional(),
        buttonTextBn: z.string().optional(),
    }).optional(),
    mapEmbedUrl: z.string().optional(),
}).optional();

const allSections = ['hero', 'about', 'footer', 'topHeader', 'navbar', 'contact', 'popularCourse', 'digitalProducts', 'whatWeProvide', 'aboutHero', 'aboutMission', 'aboutStats', 'aboutFeatures', 'aboutFounder', 'aboutGlobal', 'aboutCTA'] as const;

const createDesignZodSchema = z.object({
    body: z.object({
        section: z.enum(allSections),
        heroContent: heroContentValidation.optional(),
        contactContent: contactContentValidation,
        isActive: z.boolean().optional()
    }).passthrough()
});

const updateDesignZodSchema = z.object({
    body: z.object({
        section: z.enum(allSections).optional(),
        heroContent: heroContentValidation.optional(),
        contactContent: contactContentValidation,
        isActive: z.boolean().optional()
    }).passthrough()
});

export const DesignValidation = {
    createDesignZodSchema,
    updateDesignZodSchema
};
