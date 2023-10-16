const mongoose = require('mongoose');

async function connectDatabase(url) {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to ${url}`);
    } catch (error) {
        console.error(`Error connecting to ${url}: ${error}`);
    }
}

module.exports = connectDatabase;