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
    ref: 'user',
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

// static methods

// instance methods
CompanySchema.methods.serialize = function serialize() {
  return {
    id: this._id,
    name: this.name,
    admin: this.admin,
    is_deleted: this.is_deleted,
  };
};

const Company = mongoose.model("Company", CompanySchema);

module.exports = {
  CompanySchema,
  Company,
};
