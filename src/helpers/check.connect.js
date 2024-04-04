"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// count the number of connections
const countConnections = () => {
    const numberOfConnections = mongoose.connections.length;
    console.log(`Connections: ${numberOfConnections}`);
};

// check overload server
const checkOverloadServer = () => {
    setInterval(() => {
        const numberOfConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections base on number of cores
        const maxConnections = numCores * 5;

        console.log("Memory usage: " + memoryUsage / 1024 / 1024 + " MB");

        if (numberOfConnections > maxConnections) {
            // notify sending...
            console.log(
                `Overload server: ${numberOfConnections} > ${maxConnections}`
            );
            console.log("Connection Overload Detected");
        }
    }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
    countConnections,
    checkOverloadServer,
};
