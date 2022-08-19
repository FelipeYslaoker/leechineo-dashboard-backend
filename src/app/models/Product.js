const productDB = require('../../db/dbconfig');

const ProductSchema = new productDB.Schema({
    urlNumber: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    specifications: Array,
    category: String,
    subCategory: String,
    subSubCategory: String,
    brand: String,
    type: {
        type: String,
        default: 'product'
    },
    description: String,
    images: Array,
    variants: {
        type: Object,
        required: true
    },
    visibility: {
        type: String,
        default: 'private'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ProductSchema.index({name: 'text', description: 'text'});

const Product = productDB.model('Product', ProductSchema);

module.exports = Product;
