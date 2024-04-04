"use strict";

// level 0

const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        host: "127.0.0.1",
        port: 27017,
        name: "shopDEV",
    },
};

module.exports = config;
