const express = require('express')
const Currency = require('../models/Currency')

const route = express.Router()

route.get('/get', async (req, res) => {
    const { code } = req.query
    try {
        const currency = await Currency.findOne({ code })
        if (currency) {
            return res.send(currency)
        } else {
            const currencies = await Currency.find()
            return res.send(currencies)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

module.exports = app => app.use('/currencies', route)
