"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const {
    DiscountTypeAppliesTo,
    DiscountType,
} = require("../common/enum/global.enum");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: DiscountType.FIXED }, // or percentage
        discount_value: { type: Number, required: true },
        discount_code: { type: String, required: true },
        discount_start_date: { type: Date, required: true },
        discount_end_date: { type: Date, required: true },
        discount_max_uses: { type: Number, required: true }, // max in count use
        discount_uses_count: { type: Number, require: true }, // number of discount used
        discount_users_used: { type: Array, default: [] }, // store users used to discount
        discount_max_uses_per_user: { type: Number, required: true }, // max discount used per user
        discount_min_order_value: { type: Number, required: true },
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        discount_is_active: { type: Boolean, required: true },
        discount_applies_to: {
            type: String,
            required: true,
            enum: DiscountTypeAppliesTo,
        },
        discount_product_ids: { type: Array, default: [] }, // product apply to use discount
    },
    {
        timestamps: true,
        collectionName: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
