"use strict";

const { BadRequestError } = require("../core/error.response");
const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObject } = require("../utils");

// Define Factory class to create product

class ProductFactory {
    // key-class
    static productRegistry = {};

    static registryProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    /**
     * type: "Clothing"
     * payload
     */
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).updateProduct(productId);
    }

    // Query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    // PUT
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }

    // Search
    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProduct({
            limit,
            sort,
            page,
            filter,
            select: [
                "product_name",
                "product_price",
                "product_thumb",
                "product_description",
            ],
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] });
    }
}

/*
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

*/

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create a new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({
            productId,
            bodyUpdate,
            model: product,
        });
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing)
            throw new BadRequestError("Create new clothing error");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("Create new product error");

        return newProduct;
    }

    // ======== UPDATE PRODUCT CLOTHING =============
    async updateProduct(productId) {
        // 1. Remove attributes has null or undefined
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObject(objectParams.product_attributes),
                model: clothing,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObject(objectParams)
        );
        return updateProduct;
    }
}

// define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new BadRequestError("Create new electronic error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new product error");

        return newProduct;
    }

    // ======== UPDATE PRODUCT ELECTRONIC =============
    async updateProduct(productId) {
        // 1. Remove attributes has null or undefined
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObject(objectParams.product_attributes),
                model: electronic,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObject(objectParams)
        );
        return updateProduct;
    }
}

// define sub-class for different types of Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture)
            throw new BadRequestError("Create new furniture error");

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("Create new product error");

        return newProduct;
    }

    // ======== UPDATE PRODUCT FURNITURE =============
    async updateProduct(productId) {
        // 1. Remove attributes has null or undefined
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObject(objectParams.product_attributes),
                model: furniture,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObject(objectParams)
        );
        return updateProduct;
    }
}

// register product type
// Apply strategy can add new type on runtime
ProductFactory.registryProductType("Electronic", Electronic);
ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Furniture", Furniture);

module.exports = ProductFactory;
