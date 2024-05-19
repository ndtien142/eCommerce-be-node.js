"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        inventory_productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        inventory_location: {
            type: String,
            default: "unknown",
        },
        inventory_stock: {
            type: Number,
            required: true,
        },
        inventory_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        // Pre-order when add to cart will decrease inventory stock.
        // Expired will increase stock, but chart will keep stable
        // cartId: ,
        // stock: 2,
        // createdOn: ...
        inventory_reservations: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collectionName: COLLECTION_NAME,
    }
);

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema),
};
