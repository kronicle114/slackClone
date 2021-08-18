'use strict';
const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* ====== GET ALL USERS ====== */
// Used in registration validation for duplicate username
router.get('/', (req, res, next) => {
    const { search } = req.query;
    let filter = {};

    if (search) {
        // const re = new RegExp(search, 'i');
        filter.$or = [{ 'username': search }];
    }

    return User
        .find(filter)
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

/* ====== POST/CREATE user on /api/users ====== */
router.post('/', (req, res, next) => {
    const requiredFields = ['username', 'password', 'email'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        const err = new Error(`missing '${missingField}' in request body`);
        err.status = 422;
        return next(err);
    }

    const stringFields = ['username', 'password', 'email', 'name'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string');

    if (nonStringField) {
        const err = new Error(`'${nonStringField}' must be a string`);
        err.status = 422;
        return next(err);
    }

    // Validate username and password and email have no whitespace
    const explicityTrimmedFields = ['username', 'password', 'email'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => {
            return req.body[field].trim() !== req.body[field];
        }
    );

    if (nonTrimmedField) {
        const err = new Error(`'${nonTrimmedField}' cannot have white space.`);
        err.status = 422;
        return next(err);
    }

    // Validate lengths of username and password
    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 8,
            max: 72
        },
        email: {
            min: 1
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(field =>
        'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);

    const tooLargeField = Object.keys(sizedFields).find(field =>
        'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField) {
        const min = sizedFields[tooSmallField].min;
        const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
        err.status = 422;
        return next(err);
    }

    if (tooLargeField) {
        const max = sizedFields[tooLargeField].max;
        const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
        err.status = 422;
        return next(err);
    }

    let { username, password, email, name } = req.body;

    if (name) {
        name = name.trim();
    }

    return User.hashPassword(password)
        .then(digest => {
            const newUser = {
                username,
                name,
                email,
                password: digest,
            };
            return User.create(newUser);
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.code === 11000) {
                err = {
                    message: 'The username already exists',
                    reason: 'ValidationError',
                    location: 'username',
                    status: 422
                };
            }
            next(err);
        });
});

/* ====== PUT reset password via username ====== */
router.put('/:username', (req, res, next) => {
    const { username } = req.params;
    const newPassword = req.body.password;

    if(!username || !newPassword) {
        const err = {
            message: `Missing userId or password`,
            reason: 'MissingContent',
            status: 400,
            location: 'put'
        }
        return next(err)
    }

    return User.hashPassword(newPassword)
        .then(digest => User.findOne({username}).update({password: digest}))
        .then(data => res.json(data))
        .catch(err => next(err))
})


module.exports = router;