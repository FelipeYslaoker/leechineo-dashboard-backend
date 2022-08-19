const express = require('express')
const ShippingMethod = require('../models/ShippingMethod')
const axios = require('axios').default

const router = express.Router()

router.post('/save', async (req, res) => {
    const { name, mappings, defaultMapping, _id } = req.body
    try {
        if (_id) {
            const _mappings = []
            for (const mapping of mappings) {
                const addressLocation = (await axios.get(`https://viacep.com.br/ws/${mapping.location}/json/`)).data
                _mappings.push({
                    addressLocation,
                    ...mapping
                })
            }
            const shippingMethod = await ShippingMethod.findOneAndUpdate({ _id }, { name, mappings: _mappings, defaultMapping })
            return res.send(shippingMethod)
        } else {
            const shippingMethod = await ShippingMethod.create({ name, mappings, defaultMapping })
            return res.send(shippingMethod)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

router.get('/get', async (req, res) => {
    const id = req.query.id
    try {
        if (id) {
            const shippingMethod = await ShippingMethod.findOne({ _id: id })
            return res.send(shippingMethod)
        } else {
            const shippingMethods = await ShippingMethod.find()
            return res.send(shippingMethods)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

module.exports = app => app.use('/shippingMethods', router)
