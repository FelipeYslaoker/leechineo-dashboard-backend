const express = require('express')
const auth = require('../middlewares/auth')
const validateTicket = require('../plugins/validateTicket')

const User = require('../models/User')
const Product = require('../models/Product')
const Ticket = require('../models/Ticket')

const router = express.Router()

router.put('/favorite/update', auth(), async (req, res) => {
    try {
        const product = req.query.product
        const user = await User.findOne({ _id: req.user._id })
        const favorites = user.favorites
        if (favorites.includes(Number(product))) {
            favorites.splice(favorites.indexOf(product), 1)
        } else {
            favorites.push(Number(product))
        }
        await User.findOneAndUpdate({ _id: req.user._id }, { favorites })
        return res.send()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})
router.put('/cart/add', auth(), async (req, res) => {
    try {
        const { product, variant, quantity, ticket } = req.body
        const _product = await Product.findOne({ urlNumber: product })
        if (_product) {
            if (_product.visibility === 'private') {
                return res.status(404).send({
                    message: 'Este produto não existe ou foi deletado.'
                })
            }
            if (_product.variants.type === 'compound') {
                const _variant = _product.variants.options.filter(option => option.names.join(' ') === variant.join(' '))[0]
                if (Number(_variant.stock) >= Number(quantity)) {
                    if (ticket) {
                        const _ticket = await Ticket.findOne({_id: ticket})
                        if (!(validateTicket(_ticket, req.user))) {
                            return res.status(400).send({message: 'O cupom adicionado é inválido.'})
                        }
                        const cart = req.user.cart
                        cart.push({ product, variant, quantity, ticket })
                        await User.findOneAndUpdate({ _id: req.user._id }, { cart })
                        console.log('pronto')
                        return res.send()
                    }
                }
            }
        } else {
            return res.status(404).send({
                message: 'Este produto não existe ou foi deletado.'
            })
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})
router.get('/cart/get', auth(), (req, res) => {
    
})
module.exports = app => app.use('/user', router)
