const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0';

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.connection.collection('users');
    const Batch = mongoose.connection.collection('batches');
    const Enrollment = mongoose.connection.collection('enrollments');
    const LiveClass = mongoose.connection.collection('liveclasses');
    const Notification = mongoose.connection.collection('notifications');

    // 1. Find student user
    console.log('1️⃣ Finding Student user...');
    const student = await User.findOne({
        $or: [
            { email: { $regex: 'student', $options: 'i' } },
            { firstName: { $regex: 'student', $options: 'i' } }
        ]
    });

    if (!student) {
        console.log('❌ No student found!\n');
        await mongoose.disconnect();
        return;
    }

    console.log(`✅ Student found: ${student.firstName} ${student.lastName} (${student.email})`);
    console.log(`   ID: ${student._id}\n`);

    // 2. Check student enrollments
    console.log('2️⃣ Checking student enrollments...');
    const enrollments = await Enrollment.find({ student: student._id }).toArray();

    if (enrollments.length === 0) {
        console.log('❌ Student has NO enrollments!\n');
    } else {
        console.log(`✅ Student has ${enrollments.length} enrollment(s):\n`);

        for (const enrollment of enrollments) {
            const batch = enrollment.batch ? await Batch.findOne({ _id: enrollment.batch }) : null;
            console.log(`   - Enrollment ID: ${enrollment._id}`);
            console.log(`     Batch: ${batch ? batch.batchName : 'No batch assigned'}`);
            console.log(`     Batch ID: ${enrollment.batch || 'N/A'}`);
            console.log(`     Status: ${enrollment.status}`);
            console.log('');
        }
    }

    // 3. Check all batches
    console.log('3️⃣ Available batches:');
    const allBatches = await Batch.find({}).toArray();
    console.log(`   Total batches: ${allBatches.length}\n`);

    if (allBatches.length > 0) {
        for (const batch of allBatches) {
            console.log(`   📚 ${batch.batchName} (${batch.batchCode})`);
            console.log(`      ID: ${batch._id}`);
            console.log(`      Status: ${batch.status}`);
            console.log(`      Enrolled: ${batch.enrolledCount || 0} students`);
            console.log('');
        }
    }

    // 4. Check live classes
    console.log('4️⃣ Checking live classes...');
    const liveClasses = await LiveClass.find({}).toArray();

    if (liveClasses.length === 0) {
        console.log('❌ No live classes found!\n');
    } else {
        console.log(`✅ Found ${liveClasses.length} live class(es):\n`);

        for (const liveClass of liveClasses) {
            const batch = await Batch.findOne({ _id: liveClass.batch });
            console.log(`   📹 ${liveClass.title || 'Untitled Class'}`);
            console.log(`      Class ID: ${liveClass._id}`);
            console.log(`      Batch: ${batch ? batch.batchName : 'Unknown'}`);
            console.log(`      Batch ID: ${liveClass.batch}`);
            console.log(`      Status: ${liveClass.status}`);
            console.log(`      Date: ${liveClass.classDate ? new Date(liveClass.classDate).toLocaleDateString() : 'N/A'}`);
            console.log(`      Meeting Link: ${liveClass.meetingLink || 'N/A'}`);
            console.log('');
        }
    }

    // 5. Check notifications for student
    console.log('5️⃣ Checking student notifications...');
    const notifications = await Notification.find({ forUser: student._id }).toArray();

    if (notifications.length === 0) {
        console.log('❌ No notifications for student!\n');
    } else {
        console.log(`✅ Found ${notifications.length} notification(s):\n`);

        for (const notif of notifications) {
            console.log(`   🔔 ${notif.title}`);
            console.log(`      Message: ${notif.message}`);
            console.log(`      Type: ${notif.type}`);
            console.log(`      Read: ${notif.isRead ? 'Yes' : 'No'}`);
            console.log(`      Created: ${new Date(notif.createdAt).toLocaleString()}`);
            console.log('');
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Student: ${student.firstName} ${student.lastName}`);
    console.log(`Enrollments: ${enrollments.length}`);
    console.log(`Total Batches: ${allBatches.length}`);
    console.log(`Total Live Classes: ${liveClasses.length}`);
    console.log(`Student Notifications: ${notifications.length}`);
    console.log('='.repeat(60));

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
