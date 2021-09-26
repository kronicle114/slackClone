'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { error404, error500 } = require('./middleware/error-middleware');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

//Security
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

// Create an Express application
const app = express();

//Routers
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const companyRouter = require('./routes/company');
const messageRouter = require('./routes/message');

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

// Enable CORS to avoid fetch error:
/* 
Access to fetch at 'https://cryptic-river-94651.herokuapp.com/api/users/?search=' from origin 'https://slack-clone-client.herokuapp.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
*/
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

// Create a static webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to SlackClone application." });
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// Mount routers
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/message', messageRouter);

// Error handlers
app.use(error404);
app.use(error500);

function runServer(port = PORT) {
    const server = app
    .listen(port, () => {
        console.info(`App is listening on port ${server.address().port}`);
    })
    .on('error', err => {
        console.error('Express failed to start');
        console.error(err);
    })
}

if (require.main === module) {
    dbConnect();
    runServer();
}

module.exports = { app };