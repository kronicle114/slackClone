'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const User = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);

describe('SlackClone - Users Test Suite', function () {
    const name = 'Trisha Aguinaldo';
    const email = 'test_user@gmail.com';
    const confirmEmail = 'test_user@gmail.com';
    const username = 'exampleUser';
    const password = 'examplePass';
    const confirmPassword = 'examplePass';
    const emptyUsername = '';
    const emptyPassword = '';
    const undefinedUsername = undefined;
    const undefinedPassword = undefined;
    const emptySpaceUsername = 'exampleUser   ';
    const emptySpacePassword = 'examplePass   ';
    const nullUsername = null;
    const nullPassword = null;
    const bigasspass = 'qwertyuiojdhlkjsahdflkjasdhflkjashdlfkjashdlkfjahslkdjfhalksjdfhlkasjdfhlkasjdhflkajsdhflkajsdhflkjasdhflkjahsdlfkjahlsdkjfhalskdjfhlaksjdfhlkasjdfhlaksjdfhlkasjdfhlkasjdfhlkasjdfhlkajsdfhlkajsdhflkajsdhflkjasdhfkljasdhflkajsdhflkajsdfhlkajsdfhlaksjdfhlaksjdfhaslkjdfhaslkdjfhaslkdjf';

    before(function () {
        return dbConnect(TEST_DATABASE_URL)
            .then(() => {return User.deleteMany()});
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

    describe('POST /api/users', function () {

        it('Should create a new user', function () {
            let res;
            return chai
                .request(app)
                .post('/api/users')
                .send({ name, username, password, confirmPassword, email, confirmEmail })
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('id', 'username', 'name');
                    expect(res.body.id).to.exist;
                    expect(res.body.username).to.equal(username);
                    return User.findOne({ username: 'exampleUser' });
                })
                .then(user => {
                    expect(user).to.exist;
                    expect(user.id).to.equal(res.body.id);
                    return user.validatePassword(password);
                })
                .then(isValid => {
                    expect(isValid).to.be.true;
                });
        });

        it('Should reject users with missing username', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username: emptyUsername, password, confirmPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with missing password', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username, password: emptyPassword, confirmPassword: emptyPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with non-string username', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username: undefinedUsername, password, confirmPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with non-string password', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username, password: undefinedPassword, confirmPassword: undefinedPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with non-trimmed username', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username: emptySpaceUsername, password, confirmPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with non-trimmed password', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username, password: emptySpacePassword, confirmPassword: emptySpacePassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with empty username', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username: nullUsername, password, confirmPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with password less than 10 characters', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username, password: nullPassword, confirmPassword: nullPassword, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with password greater than 72 characters', function () {
            let res;
            return chai.request(app)
                .post('/api/users')
                .send({ name, username, password: bigasspass, confirmPassword: bigasspass, email, confirmEmail })
                .then(result => {
                    res = result;
                    expect(res).to.have.status(422);
                });
        });

        it('Should reject users with duplicate username', function () {
            return User.create({ name, username: 'msgreen', password, confirmPassword, email, confirmEmail })
                .then(() => {
                    return chai.request(app)
                        .post('/api/users')
                        .send({ name, username: 'msgreen', password, confirmPassword, email, confirmEmail })
                        .then(result => {
                            expect(result).to.have.status(422);
                        });
                });
        });
    });
});