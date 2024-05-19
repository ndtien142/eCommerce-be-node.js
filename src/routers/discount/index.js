"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// post amount a discount
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
// get list product code
router.get(
    "/list-product-code",
    asyncHandler(discountController.getAllDiscountCodeWithProduct)
);

// authentication
router.use(authenticationV2);
///////////////////////
router.post("", asyncHandler(discountController.createDiscount));
router.get("", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
