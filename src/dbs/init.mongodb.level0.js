"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://127.0.0.1:27017/shopDEV`;

mongoose
  .connect(connectString)
  .then((connection) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log(error));

// dev
if (1 == 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;

// ---------------------------EXPLAIN CONNECT LEVEL 0-------------------------------
/*
  
  In Node.js, when using require, modules are cached in memory, but not to maintain connections to the database. Each time you call require for a module, the code within that module is executed, and variables within that module are exported. There is no automatic database connection occurring with each require.

  In Java and PHP, modules are not cached in memory like in Node.js, but database connections also do not occur every time a module is called. Typically, the database connection is established within a part of the application called a class or a singleton object, and it is reused throughout the application.

  Don't use this init connection for real applications.

*/
