"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { CartStateEnum } = require("../common/enum/global.enum");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: CartStateEnum,
            default: CartStateEnum.ACTIVE,
        },
        cart_products: { type: Array, required: true, default: [] },
        /*
            [
                {
                    productId,
                    shopId,
                    quantity,
                    price,
                    name,
                }
            ]
        */
        cart_count_products: { type: Number, default: 0 },
        cart_userId: { type: String, required: true },
    },
    {
        timestamps: true,
        collectionName: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
