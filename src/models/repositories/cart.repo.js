"use strict";

const { CartStateEnum } = require("../../common/enum/global.enum");
const { getUnSelectData } = require("../../utils");
const cart = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: CartStateEnum.ACTIVE },
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        },
        options = { upsert: true, new: true };
    const result = await cart.findOneAndUpdate(query, updateOrInsert, options);
    return result;
};

const findCartProductItem = async ({ userId, productId }) => {
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: CartStateEnum.ACTIVE,
    };
    return await cart.findOne(query);
};

const findCartByUserId = async (userId) => {
    return await cart.findOne({
        cart_userId: userId,
        cart_state: CartStateEnum.ACTIVE,
    });
};

// const { productId, quantity, shopId, price, name } = product;
//     const filter = {
//         cart_userId: userId,
//         cart_state: CartStateEnum.ACTIVE,
//     };

//     // Check if the product exists in the cart
//     const existingCart = await cart.findOne(filter);
//     if (existingCart) {
//         const existingProductIndex = existingCart.cart_products.findIndex(
//             (item) => item.productId === productId
//         );
//         if (existingProductIndex !== -1) {
//             // If the product already exists, update its quantity
//             existingCart.cart_products[existingProductIndex].quantity +=
//                 quantity;
//         } else {
//             // If the product doesn't exist, add it to the cart
//             existingCart.cart_products.push({
//                 productId,
//                 quantity,
//                 shopId,
//                 price,
//                 name,
//             });
//         }
//         // Update the cart in the database
//         return await cart.findOneAndUpdate(filter, existingCart, { new: true });
//     } else {
//         // If the cart doesn't exist, create a new one with the product
//         const newCart = {
//             cart_userId: userId,
//             cart_state: CartStateEnum.ACTIVE,
//             cart_products: [{ productId, quantity }],
//         };
//         // Create the cart in the database
//         return await cart.create(newCart);
//     }

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: CartStateEnum.ACTIVE,
        },
        updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        },
        options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
};

const deleteUserCartItem = async ({ userId, productId }) => {
    const query = { cart_userId: userId, cart_state: CartStateEnum.ACTIVE },
        updateSet = {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        };

    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
};

const getListUserCart = async ({
    limit = 50,
    page = 1,
    sort,
    filter,
    select,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const carts = await cart
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(select))
        .lean();
    return carts;
};

module.exports = {
    createUserCart,
    findCartByUserId,
    updateUserCartQuantity,
    deleteUserCartItem,
    getListUserCart,
    findCartProductItem,
};
