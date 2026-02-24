import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.join(__dirname, '../../.env') });
import mongoose from 'mongoose';

const listSlugs = async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
    const blogs = await mongoose.connection.db.collection('blogs').find({}).toArray();

    let output = '--- All Blog Slugs ---\n\n';
    blogs.forEach((b, i) => {
        output += `${i + 1}. Title: ${b.title || '(no en title)'}\n`;
        output += `   TitleBn: ${b.titleBn || '(no bn title)'}\n`;
        output += `   Slug: ${b.slug}\n`;
        output += `   URL: /resource-library/${b.slug}\n\n`;
    });

    fs.writeFileSync(path.join(__dirname, '../../slugs-output.txt'), output, 'utf-8');
    console.log('Written to slugs-output.txt');
    await mongoose.disconnect();
};
listSlugs();
