"use strict";

// Apply singleton design pattern
const mongoose = require("mongoose");
const {
    db: { host, name, port },
} = require("../config/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

console.log("Connection String ", connectString);

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = "mongodb") {
        if (1 == 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString)
            .then((connection) => {
                console.log("Connected to MongoDB");
            })
            .catch((error) => console.log(error));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
