const express = require("express");
const companyRouter = express.Router();

companyRouter.get("/", (request, response, next) => {
  return response.status(200).json("hello, world!");
});

module.exports = companyRouter;
