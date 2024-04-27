const { Schema, Types, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => nanoid(),
        },
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronic", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// define the product type clothing

const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "Clothes",
        timestamps: true,
    }
);

// define the product type electronic

const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "Electronic",
        timestamps: true,
    }
);

// define the product type furniture
const furnitureSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "Furniture",
        timestamps: true,
    }
);

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothes", clothingSchema),
    electronic: model("Electronic", electronicSchema),
    furniture: model("Furniture", furnitureSchema),
};
