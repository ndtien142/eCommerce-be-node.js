require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet);
app.use(compression());

// init db
require("./dbs/init.mongodb.js");
const {
    countConnections,
    checkOverloadServer,
} = require("./helpers/check.connect.js");

countConnections();
// checkOverloadServer();

// router
app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to my backend app eCommerce!",
    });
});

// handling error

module.exports = app;
