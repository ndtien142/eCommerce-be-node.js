"use strict";

const {
    DiscountTypeAppliesTo,
    DiscountType,
} = require("../common/enum/global.enum");
/*
    Discount services
    1 - Generator discount code [shop | admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount user [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
*/

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
    findDiscountByCodeAndShopId,
    createNewDiscount,
    findAllDiscountCodesUnSelect,
    deleteADiscount,
} = require("../models/repositories/discount.repo");
const { findAllProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

class DiscountService {
    /*
        Create new discount [Shop | Admin]
    */
    static async createDiscountCode(body) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            product_ids,
        } = body;
        if (
            new Date() < new Date(start_date) ||
            new Date(end_date) < new Date()
        )
            throw new BadRequest("Discount code has expired!");

        if (new Date(start_date) >= new Date(end_date))
            throw new BadRequest("Start date must be before end date!");

        // create index for discount code
        const foundDiscount = await findDiscountByCodeAndShopId({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });

        if (foundDiscount)
            throw new BadRequest("Discount code has already existed!");

        const newDiscount = await createNewDiscount({
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_min_order_value: min_order_value,
            discount_applies_to: applies_to,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_product_ids: product_ids ?? [],
        });

        return newDiscount;
    }

    /* 
        Get all discount code available with products [Shop | Admin] 
    */
    static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
        const foundDiscount = await findDiscountByCodeAndShopId({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });
        if (!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("Discount code not found!");

        const { discount_applies_to, discount_product_ids } = foundDiscount;

        let products;

        if (discount_applies_to === DiscountTypeAppliesTo.ALL) {
            products = await findAllProduct({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        if (discount_applies_to === DiscountTypeAppliesTo.SPECIFIC) {
            products = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        return products;
    }

    /*
        Get all discount code by [Shop | Admin]
    */
    static async getAllDiscountCodeByShop({ shopId, limit, page }) {
        const discounts = await findAllDiscountCodesUnSelect({
            model: discount,
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ["__v", "discount_shopId"],
        });

        return discounts;
    }

    /* 
        Apply discount code | Get discount amount [User]
        product = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await findDiscountByCodeAndShopId({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });
        if (!foundDiscount) throw new NotFoundError("Discount not found");

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_value,
            discount_type,
        } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError("Discount expired");
        if (!discount_max_uses)
            throw new NotFoundError("Discount are out of range");

        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        )
            throw new NotFoundError("Discount code has expired");

        // check set minimum value of order
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total value of order
            totalOrder = products?.reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
            );
            if (totalOrder < discount_min_order_value)
                throw new NotFoundError(
                    "Discount requires a minimum value of " +
                        discount_min_order_value
                );
        }

        // check number of user use discount
        if (discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find(
                (user) => user.userId === userId
            );
            // check if exist in max discount used per user
            if (userUseDiscount) {
                // count user in discount_user_used
                const userUserCount = discount_user_used.filter(
                    (user) => user.userId === userId
                )?.length;
                if (userUserCount >= discount_max_uses_per_user)
                    throw new NotFoundError(
                        "Discount max to apply for this user"
                    );
            }
        }

        // check discount fixed or percentage
        const amount =
            discount_type === DiscountType.FIXED
                ? discount_value
                : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    /*
        Delete a discount
        Delete has 2 ways popular
            - Delete a discount from database and store to another database. This way backup, restores, and reduce index for current database.
            - Add a field flag to delete a discount. The default is false. This way has disadvantages for the database
    */
    static async deleteDiscountCode({ code, shopId }) {
        const deleteDiscount = await deleteADiscount({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });

        return deleteDiscount;
    }

    /*
        Cancel discount code
    */
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await findDiscountByCodeAndShopId({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });
        if (!foundDiscount) throw new NotFoundError("Discount doesn't exist");

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });

        return result;
    }
}

module.exports = DiscountService;
