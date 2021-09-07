'use strict';
const express = require('express');
const Company = require('../models/company');

const router = express.Router();

/* ====== GET COMPANY ====== */


/* ====== CREATE COMPANY ====== */
router.post('/', (req, res, next) => {
    console.log('POST CREATE COMPANY ');
    let { name, userId } = req.body;

    // Create error handling on fields

    return Company.create({
        name,
        owner: userId
    })
        .then(data => {
            return res.location(`${req.originalUrl}/${data.id}`).status(201).json(data);
        })
        .catch(err => next(err));
});

/* ====== EDIT COMPANY ====== */