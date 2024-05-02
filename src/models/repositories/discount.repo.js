"use strict";

const {
    convertToObjectIdMongodb,
    getUnSelectData,
    getSelectData,
} = require("../../utils");
const discount = require("../discount.model");

const findDiscountByCodeAndShopId = async ({
    discount_code,
    discount_shopId,
}) => {
    return await discount.findOne({
        discount_code,
        discount_shopId,
    });
};

const createNewDiscount = async ({
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_is_active,
    discount_shopId,
    discount_min_order_value,
    discount_applies_to,
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_max_value,
    discount_max_uses,
    discount_uses_count,
    discount_max_uses_per_user = 1,
    discount_product_ids = [],
}) => {
    return await discount.create({
        discount_code,
        discount_start_date,
        discount_end_date,
        discount_is_active,
        discount_shopId,
        discount_min_order_value,
        discount_applies_to,
        discount_name,
        discount_description,
        discount_type,
        discount_value,
        discount_max_value,
        discount_max_uses,
        discount_uses_count,
        discount_max_uses_per_user,
        discount_product_ids,
    });
};

const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter,
    unSelect,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean();
};

const findAllDiscountCodesSelect = async ({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter,
    select,
    model,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
};

const deleteADiscount = async ({ model, filter }) => {
    return await model.findOneAndDelete(filter);
};

module.exports = {
    findDiscountByCodeAndShopId,
    createNewDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    deleteADiscount,
};
