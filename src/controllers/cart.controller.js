"use strict";

const CartService = require("../services/cart.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class CartController {
    /**
     * @desc add to cart for user
     * @param {Object} body
     * @return {JSON}
     */
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart success!",
            metadata: await CartService.addToCart({
                ...req.body,
            }),
        }).send(res);
    };

    // update
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart success!",
            metadata: await CartService.addToCartV2({
                ...req.body,
            }),
        }).send(res);
    };

    // delete cart
    deleteUserCartItem = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete cart success!",
            metadata: await CartService.deleteCartItem({
                ...req.body,
            }),
        }).send(res);
    };

    // list to cart
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "List cart success!",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res);
    };
}

module.exports = new CartController();
