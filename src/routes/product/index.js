"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get(
    "/search/:keySearch",
    asyncHandler(productController.getSearchProductForUser)
);

// authentication
router.use(authenticationV2);
///////////////////////
router.post("", asyncHandler(productController.createProduct));
router.put(
    "/published/:id",
    asyncHandler(productController.handlePublishProductByShop)
);
router.put(
    "/unpublished/:id",
    asyncHandler(productController.handleUnPublishProductByShop)
);

// ======= QUERY ========
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
