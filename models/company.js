"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Company schema
const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

// static methods

// instance methods

const Company = mongoose.model("Company", CompanySchema);

module.exports = {
  CompanySchema,
  Company,
};
