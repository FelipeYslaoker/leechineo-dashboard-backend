const ShippingMethodDB = require('../../db/dbconfig')

const ShippingMethodSchema = new ShippingMethodDB.Schema({
    name: {
        required: true,
        type: String
    },
    mappings: {
        type: Array
    },
    defaultMapping: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const ShippingMethod = ShippingMethodDB.model('shppingmethods', ShippingMethodSchema)

module.exports = ShippingMethod
