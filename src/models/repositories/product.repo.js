"use strict";

const {
    product,
    electronic,
    clothing,
    furniture,
} = require("../product.model");

/**
 *
 * @param {query, limit, skip}
 * @returns all products draft
 * exec representation for use async await in mongoose
 */

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

module.exports = {
    findAllDraftForShop,
};
