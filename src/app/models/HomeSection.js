const homeSectionDB = require('../../db/dbconfig');

const HomeSectionSchema = new homeSectionDB.Schema({
    name: String,
    type: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    rules: {
        type: Array,
    },
    position: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const HomeSection = homeSectionDB.model('HomeSections', HomeSectionSchema);

module.exports = HomeSection;
