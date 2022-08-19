const mongoose = require('../../db/dbconfig');

const CategorySchema = new mongoose.Schema({
    icon: String,
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
    },
    subCategories: Object,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
