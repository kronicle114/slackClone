'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe('SlackClone - Auth Test Suite', function () {
    const validEmail = 'trisha@gmail.com'
    const validName = 'Trisha Aguinaldo'
    const validUsername = 'exampleUser';
    const validPassword = 'examplePass';
    let validUser = {}

    before(function () {
        return dbConnect(TEST_DATABASE_URL)
    });
    beforeEach(function () {
        return User.createIndexes();
    });
    afterEach(function () {
        return User.deleteMany();
    });
    after(function () {
        return dbDisconnect();
    });

    
    describe('POST /api/auth/signin', function () {
        it('Should create an authToken', function () {
            let res;
            return chai
                .request(app)
                .post('/api/users/')
                .send({
                    username: validUsername,
                    name: validName,
                    email: validEmail,
                    password: validPassword
                })
                .then(_ => {
                    return chai.request(app)
                        .post('/api/auth/signin')
                        .send({ username: validUsername, password: validPassword })
                        .then(res => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property("authToken")
                        })
                })
        });
    });
});