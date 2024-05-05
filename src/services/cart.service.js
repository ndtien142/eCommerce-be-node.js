"use strict";

const {
    createUserCart,
    findCartByUserId,
    updateUserCartQuantity,
    deleteUserCartItem,
    getListUserCart,
    findCartProductItem,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");
const { CartStateEnum } = require("../common/enum/global.enum");

/**
 * Key features: Cart Service
 * 1 - Add product to cart [User]
 * 2 - Reduce product quantity [User]
 * 3 - Increase product quantity [User]
 * 4 - Get list to cart [User]
 * 5 - Delete cart [User]
 * 6 - Delete cart item [User]
 */

class CartService {
    // add product to cart
    static async addToCart({ userId, product = {} }) {
        // check cart exist
        const foundCart = await findCartByUserId(userId);
        if (!foundCart) {
            // create new cart
            return await createUserCart({ userId, product });
        }

        // if cart already exists but array product is empty
        if (!foundCart.cart_products.length) {
            foundCart.cart_products = [product];
            return await foundCart.save();
        }

        const foundCartProductItem = await findCartProductItem({
            productId: product?.productId,
            userId,
        });
        if (foundCartProductItem) {
            // if cart already exists and already has product will update quantity
            console.log("found cart product item: ", foundCartProductItem);
            return await updateUserCartQuantity({
                userId,
                product,
            });
        }

        return await createUserCart({ userId, product });
    }

    // update cart
    /* 
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        price,
                        shopId,
                        quantity,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
    static async addToCartV2({ userId, shop_order_ids = [] }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];
        // check product
        const foundProduct = await getProductById(productId);
        if (!foundProduct) throw new NotFoundError("Product not found");

        // compare product shop vs shop id
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError("Product do not belong to the shop");

        if (quantity === 0) {
            // delete product from cart
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        });
    }

    // delete
    static async deleteCartItem({ userId, productId }) {
        const foundCart = await findCartByUserId(userId);
        if (!foundCart) throw new NotFoundError("Cart not found");

        return await deleteUserCartItem({ userId, productId });
    }

    static async getListUserCart({ userId }) {
        const filter = {
            cart_userId: userId,
            cart_state: CartStateEnum.ACTIVE,
        };
        return await getListUserCart({ filter });
    }
}

module.exports = CartService;
