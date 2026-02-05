import { Types } from 'mongoose';


/**
 * Design Tools Options (Multi-selection)
 */
export const DESIGN_TOOLS_OPTIONS = [
    'Figma',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe XD',
    'Sketch',
    'Canva',
    'Adobe InDesign',
    'CorelDRAW',
    'Affinity Designer',
    'GIMP',
    'Procreate',
    'Blender',
    'Cinema 4D',
    'After Effects',
    'Premiere Pro',
    'Other'
] as const;

export type TDesignTool = typeof DESIGN_TOOLS_OPTIONS[number];

/**
 * Design Template Type Options
 */
export const DESIGN_TYPE_OPTIONS = [
    'UI Kit',
    'Website Template',
    'Landing Page',
    'Mobile App Design',
    'Social Media Graphic',
    'Presentation',
    'Logo',
    'Vector Graphic',
    'Illustration',
    'Print Template',
    'Email Template',
    'Icon Set',
    'Font',
    'Mockup',
    'Business Card',
    'Flyer',
    'Other'
] as const;

export type TDesignType = typeof DESIGN_TYPE_OPTIONS[number];

/**
 * IDesignTemplate - Main design template product data structure
 */
export interface IDesignTemplate {
    _id?: Types.ObjectId;

    // Basic Info
    title: string;
    slug: string;
    author: Types.ObjectId;          // User (seller) reference
    category?: Types.ObjectId;        // Category reference
    designTools?: TDesignTool[];      // Design tools used (multi-selection)

    // Type & Access
    templateType?: TDesignType;       // Design type enum
    accessType?: 'free' | 'paid';

    // Pricing
    price?: number;
    offerPrice?: number;

    // Licensing
    licenseType?: 'regular' | 'extended';
    regularLicensePrice?: number;
    extendedLicensePrice?: number;

    // Ratings & Sales
    rating?: number;                  // Average rating (1-5)
    reviewCount?: number;
    salesCount?: number;

    // Analytics & Engagement
    viewCount?: number;               // Page view count
    likeCount?: number;               // Total likes
    likedBy?: Types.ObjectId[];       // Users who liked this template

    // Details
    description?: string;             // Short description
    longDescription?: string;        // Full description (markdown)

    // Media
    images?: string[];                // Screenshot URLs
    previewUrl?: string;             // Live demo/preview URL
    downloadFile?: string;            // Secure file path/URL
    documentationUrl?: string;       // Documentation link

    // Status
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    isDeleted: boolean;
    isFeatured: boolean;

    // Dates
    publishDate?: Date;
    lastUpdate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IDesignTemplateFilters - Query filters for design template listing
 */
export interface IDesignTemplateFilters {
    searchTerm?: string;
    category?: string;
    designTools?: TDesignTool[];
    author?: string;
    accessType?: 'free' | 'paid';
    status?: string;
    templateType?: TDesignType;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isFeatured?: boolean;
}

/**
 * IDesignTemplateQuery - Pagination and sorting options
 */
export interface IDesignTemplateQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
