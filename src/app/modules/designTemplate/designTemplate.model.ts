import { Schema, model } from 'mongoose';
import { IDesignTemplate, DESIGN_TOOLS_OPTIONS, DESIGN_TYPE_OPTIONS } from './designTemplate.interface';

const designTemplateSchema = new Schema<IDesignTemplate>(
    {
        // ==================== Basic Info ====================
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        designTools: [{
            type: String,
            enum: DESIGN_TOOLS_OPTIONS,
        }],

        // ==================== Type & Access ====================
        templateType: {
            type: String,
            enum: DESIGN_TYPE_OPTIONS,
        },
        accessType: {
            type: String,
            enum: ['free', 'paid'],
            default: 'paid',
        },

        // ==================== Pricing ====================
        price: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        offerPrice: {
            type: Number,
            min: [0, 'Offer price cannot be negative'],
        },

        // ==================== Licensing ====================
        licenseType: {
            type: String,
            enum: ['regular', 'extended'],
            default: 'regular',
        },
        regularLicensePrice: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        extendedLicensePrice: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },

        // ==================== Ratings & Sales ====================
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: { type: Number, default: 0 },
        salesCount: { type: Number, default: 0 },

        // ==================== Analytics & Engagement ====================
        viewCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],

        // ==================== Details ====================
        description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        longDescription: { type: String },

        // ==================== Media ====================
        images: [{ type: String }],
        previewUrl: { type: String },
        downloadFile: {
            type: String,
        },
        documentationUrl: { type: String },

        // ==================== Status ====================
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'draft'],
            default: 'pending',
        },
        isDeleted: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },

        // ==================== Dates ====================
        publishDate: { type: Date },
        lastUpdate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// ==================== Indexes ====================
designTemplateSchema.index({ slug: 1 });
designTemplateSchema.index({ author: 1 });
designTemplateSchema.index({ category: 1 });
designTemplateSchema.index({ designTools: 1 });
designTemplateSchema.index({ status: 1, isDeleted: 1 });
designTemplateSchema.index({ price: 1 });
designTemplateSchema.index({ rating: -1 });
designTemplateSchema.index({ salesCount: -1 });
designTemplateSchema.index({ viewCount: -1 });
designTemplateSchema.index({ likeCount: -1 });
designTemplateSchema.index({ title: 'text', description: 'text' });

// ==================== Pre-find Middleware ====================
designTemplateSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

designTemplateSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

// ==================== Auto-generate Slug ====================
designTemplateSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now();
    }
    next();
});

export const DesignTemplate = model<IDesignTemplate>('DesignTemplate', designTemplateSchema);
