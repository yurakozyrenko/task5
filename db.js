require('dotenv').config();
const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.URL);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectToDb;
