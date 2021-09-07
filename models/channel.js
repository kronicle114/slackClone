'use strict';
// TODO: add members & messages embed

const mongoose = require('mongoose');

// Define Channel Schema
const ChannelSchema = new mongoose.Schema({
    date_created: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: '',
    },
    topic: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Channel', ChannelSchema);