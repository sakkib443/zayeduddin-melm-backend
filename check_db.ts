import mongoose from 'mongoose';

const mongoUri = 'mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0';

async function checkDb() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const DesignTemplate = mongoose.model('DesignTemplate', new mongoose.Schema({
            title: String,
            downloadFile: String
        }));

        const templates = await DesignTemplate.find({}, { title: 1, downloadFile: 1 }).limit(10);
        console.log(JSON.stringify(templates, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDb();
