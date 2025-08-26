const mongoose = require('mongoose');

const connectToDatabase = async function () {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database is connected');
    } catch (error) {
        console.error('Error while connecting to database:', error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
