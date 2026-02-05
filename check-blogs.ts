import mongoose from 'mongoose';
import { Blog } from './src/app/modules/blog/blog.model';
import dotenv from 'dotenv';

dotenv.config();

async function checkBlogs() {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        const count = await Blog.countDocuments();
        const publishedCount = await Blog.countDocuments({ status: 'published' });
        const featuredCount = await Blog.countDocuments({ isFeatured: true });

        console.log('--- Blog Data Status ---');
        console.log('Total Blogs:', count);
        console.log('Published Blogs:', publishedCount);
        console.log('Featured Blogs:', featuredCount);

        if (count > 0) {
            const sample = await Blog.findOne().populate('category author');
            console.log('Sample Blog Title:', sample?.title);
            console.log('Sample Blog Category:', (sample?.category as any)?.name);
            console.log('Sample Blog Author:', (sample?.author as any)?.firstName);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error checking blogs:', error);
    }
}

checkBlogs();
