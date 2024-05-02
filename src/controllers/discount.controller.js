"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
    /**
     * @desc create new discount for shop or admin
     * @param {Object} body
     * @return {JSON}
     */
    createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new discount success!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    /**
     * @desc get all discount code
     * @param {Object} body
     * @return {JSON}
     */
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    /**
     * @desc get discount amount
     * @param {Object} body
     * @return {JSON}
     */
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };
    /**
     * @desc get all discount codes with product
     * @param {Object} body
     * @return {JSON}
     */
    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful Code Found",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
