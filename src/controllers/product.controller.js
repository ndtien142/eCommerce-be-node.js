"use strict";

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.levelup");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
    // Create new product V1
    // createProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "Create new product success!",
    //         metadata: await ProductService.createProduct(
    //             req.body.product_type,
    //             { ...req.body, product_shop: req.user.userId }
    //         ),
    //     }).send(res);
    // };

    // Create new product V2
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new product success!",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                { ...req.body, product_shop: req.user.userId }
            ),
        }).send(res);
    };

    // ========== QUERY ============
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} res
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all drafts product success!",
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new ProductController();
