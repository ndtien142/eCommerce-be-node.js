"use strict";
// Apply singleton design pattern

const mongoose = require("mongoose");

const connectString = `mongodb://127.0.0.1:27017/shopDEV`;

class Database {
  constructor() {
    this.connect;
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
    } else {
      return Database.instance;
    }
  }
}

const instanceMongodb = Database.instance;

module.exports = instanceMongodb;