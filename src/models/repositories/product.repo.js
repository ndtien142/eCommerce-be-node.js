"use strict";

const { Types } = require("mongoose");
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
    return await queryProduct({ limit, skip, query });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ limit, skip, query });
};

const queryProduct = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublish = true;

    const { modifiedCount } = await product.updateOne(
        { _id: product_id, product_shop },
        {
            isDraft: false,
            isPublish: true,
            updateAt: Date.now(),
        }
    );

    return modifiedCount;
};

module.exports = {
    findAllDraftForShop,
    findAllPublishForShop,
    publishProductByShop,
};
