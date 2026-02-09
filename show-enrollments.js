const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://zayedd:zayedd@cluster0.b5kfivm.mongodb.net/zayedd?appName=Cluster0')
    .then(async () => {
        const e = await mongoose.connection.db.collection('enrollments').findOne({});
        if (!e) {
            console.log('No enrollments found');
            process.exit(0);
        }

        const u = await mongoose.connection.db.collection('users').findOne({ _id: e.student });
        const c = await mongoose.connection.db.collection('courses').findOne({ _id: e.course });
        const b = await mongoose.connection.db.collection('batches').findOne({ course: e.course });

        console.log('USER:', u ? (u.firstName || u.name) : 'Unknown');
        console.log('COURSE:', c ? c.title : 'Unknown');
        console.log('BATCH:', b ? b.batchName : 'None');
        console.log('STATUS:', b ? b.status : 'N/A');

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
