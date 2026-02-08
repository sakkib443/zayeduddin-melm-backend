// Script to enroll Student1@gmail.com in a batch and add a test class
const mongoose = require('mongoose');

// MongoDB connection string (MongoDB Atlas)
const MONGO_URI = 'mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0';

async function main() {
    try {
        // Connect to database
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get models
        const User = mongoose.connection.collection('users');
        const Course = mongoose.connection.collection('courses');
        const Batch = mongoose.connection.collection('batches');
        const Enrollment = mongoose.connection.collection('enrollments');
        const LiveClass = mongoose.connection.collection('liveclasses');
        const Notification = mongoose.connection.collection('notifications');

        // Step 1: Find a student user
        console.log('\n📍 Step 1: Finding student...');
        const student = await User.findOne({
            $or: [
                { email: { $regex: 'student', $options: 'i' } },
                { firstName: { $regex: 'student', $options: 'i' } }
            ]
        });

        if (!student) {
            console.log('❌ No student user found in database!');
            console.log('Please create a student user first from the frontend.');
            process.exit(1);
        }

        console.log(`✅ Found student: ${student.firstName} ${student.lastName} (${student.email})`);
        console.log(`   🆔 ID: ${student._id}`);

        // Step 2: Find or Create a Batch
        console.log('\n📍 Step 2: Finding active batch...');
        let batch = await Batch.findOne({ status: 'upcoming' });

        if (!batch) {
            console.log('⚠️ No active batch found. Creating a test batch...');

            // Find any course
            const course = await Course.findOne();
            if (!course) {
                console.log('❌ No course found. Please create a course first.');
                process.exit(1);
            }

            // Create test batch
            const batchData = {
                course: course._id,
                batchName: 'Test Batch - January 2026',
                batchCode: 'TB-JAN-2026',
                description: 'Test batch for enrollment demonstration',
                startDate: new Date('2026-02-15'),
                endDate: new Date('2026-04-30'),
                enrollmentDeadline: new Date('2026-02-10'),
                maxStudents: 50,
                enrolledCount: 0,
                schedule: [
                    { day: 'saturday', startTime: '10:00 AM', endTime: '12:00 PM' },
                    { day: 'tuesday', startTime: '10:00 AM', endTime: '12:00 PM' }
                ],
                status: 'upcoming',
                isActive: true,
                meetingLink: 'https://zoom.us/j/test-meeting',
                platform: 'zoom',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await Batch.insertOne(batchData);
            batch = { _id: result.insertedId, ...batchData };
            console.log(`✅ Created new batch: ${batch.batchName} (ID: ${batch._id})`);
        } else {
            console.log(`✅ Found batch: ${batch.batchName} (ID: ${batch._id})`);
        }

        // Step 3: Enroll Student in Batch
        console.log('\n📍 Step 3: Enrolling student in batch...');

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: student._id,
            batch: batch._id
        });

        if (existingEnrollment) {
            console.log('✅ Student is already enrolled in this batch!');
        } else {
            const enrollmentData = {
                student: student._id,
                course: batch.course,
                batch: batch._id,
                enrolledAt: new Date(),
                status: 'active',
                progress: 0,
                completedLessons: 0,
                totalLessons: 0,
                certificateEligible: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await Enrollment.insertOne(enrollmentData);

            // Update batch enrolled count
            await Batch.updateOne(
                { _id: batch._id },
                { $inc: { enrolledCount: 1 } }
            );

            console.log('✅ Student successfully enrolled in batch!');
        }

        // Step 4: Add a Test Live Class
        console.log('\n📍 Step 4: Adding test live class...');

        const classData = {
            batch: batch._id,
            instructor: student._id, // Using same student as instructor for demo
            title: 'Introduction to Web Development',
            description: 'This is a test class to demonstrate the notification system',
            classNumber: 1,
            classDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            duration: 120,
            meetingLink: 'https://zoom.us/j/123456789',
            meetingId: '123-456-789',
            meetingPassword: 'test123',
            platform: 'zoom',
            status: 'scheduled',
            notificationSent: false,
            reminderSent: false,
            liveNotificationSent: false,
            attendees: [],
            resources: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const liveClassResult = await LiveClass.insertOne(classData);
        console.log(`✅ Created live class: ${classData.title} (ID: ${liveClassResult.insertedId})`);

        // Step 5: Send Notification to Student
        console.log('\n📍 Step 5: Sending notification to student...');

        const notificationData = {
            type: 'live_class',
            title: '📅 New Class Scheduled',
            message: `A new class "${classData.title}" has been scheduled for your batch.`,
            data: {
                liveClassId: liveClassResult.insertedId,
                batchId: batch._id,
                link: '/dashboard/user/live-classes'
            },
            isRead: false,
            forAdmin: false,
            forUser: student._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await Notification.insertOne(notificationData);
        console.log('✅ Notification sent to student!');

        // Summary
        console.log('\n\n🎉 ============ SUCCESS SUMMARY ============');
        console.log(`📧 Student Email: Student1@gmail.com`);
        console.log(`👤 Student Name: ${student.firstName} ${student.lastName}`);
        console.log(`📚 Batch: ${batch.batchName} (${batch.batchCode})`);
        console.log(`🎓 Class: ${classData.title}`);
        console.log(`🔗 Meeting Link: ${classData.meetingLink}`);
        console.log(`📅 Class Date: ${classData.classDate.toLocaleDateString()}`);
        console.log(`⏰ Time: ${classData.startTime} - ${classData.endTime}`);
        console.log(`🔔 Notification: Sent!`);
        console.log('==========================================\n');

        console.log('✅ All done! Now login as Student1@gmail.com to see the notification.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    }
}

main();
