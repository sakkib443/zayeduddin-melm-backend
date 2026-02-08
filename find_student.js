// Script to find student users
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0';

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const User = mongoose.connection.collection('users');

        // Search for users with "student" in email, firstName, or lastName
        console.log('🔍 Searching for users with "student" in their details...\n');

        const students = await User.find({
            $or: [
                { email: { $regex: 'student', $options: 'i' } },
                { firstName: { $regex: 'student', $options: 'i' } },
                { lastName: { $regex: 'student', $options: 'i' } }
            ]
        }).toArray();

        if (students.length === 0) {
            console.log('❌ No users found with "student" in their details.\n');
            console.log('📋 Let me show ALL users in the database:\n');

            const allUsers = await User.find({}).limit(20).toArray();

            if (allUsers.length === 0) {
                console.log('❌ No users found in database at all!');
            } else {
                console.log(`Found ${allUsers.length} users:\n`);
                allUsers.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
                    console.log(`   📧 Email: ${user.email}`);
                    console.log(`   🆔 ID: ${user._id}`);
                    console.log(`   👤 Role: ${user.role || 'student'}`);
                    console.log('');
                });
            }
        } else {
            console.log(`✅ Found ${students.length} user(s) with "student":\n`);
            students.forEach((user, index) => {
                console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
                console.log(`   📧 Email: ${user.email}`);
                console.log(`   🆔 ID: ${user._id}`);
                console.log(`   👤 Role: ${user.role || 'student'}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    }
}

main();
