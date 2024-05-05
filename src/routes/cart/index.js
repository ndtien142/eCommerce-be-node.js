"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteUserCartItem));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.listToCart));

module.exports = router;
