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

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
        .find(
            { isDraft: false, $text: { $search: regexSearch } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return results;
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

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null;

    const { modifiedCount } = await product.updateOne(
        { _id: product_id, product_shop },
        {
            isDraft: true,
            isPublish: false,
            updateAt: Date.now(),
        }
    );

    return modifiedCount;
};

module.exports = {
    findAllDraftForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
};
