const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0')
    .then(async () => {
        // Get enrollment course ID
        const enrollment = await mongoose.connection.db.collection('enrollments').findOne({});
        const enrollCourseId = enrollment.course;

        console.log('Enrollment course ID:', enrollCourseId.toString());

        // Update all batches to use the same course
        const result = await mongoose.connection.db.collection('batches').updateMany(
            {},
            { $set: { course: enrollCourseId } }
        );

        console.log('Updated', result.modifiedCount, 'batch(es)');

        // Verify
        const batch = await mongoose.connection.db.collection('batches').findOne({});
        console.log('Batch now has course:', batch.course.toString());
        console.log('Match:', batch.course.toString() === enrollCourseId.toString());

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
