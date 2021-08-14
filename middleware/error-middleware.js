'use strict';

// Custom 404 Not Found route handler
const error404 = (req, res, next) => {
    const err = new Error('Not Found');
    err.code = 404;
    next(err);
};

// Custom Error Handler
// eslint-disable-next-line no-unused-vars
const error500 = (err, req, res, next) => {
    if (err.code) {
        const errBody = Object.assign({}, err, { message: err.message });
        res.status(err.code).json(errBody);
    } else if (err.status) {
        err.code = err.status;
        res.status(err.code).json(err);
    } else {
        // eslint-disable-next-line no-console
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', code: 500 });
    }
};

module.exports = {
    error404,
    error500,
};