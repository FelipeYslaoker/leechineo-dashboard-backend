const mongoose = require('../../db/dbconfig');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    url: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Brand = mongoose.model('brands', BrandSchema);

module.exports = Brand;
