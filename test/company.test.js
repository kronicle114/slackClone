'use strict'

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Company = require('../models/company');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Company Test Suit', () => {

    describe('GET /api/company', () => {

        it('returns a 200 status code', async () => {
            let response = await chai.request(app).get('/api/company');
            
            expect(response).to.have.status(200)
            expect(response.body).to.equal('hello, world!')
        });
    });
});
