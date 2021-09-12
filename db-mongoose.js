'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL } = require('./config');

function dbConnect(url = DATABASE_URL) {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(()=> console.log('Connected to the db '))
    .catch(err => {
        console.error('Mongoose failed to connect');
        console.error(err);
        process.exit();
    });
}

function dbDisconnect() {
    return mongoose.disconnect();
}

function dbGet() {
    return mongoose;
}

module.exports = {
    dbConnect,
    dbDisconnect,
    dbGet
};