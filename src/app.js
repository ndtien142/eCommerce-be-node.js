require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// init db
require("./dbs/init.mongodb");

// router
// app.get("/", (req, res, next) => {
//     return res.status(200).json({
//         message: "Welcome to my backend app eCommerce!",
//     });
// });

// init routers
app.use("", require("./routers"));

// handling error
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message,
    });
});

module.exports = app;
