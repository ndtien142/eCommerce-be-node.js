const { Schema, Types, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
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
        // fix product
        product_slug: String,
        product_ratingAverage: {
            type: Number,
            default: 4,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be under 5.0"],
            // 4.345666 => 4.3
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variation: { type: Array, default: [] },
        // select = true so that use find one or find will not select this field
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);
// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create()...
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

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
