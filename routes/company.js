const express = require("express");
const companyRouter = express.Router();
const { Company } = require('../models/company');
const User = require('../models/user');

// GET all companies
companyRouter.get('/', async (request, response, next) => {
  let companies = await Company.find({ is_deleted: false });

  if (companies.length === 0) {
    return response.status(400).json({ message: 'no companies found' });
  }

  companies = companies.map((company) => {
    return company.serialize();
  });

  return response.status(200).json(companies);
});

// Get company by ID
companyRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params;

  let company = await Company.findOne({ _id: id, is_deleted: false });

  if (!company) {
    return response.status(400).json({ message: 'no company found' });
  }

  return response.status(200).json(company.serialize());
});

// POST create company
companyRouter.post('/', async (request, response, next) => {
  let { user, name } = request.body;

  // check for missing required parameters
  let requiredFields = ['user', 'name'];
  let missingFields = [];
  requiredFields.forEach((field) => {
    if (!request.body[field] && field !== '') {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return response
      .status(400)
      .json({ message: `required field(s) missing: ${missingFields}` });
  }

  // ensure the user provided is indeed a real user
  let userExists = await User.findOne({ _id: user });

  if (!userExists) {
    return response.status(400).json({
      message: 'user does not exist. Please provide a valid admin user',
    });
  }

  // create the new company object
  let company = await new Company({
    admin: user,
    name,
  });

  if (!company) {
    return response
      .status(400)
      .json({ message: 'the company could not be created' });
  }
  company.save();

  return response.status(201).json({ message: 'company created' });
});

// PUT company
companyRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params;

  let editableFields = ['name'];

  let company = await Company.findOne({ _id: id });

  if (!company) {
    return response.status(400).json({ message: 'company could not be found' });
  }

  editableFields.forEach((field) => {
    if (request.body[field] && company[field]) {
      company[field] = request.body[field];
    }
  });

  company.save();

  return response.status(200).json(company.serialize());
});

// DELETE company
companyRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params;

  let company = await Company.findOne({ _id: id });

  if (!company) {
    return response.status(400).json({ message: 'company does not exist' });
  } else {
    company.is_deleted = true;
    company.save();
    return response
      .status(200)
      .json({ message: 'company deleted successfully' });
  }
});

module.exports = companyRouter;
