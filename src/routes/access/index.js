"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

// Signup routes
router.post("/shop/signup", asyncHandler(accessController.signUp));

// Login routes
router.post("/shop/login", asyncHandler(accessController.login));

module.exports = router;
