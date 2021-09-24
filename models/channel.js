"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Users } = "./user.js";

// Define Channel schema
const ChannelSchema = new Schema({
    // TODO add files schema and add as an embeddedList
    description: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    // TODO add messages schema as embeddedList
    name: {
        type: String,
        required: true,
        trim: true,
    },
    topic: {
        type: String,
    },
    users: [Users],
});

// static methods

// instance methods

module.exports = mongoose.model('Channel', ChannelSchema)