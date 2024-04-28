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
     * @param {Number} skip
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

    // ========== QUERY ============
    /**
     * @desc Get all Published for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all published product success!",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * @desc Handle publish product By shop
     * @param {String} product_shop
     * @param {String} product_id
     * @return {JSON}
     */
    handlePublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Handle publish product success!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * @desc Handle un publish product By shop
     * @param {String} product_shop
     * @param {String} product_id
     * @return {JSON}
     */
    handleUnPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Handle publish product success!",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * @desc Get list search products for user
     * @param {String} keySearch
     * @return {JSON}
     */
    getSearchProductForUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list search product success!",
            metadata: await ProductServiceV2.searchProductByUser(req.params),
        }).send(res);
    };

    /**
     * @desc Get list products for user
     * @param {Number} limit
     * @param {string} sort
     * @param {Number} page
     * @param {Object} filter
     * @return {JSON}
     */
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list all products success!",
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res);
    };

    /**
     * @desc Get list products for user
     * @param {string} product_id
     * @return {JSON}
     */
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get product success!",
            metadata: await ProductServiceV2.findProduct(req.params),
        }).send(res);
    };
}

module.exports = new ProductController();
