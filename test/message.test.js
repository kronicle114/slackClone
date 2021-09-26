'use strict'

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Message = require('../models/company');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Message Test Suit', () => {

    describe('GET /api/message', () => {

        it('returns a 200 status code', async () => {
            let response = await chai.request(app).get('/api/message');
            
            expect(response).to.have.status(200)
            expect(response.body).to.equal('hello, world!')
        });
    });
});