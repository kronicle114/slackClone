const express = require('express');
const messageRouter = express.Router();
const { Message } = require('../models/message');

messageRouter.get('/', (request, response, next) => {
  return response.status(200).json('hello, world!');
});

module.exports = messageRouter;
