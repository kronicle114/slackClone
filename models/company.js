'use strict';
import User from './user'

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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Company', CompanySchema);