const mongoose = require('mongoose');
require('../models/User');
require('../models/Planet');

async function configDatabase() {
    const connectionString = 'mongodb://localhost:27017/exam-cosmic-explorer';

    await mongoose.connect(connectionString);

    console.log('Database connected');
    
}

module.exports = { configDatabase };