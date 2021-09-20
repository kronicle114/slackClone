'use strict'

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const { Company } = require('../models/company');
const User = require('../models/user');
const { TEST_DATABASE_URL } = require('../config');
const ObjectId = require('bson').ObjectID;

const expect = chai.expect;
chai.use(chaiHttp);

describe('Company Test Suite', () => {
  before(function () {
    return dbConnect(TEST_DATABASE_URL).then(() => {
      User.deleteMany();
      Company.deleteMany();

      return;
    });
  });
  beforeEach(function () {
    return Company.createIndexes();
  });
  after(async function () {
    await Company.deleteMany();
    await User.deleteMany();
    return dbDisconnect();
  });

  describe('POST company /api/company', () => {
    it('creates a new company', async () => {
      let user = await new User({
        name: 'Pat OConnor',
        password: 'testpass',
        username: 'testuser1',
      });

      user.save();

      let data = {
        user: user._id,
        name: 'New Test Co.',
      };

      let response = await chai.request(app).post('/api/company').send(data);
      expect(response).to.have.status(201);
    });

    it('create company fails with missing required param', async () => {
      let data = {};

      let response = await chai.request(app).post('/api/company').send(data);
      expect(response).to.have.status(400);
      expect(response.body.message).to.equal(
        'required field(s) missing: user,name'
      );
    });

    it('create company fails when a bad user is provided', async () => {
      let data = {
        user: new ObjectId(),
        name: 'New Test Co.',
      };

      let response = await chai.request(app).post('/api/company').send(data);
      expect(response).to.have.status(400);
      expect(response.body.message).to.equal(
        'user does not exist. Please provide a valid admin user'
      );
    });
  });

  describe('GET company /api/company/:id', () => {
    it('returns a specific company with matching id', async () => {
      let user1 = {
        name: 'Pat OConnor',
        password: 'testpass',
        username: 'testuser2',
      };

      user1 = new User(user1);
      user1.save();

      let company = {
        admin: user1._id,
        name: 'test company',
      };

      company = new Company(company);
      company.save();

      let response = await chai.request(app).get(`/api/company/${company._id}`);
      expect(response.body).to.be.an('object');
      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(company.id);
    });

    it('ignores deleted companies', async () => {
      let user1 = {
        name: 'Pat OConnor',
        password: 'testpass',
        username: 'testuser3',
      };

      user1 = new User(user1);
      user1.save();

      let company = {
        admin: user1._id,
        name: 'test company',
      };

      company = new Company(company);
      company.is_deleted = true;
      company.save();

      let response = await chai.request(app).get(`/api/company/${company._id}`);
      expect(response.body).to.be.an('object');
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('no company found');
    });
  });

  describe('GET company /api/company', () => {
    it('returns all companies', async () => {
      let company = await new Company({
        admin: await new ObjectId(),
        name: 'another test company',
      });

      let company2 = await new Company({
        admin: await new ObjectId(),
        name: 'hopefully the last test company',
      });

      await company.save();
      await company2.save();

      let response = await chai.request(app).get('/api/company');
      expect(response.body).to.be.an('array');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.not.equal(0);
    });

    it('returns an error if no companies are found', async () => {
      await Company.deleteMany();
      let response = await chai.request(app).get('/api/company');
      expect(response.body).to.be.an('object');
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('no companies found');
    });
  });

  describe('PUT company /api/company/:id', () => {
    it('should update a company', async () => {
      let company = await new Company({
        admin: ObjectId(),
        name: 'initial name',
      });
      await company.save();

      let data = {
        name: 'final name',
      };

      let response = await chai
        .request(app)
        .put(`/api/company/${company._id}`)
        .send(data);
      expect(response.body).to.be.an('object');
      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal('final name');
    });
  });

  describe('DELETE company /api/company/:id', () => {
    it('should delete a provided company', async () => {
      let company = await new Company({
        admin: ObjectId(),
        name: 'wow another test',
      });

      await company.save();

      let response = await chai
        .request(app)
        .delete(`/api/company/${company._id}`);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('company deleted successfully');
    });
  });
});
