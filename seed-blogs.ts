import mongoose from 'mongoose';
import { Blog } from './src/app/modules/blog/blog.model';
import dotenv from 'dotenv';

dotenv.config();

const adminId = '697b2af70513e2071171b1ed';
const categoryId = '697b358d0513e2071171b4e0';

const demoBlogs = [
    {
        title: "Mastering Modern Logo Design in 2024",
        titleBn: "২০২৪ সালে মডার্ন লোগো ডিজাইনে দক্ষতা অর্জন",
        slug: "mastering-modern-logo-design",
        excerpt: "Learn the core principles of minimalist logo design that works for global brands.",
        excerptBn: "গ্লোবাল ব্র্যান্ডের জন্য কাজ করে এমন মিনিমালিস্ট লোগো ডিজাইনের মূল নীতিগুলি শিখুন।",
        content: "<h2>Introduction</h2><p>Logo design is more than just drawing shapes. It's about identity...</p><p>In this guide, we'll explore the latest trends and techniques in the industry.</p>",
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["design", "logo", "branding"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: true,
        isPopular: true,
        totalViews: 1250,
        publishedAt: new Date()
    },
    {
        title: "Graphic Design Trends to Watch This Year",
        titleBn: "এই বছরের সেরা গ্রাফিক ডিজাইন ট্রেন্ডস",
        slug: "graphic-design-trends-this-year",
        excerpt: "Stay ahead of the competition by adopting these emerging visual styles.",
        excerptBn: "এই নতুন ভিজ্যুয়াল শৈলীগুলি গ্রহণ করে প্রতিযোগিতার থেকে এগিয়ে থাকুন।",
        content: "<h2>Visual Evolution</h2><p>Motion graphics and 3D elements are taking over the digital space...</p>",
        thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["trends", "graphics", "2024"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: true,
        isPopular: false,
        totalViews: 840,
        publishedAt: new Date(Date.now() - 86400000)
    },
    {
        title: "How to Build a Professional Designer Portfolio",
        titleBn: "কিভাবে একটি প্রফেশনাল ডিজাইনার পোর্টফলিও তৈরি করবেন",
        slug: "build-designer-portfolio",
        excerpt: "A step-by-step guide to showcasing your work and landing high-paying clients.",
        excerptBn: "আপনার কাজ প্রদর্শন এবং হাই-পেয়িং ক্লায়েন্ট পাওয়ার একটি ধাপে ধাপে নির্দেশিকা।",
        content: "<h2>Your Portfolio is Your Identity</h2><p>Don't just show everything you've ever made. Curate your best work.</p>",
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["career", "portfolio", "freelancing"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: false,
        isPopular: true,
        totalViews: 2100,
        publishedAt: new Date(Date.now() - 172800000)
    },
    {
        title: "Colors in Design: Emotional Impact",
        titleBn: "ডিজাইনে রঙ: মানসিক প্রভাব",
        slug: "colors-emotional-impact",
        excerpt: "Understand how different colors influence user behavior and brand perception.",
        excerptBn: "বিভিন্ন রং কিভাবে ব্যবহারকারীর আচরণ এবং ব্র্যান্ড উপলব্ধি প্রভাবিত করে তা বুঝুন।",
        content: "<h2> Psychology of Color</h2><p>Red for urgency, blue for trust. Choose your palette wisely.</p>",
        thumbnail: "https://images.unsplash.com/photo-1506792006437-256b748d3c02?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["color", "psychology", "ux"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: false,
        isPopular: false,
        totalViews: 560,
        publishedAt: new Date(Date.now() - 259200000)
    },
    {
        title: "The Future of AI in Graphic Design",
        titleBn: "গ্রাফিক ডিজাইনে এআই-এর ভবিষ্যৎ",
        slug: "future-of-ai-design",
        excerpt: "Will AI replace designers or empower them? Here is what we think.",
        excerptBn: "এআই কি ডিজাইনারদের প্রতিস্থাপন করবে নাকি তাদের ক্ষমতায়ন করবে? এখানে আমাদের মতামত।",
        content: "<h2>Artificial Intelligence</h2><p>Generative models like Midjourney and DALL-E are tools, not replacements.</p>",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["ai", "future", "technology"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: false,
        isPopular: true,
        totalViews: 3200,
        publishedAt: new Date(Date.now() - 345600000)
    },
    {
        title: "Typography Rules for Better Readability",
        titleBn: "ভাল রিডাবিলিটির জন্য টাইপোগ্রাফি রুলস",
        slug: "typography-readability-rules",
        excerpt: "Simple typography rules that will instantly improve your designs.",
        excerptBn: "সহজ টাইপোগ্রাফি নিয়ম যা আপনার ডিজাইনকে তাৎক্ষণিকভাবে উন্নত করবে।",
        content: "<h2>Fonts Matter</h2><p>Line height, letter spacing, and font weight are critical for UX.</p>",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
        category: new mongoose.Types.ObjectId(categoryId),
        tags: ["typography", "ux", "rules"],
        author: new mongoose.Types.ObjectId(adminId),
        authorRole: "admin",
        status: "published",
        isFeatured: false,
        isPopular: false,
        totalViews: 420,
        publishedAt: new Date(Date.now() - 432000000)
    }
];

async function seedBlogs() {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log('Connected to DB...');

        await Blog.deleteMany({});
        console.log('Cleared existing blogs.');

        await Blog.insertMany(demoBlogs);
        console.log('Successfully seeded 6 demo blogs!');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding blogs:', error);
    }
}

seedBlogs();
