'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const createAuthToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, { 
        subject: user.username,
        expiresIn: JWT_EXPIRY
    });
};

const router = express.Router();
const options = {
session: false,
failtWithError: true
};
const localAuth = passport.authenticate('local', options)

// SignIn
router.post('/signin', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    return res.json({authToken})
})

// AuthRefresh
const jwtAuth = passport.authenticate('jwt', options)
router.post('/token-refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    return res.json({ authToken })
})

module.exports = router;