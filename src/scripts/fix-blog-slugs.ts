/**
 * Regenerate ALL blog slugs from their titles
 * Bengali titles → Bengali slugs, English titles → English slugs
 * 
 * Usage: npx ts-node src/scripts/fix-blog-slugs.ts
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';

const MONGO_URI = process.env.DATABASE_URL!;

const generateSlug = (title: string): string => {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        // Allow Bengali (\u0980-\u09FF), English (a-z), numbers (0-9), spaces, hyphens
        .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const fixAllSlugs = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const blogsCollection = db.collection('blogs');

        const allBlogs = await blogsCollection.find({}).toArray();
        console.log(`📊 Total blogs: ${allBlogs.length}\n`);

        let updated = 0;
        for (const blog of allBlogs) {
            const id = blog._id.toString();

            // Use title (English or Bengali) to generate slug
            const title = blog.title || blog.titleBn || '';
            let newSlug = generateSlug(title);

            if (!newSlug) {
                newSlug = `resource-${id.slice(-8)}`;
            }

            // Ensure uniqueness
            const existing = await blogsCollection.findOne({
                slug: newSlug,
                _id: { $ne: blog._id },
            });
            if (existing) {
                newSlug = `${newSlug}-${id.slice(-4)}`;
            }

            // Only update if slug is different
            if (blog.slug !== newSlug) {
                await blogsCollection.updateOne(
                    { _id: blog._id },
                    { $set: { slug: newSlug } }
                );
                console.log(`✅ "${title}" → slug: "${newSlug}"`);
                updated++;
            } else {
                console.log(`⏭️  "${title}" → already correct: "${newSlug}"`);
            }
        }

        console.log(`\n🎉 Done! Updated ${updated} slug(s).`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixAllSlugs();
