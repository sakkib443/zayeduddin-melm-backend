// ===================================================================
// Legal Page Module - Terms, Privacy, Return Policy
// ===================================================================

import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import express from 'express';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

// ==================== INTERFACE ====================
export interface ILegalPage {
    _id?: Types.ObjectId;
    slug: string;         // 'terms', 'privacy', 'return-policy'
    title: string;
    titleBn: string;
    content: string;      // HTML content
    contentBn: string;    // Bengali HTML content
    isActive: boolean;
    lastUpdatedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== MODEL ====================
const legalPageSchema = new Schema<ILegalPage>(
    {
        slug: { type: String, required: true, unique: true, enum: ['terms', 'privacy', 'return-policy'] },
        title: { type: String, required: true },
        titleBn: { type: String, default: '' },
        content: { type: String, default: '' },
        contentBn: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
        lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export const LegalPage = model<ILegalPage>('LegalPage', legalPageSchema);

// ==================== DEFAULT CONTENT ====================
const DEFAULT_PAGES: Omit<ILegalPage, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
        slug: 'terms',
        title: 'Terms & Conditions',
        titleBn: 'শর্তাবলী',
        isActive: true,
        content: `
<h2>Terms & Conditions</h2>
<p><strong>Last Updated:</strong> March 2026</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

<h3>2. Use License</h3>
<p>Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
<ul>
<li>Modify or copy the materials</li>
<li>Use the materials for any commercial purpose</li>
<li>Attempt to decompile or reverse engineer any software contained on our website</li>
<li>Remove any copyright or other proprietary notations from the materials</li>
<li>Transfer the materials to another person or "mirror" the materials on any other server</li>
</ul>

<h3>3. Course & Product Purchase</h3>
<p>All purchases made through our platform are subject to the following conditions:</p>
<ul>
<li>Prices are listed in BDT (Bangladeshi Taka) and are subject to change without notice.</li>
<li>Upon successful payment, you will receive access to the purchased course or digital product.</li>
<li>Course access is granted for the duration specified in the course description.</li>
<li>Digital products are delivered electronically and are available for download immediately after purchase.</li>
</ul>

<h3>4. User Accounts</h3>
<p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>

<h3>5. Intellectual Property</h3>
<p>All content, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of our company and protected by international copyright laws.</p>

<h3>6. Disclaimer</h3>
<p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

<h3>7. Governing Law</h3>
<p>These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

<h3>8. Contact Information</h3>
<p>If you have any questions about these Terms & Conditions, please contact us at <strong>info@zayeduddin.com</strong></p>
`,
        contentBn: `
<h2>শর্তাবলী</h2>
<p><strong>সর্বশেষ আপডেট:</strong> মার্চ ২০২৬</p>

<h3>১. শর্তাবলী গ্রহণ</h3>
<p>এই ওয়েবসাইট অ্যাক্সেস এবং ব্যবহার করে, আপনি এই চুক্তির শর্তাবলী দ্বারা আবদ্ধ হতে সম্মত হচ্ছেন। আপনি যদি উপরোক্ত শর্তাবলী মানতে সম্মত না হন, তাহলে দয়া করে এই পরিষেবা ব্যবহার করবেন না।</p>

<h3>২. ব্যবহারের লাইসেন্স</h3>
<p>আমাদের ওয়েবসাইটের উপকরণগুলি (তথ্য বা সফটওয়্যার) ব্যক্তিগত, অ-বাণিজ্যিক ক্ষণস্থায়ী দেখার জন্য সাময়িকভাবে ডাউনলোড করার অনুমতি দেওয়া হয়।</p>

<h3>৩. কোর্স ও পণ্য ক্রয়</h3>
<p>আমাদের প্ল্যাটফর্মের মাধ্যমে করা সমস্ত কেনাকাটা নিম্নলিখিত শর্তাবলীর অধীন:</p>
<ul>
<li>মূল্য বাংলাদেশী টাকায় (BDT) তালিকাভুক্ত এবং বিজ্ঞপ্তি ছাড়াই পরিবর্তন হতে পারে।</li>
<li>সফল পেমেন্টের পর, আপনি কেনা কোর্স বা ডিজিটাল পণ্যে অ্যাক্সেস পাবেন।</li>
<li>কোর্সের বর্ণনায় উল্লেখিত সময়কালের জন্য কোর্সে অ্যাক্সেস দেওয়া হয়।</li>
</ul>

<h3>৪. ব্যবহারকারী অ্যাকাউন্ট</h3>
<p>আমাদের সাথে একটি অ্যাকাউন্ট তৈরি করার সময়, আপনাকে সর্বদা সঠিক, সম্পূর্ণ এবং বর্তমান তথ্য প্রদান করতে হবে।</p>

<h3>৫. মেধা সম্পত্তি</h3>
<p>সকল বিষয়বস্তু, যার মধ্যে টেক্সট, গ্রাফিক্স, লোগো, ইমেজ, অডিও ক্লিপ, ডিজিটাল ডাউনলোড এবং ডেটা সংকলন রয়েছে, তা আমাদের কোম্পানির সম্পত্তি।</p>

<h3>৬. যোগাযোগ</h3>
<p>এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে, আমাদের সাথে যোগাযোগ করুন: <strong>info@zayeduddin.com</strong></p>
`,
    },
    {
        slug: 'privacy',
        title: 'Privacy Policy',
        titleBn: 'গোপনীয়তা নীতি',
        isActive: true,
        content: `
<h2>Privacy Policy</h2>
<p><strong>Last Updated:</strong> March 2026</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
<ul>
<li><strong>Personal Information:</strong> Name, email address, phone number, billing address</li>
<li><strong>Payment Information:</strong> Payment method details (processed securely through our payment partners)</li>
<li><strong>Usage Data:</strong> How you interact with our website, courses, and services</li>
<li><strong>Device Information:</strong> Browser type, IP address, device type</li>
</ul>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
<li>Provide, maintain, and improve our services</li>
<li>Process transactions and send related information</li>
<li>Send you technical notices, updates, security alerts</li>
<li>Respond to your comments, questions, and customer service requests</li>
<li>Communicate with you about products, services, and events</li>
</ul>

<h3>3. Information Sharing</h3>
<p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.</p>

<h3>4. Data Security</h3>
<p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>

<h3>5. Cookies</h3>
<p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction.</p>

<h3>6. Third-Party Services</h3>
<p>We may use third-party service providers to assist us with analytics, payment processing, and content delivery. These providers have access to your information only to perform specific tasks on our behalf.</p>

<h3>7. Your Rights</h3>
<p>You have the right to:</p>
<ul>
<li>Access your personal data</li>
<li>Correct inaccurate data</li>
<li>Request deletion of your data</li>
<li>Opt-out of marketing communications</li>
</ul>

<h3>8. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at <strong>info@zayeduddin.com</strong></p>
`,
        contentBn: `
<h2>গোপনীয়তা নীতি</h2>
<p><strong>সর্বশেষ আপডেট:</strong> মার্চ ২০২৬</p>

<h3>১. আমরা যে তথ্য সংগ্রহ করি</h3>
<p>আমরা আপনার সরাসরি প্রদান করা তথ্য সংগ্রহ করি, যেমন আপনি যখন একটি অ্যাকাউন্ট তৈরি করেন, কেনাকাটা করেন, বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করেন।</p>
<ul>
<li><strong>ব্যক্তিগত তথ্য:</strong> নাম, ইমেইল ঠিকানা, ফোন নম্বর, বিলিং ঠিকানা</li>
<li><strong>পেমেন্ট তথ্য:</strong> পেমেন্ট পদ্ধতির বিবরণ</li>
<li><strong>ব্যবহারের ডেটা:</strong> আপনি কিভাবে আমাদের ওয়েবসাইট ও সেবা ব্যবহার করেন</li>
</ul>

<h3>২. আমরা কিভাবে আপনার তথ্য ব্যবহার করি</h3>
<ul>
<li>আমাদের সেবা প্রদান, রক্ষণাবেক্ষণ এবং উন্নতি করতে</li>
<li>লেনদেন প্রক্রিয়া করতে এবং সংশ্লিষ্ট তথ্য পাঠাতে</li>
<li>আপনাকে প্রযুক্তিগত বিজ্ঞপ্তি, আপডেট, নিরাপত্তা সতর্কতা পাঠাতে</li>
</ul>

<h3>৩. তথ্য শেয়ারিং</h3>
<p>আমরা আপনার ব্যক্তিগত তথ্য বাইরের পক্ষের কাছে বিক্রি, বাণিজ্য বা অন্যথায় স্থানান্তর করি না।</p>

<h3>৪. ডেটা নিরাপত্তা</h3>
<p>আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা বজায় রাখতে বিভিন্ন নিরাপত্তা ব্যবস্থা বাস্তবায়ন করি।</p>

<h3>৫. যোগাযোগ</h3>
<p>এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে, আমাদের সাথে যোগাযোগ করুন: <strong>info@zayeduddin.com</strong></p>
`,
    },
    {
        slug: 'return-policy',
        title: 'Return & Refund Policy',
        titleBn: 'রিটার্ন ও রিফান্ড নীতি',
        isActive: true,
        content: `
<h2>Return & Refund Policy</h2>
<p><strong>Last Updated:</strong> March 2026</p>

<h3>1. Digital Products</h3>
<p>Due to the nature of digital products, all sales are final. Once a digital product (website template, design template, software) has been downloaded, it cannot be returned or refunded.</p>

<h3>2. Online Courses</h3>
<p>We offer refunds for online courses under the following conditions:</p>
<ul>
<li><strong>Within 3 days:</strong> Full refund if you have completed less than 20% of the course content</li>
<li><strong>After 3 days:</strong> No refund will be issued</li>
<li><strong>Technical Issues:</strong> If you experience technical difficulties that prevent you from accessing the course, please contact our support team and we will resolve the issue or issue a refund</li>
</ul>

<h3>3. Offline/Physical Training</h3>
<p>For offline training programs:</p>
<ul>
<li><strong>7+ days before start:</strong> Full refund minus 10% processing fee</li>
<li><strong>3-7 days before start:</strong> 50% refund</li>
<li><strong>Less than 3 days:</strong> No refund</li>
<li><strong>After training starts:</strong> No refund</li>
</ul>

<h3>4. How to Request a Refund</h3>
<p>To request a refund, please contact us with the following information:</p>
<ul>
<li>Your order number</li>
<li>Email address used for purchase</li>
<li>Reason for the refund request</li>
</ul>
<p>Please send your request to <strong>info@zayeduddin.com</strong> or contact us through our website.</p>

<h3>5. Refund Processing</h3>
<p>Once your refund request is approved:</p>
<ul>
<li>Refunds will be processed within 5-7 business days</li>
<li>The refund will be credited to the original payment method</li>
<li>You will receive a confirmation email once the refund is processed</li>
</ul>

<h3>6. Exceptions</h3>
<p>We reserve the right to deny refund requests in cases of:</p>
<ul>
<li>Abuse of our refund policy</li>
<li>Complete download/consumption of the product</li>
<li>Violation of our Terms & Conditions</li>
</ul>

<h3>7. Contact</h3>
<p>For any questions regarding our return and refund policy, please contact us at <strong>info@zayeduddin.com</strong></p>
`,
        contentBn: `
<h2>রিটার্ন ও রিফান্ড নীতি</h2>
<p><strong>সর্বশেষ আপডেট:</strong> মার্চ ২০২৬</p>

<h3>১. ডিজিটাল পণ্য</h3>
<p>ডিজিটাল পণ্যের প্রকৃতির কারণে, সমস্ত বিক্রয় চূড়ান্ত। একবার ডিজিটাল পণ্য ডাউনলোড হয়ে গেলে এটি ফেরত বা রিফান্ড করা যাবে না।</p>

<h3>২. অনলাইন কোর্স</h3>
<p>আমরা নিম্নলিখিত শর্তে অনলাইন কোর্সের জন্য রিফান্ড অফার করি:</p>
<ul>
<li><strong>৩ দিনের মধ্যে:</strong> সম্পূর্ণ রিফান্ড যদি আপনি কোর্সের ২০% এর কম সম্পন্ন করে থাকেন</li>
<li><strong>৩ দিন পর:</strong> কোনো রিফান্ড দেওয়া হবে না</li>
<li><strong>প্রযুক্তিগত সমস্যা:</strong> যদি আপনি কোর্সে অ্যাক্সেস করতে সমস্যায় পড়েন, আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন</li>
</ul>

<h3>৩. অফলাইন ট্রেনিং</h3>
<ul>
<li><strong>শুরুর ৭+ দিন আগে:</strong> সম্পূর্ণ রিফান্ড (১০% প্রসেসিং ফি বাদ)</li>
<li><strong>শুরুর ৩-৭ দিন আগে:</strong> ৫০% রিফান্ড</li>
<li><strong>৩ দিনের কম:</strong> কোনো রিফান্ড নেই</li>
</ul>

<h3>৪. রিফান্ড অনুরোধ করুন</h3>
<p>রিফান্ড অনুরোধ করতে, দয়া করে আমাদের সাথে যোগাযোগ করুন: <strong>info@zayeduddin.com</strong></p>

<h3>৫. রিফান্ড প্রসেসিং</h3>
<ul>
<li>রিফান্ড ৫-৭ কার্যদিবসের মধ্যে প্রসেস করা হবে</li>
<li>রিফান্ড মূল পেমেন্ট পদ্ধতিতে ক্রেডিট করা হবে</li>
</ul>
`,
    },
];

// ==================== SERVICE ====================
const LegalPageService = {
    async seedDefaults(): Promise<void> {
        for (const page of DEFAULT_PAGES) {
            const existing = await LegalPage.findOne({ slug: page.slug });
            if (!existing) {
                await LegalPage.create(page);
                console.log(`✅ Seeded legal page: ${page.slug}`);
            }
        }
    },

    async getBySlug(slug: string): Promise<ILegalPage> {
        let page = await LegalPage.findOne({ slug });
        if (!page) {
            // Auto-seed if not found
            const defaultPage = DEFAULT_PAGES.find(p => p.slug === slug);
            if (defaultPage) {
                page = await LegalPage.create(defaultPage);
            } else {
                throw new AppError(404, 'Page not found');
            }
        }
        return page;
    },

    async getAll(): Promise<ILegalPage[]> {
        // Seed defaults first
        await this.seedDefaults();
        return LegalPage.find().sort({ slug: 1 });
    },

    async update(slug: string, data: Partial<ILegalPage>, userId?: string): Promise<ILegalPage> {
        const page = await LegalPage.findOneAndUpdate(
            { slug },
            { ...data, lastUpdatedBy: userId },
            { new: true, upsert: true }
        );
        if (!page) throw new AppError(404, 'Page not found');
        return page;
    },
};

// ==================== CONTROLLER ====================
const LegalPageController = {
    // Public: Get page by slug
    getBySlug: catchAsync(async (req: Request, res: Response) => {
        const page = await LegalPageService.getBySlug(req.params.slug);
        sendResponse(res, { statusCode: 200, success: true, message: 'Legal page fetched', data: page });
    }),

    // Admin: Get all legal pages
    getAll: catchAsync(async (req: Request, res: Response) => {
        const pages = await LegalPageService.getAll();
        sendResponse(res, { statusCode: 200, success: true, message: 'Legal pages fetched', data: pages });
    }),

    // Admin: Update legal page
    update: catchAsync(async (req: Request, res: Response) => {
        const page = await LegalPageService.update(req.params.slug, req.body, req.user?.userId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Legal page updated', data: page });
    }),
};

// ==================== ROUTES ====================
const router = express.Router();

// Public
router.get('/:slug', LegalPageController.getBySlug);

// Admin
router.get('/', authMiddleware, authorizeRoles('admin'), LegalPageController.getAll);
router.patch('/:slug', authMiddleware, authorizeRoles('admin'), LegalPageController.update);

export const LegalPageRoutes = router;
export default LegalPageService;
