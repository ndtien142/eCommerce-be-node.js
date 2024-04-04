"use strict";

// level 0

// const config = {
//     app: {
//         port: process.env.PORT || 3000,
//     },
//     db: {
//         host: "127.0.0.1",
//         port: 27017,
//         name: "shopDEV",
//     },
// };

// level 1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || `localhost`,
        port: process.env.DEV_DB_PORT || 3000,
        name: process.env.DEV_DB_NAME || "dev",
    },
};

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3000,
    },
    db: {
        host: process.env.PRO_DB_HOST || `localhost`,
        port: process.env.PRO_DB_PORT || 3000,
        name: process.env.PRO_DB_NAME || "pro",
    },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
