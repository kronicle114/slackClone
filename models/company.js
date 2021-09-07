'use strict';

const mongoose = require('mongoose');

// Define Company Schema
const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
    },
    date_created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Company', CompanySchema);