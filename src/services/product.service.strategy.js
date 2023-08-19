'use strict';

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDrafForShop,
    publicProductByShop,
    findAllPublicForShop,
    unPpublicProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo');
const { updateNestedObjectParser, removeUnderfinedObject } = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');
// define Factory  class to create product

class ProductFactory {
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
        console.log(`testing product ::`, ProductFactory.productRegistry[type])
    }
    static async createProduct(type, payload) {

        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).updateProduct(product_id);
    }

    /// get a list of seller's draft (GET request)
    static async findAllDrafForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDrafForShop({ query, limit, skip })
    }
    // get a list of seller's public (GET request)
    static async findAllPublicForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublic: true }
        return await findAllPublicForShop({ query, limit, skip })
    }
    // public a product by seller (PUT request)
    static async publicProductByShop({ product_shop, product_id }) {
        return await publicProductByShop({ product_shop, product_id })
    }

    // unpublic a product by seller (PUT request)
    static async unPublicProductByShop({ product_shop, product_id }) {
        return await unPpublicProductByShop({ product_shop, product_id })
    }
    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublic: true } }) {
        return await findAllProduct({
            limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb']
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] });
    }
}

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
        product_attributes
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
    // create new product

    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct){
            // add product_stock in inventory collection
            await insertInventory({
                productId : newProduct._id,
                shopId  : this.product_shop, 
                stock :this.product_quantity
             
            })
        }
        return newProduct;
    }
    async updateProduct(product_id, objectParams) {
        return await updateProductById({ product_id, objectParams, model: product });
    }
}

// Define sub-class for different product types Clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError('create new Clothing error');


        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
    async updateProduct(product_id) {
        /*
          1. remove attr has null underfined 
          2. check xem update o cho nao ?  
        */
        // console.log(`1 ::`, this)
        const objectParams = removeUnderfinedObject(this);
        // console.log(`1 ::`, objectParams)
        if (objectParams.product_attributes) {
            // update child
            //    console.log(`TEST 13 ::` , objectParam)
            await updateProductById({
                product_id,
                objectParams: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct;

    }
}

// Define sub-class for different product types Electronic

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('create new Clothing error');


        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestError('create new Clothing error');


        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('create new Product error');

        return newProduct;
    }
}
// register producttype 

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory