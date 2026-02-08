const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0';

async function main() {
    await mongoose.connect(MONGO_URI);
    const User = mongoose.connection.collection('users');

    const students = await User.find({
        $or: [
            { email: { $regex: 'student', $options: 'i' } },
            { firstName: { $regex: 'student', $options: 'i' } }
        ]
    }).toArray();

    console.log(JSON.stringify(students, null, 2));

    await mongoose.disconnect();
    process.exit(0);
}

main();
