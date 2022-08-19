const express = require('express')
const Ticket = require('../models/Ticket')
const paginate = require('../middlewares/paginate')
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/create', auth({onlyAdmin: true}), async (req, res) => {
    const ticket = req.body;
    try {
        if (await Ticket.findOne({ name: ticket.name })) {
            return res.status(400).send({
                error: 'ticket_already_exists',
                message: 'Cupom existente'
            })
        }
        await Ticket.create(ticket);
        return res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: 'internal_server_error',
            message: 'Erro interno do servidor.'
        });
    }
})
router.put('/update', auth({onlyAdmin: true}), async (req, res) => {
    const { _id, name, discount, type, rules, products } = req.body
    try {
        await Ticket.findOneAndUpdate({ _id }, { name, discount, type, rules, products })
        return res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: 'internal_server_error',
            message: 'Erro interno do servidor.'
        });
    }
})
router.get('/get', paginate(Ticket, true), async (req, res) => {
    try {
        if (req.query.id) {
            const ticket = await Ticket.findOne({ _id: req.query.id })
            if (!ticket) {
                return res.sendStatus(404)
            } else {
                return res.send({ ticket })
            }
        } else {
            return res.send(res.paginatedResult)
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: 'internal_server_error',
            message: 'Erro interno do servidor.'
        });
    }
});

router.delete('/delete', auth({onlyAdmin: true}), async (req, res) => {
    try {
        await Ticket.findOneAndDelete({_id: req.query.id})
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            error: 'internal_server_error',
            message: 'Erro interno do servidor.'
        });
    }
})

router.get('/verify', auth({required: false}), async (req, res) => {
    const verifyTicket = require('../plugins/validateTicket')
    const { name } = req.query
    const user = req.user
    try {
        const ticket = await Ticket.findOne({ name })
        if (ticket) {
            const valid = await verifyTicket(ticket, user)
            if (valid) {
                return res.send({ticket: ticket._id})
            } else  {
                return res.status(401).send({message: 'Você não está elegível para utilizar este cupom.'})
            }
        } else return res.status(400).send({
            message: 'Cupom não cadastrado.'
        })
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
})

module.exports = app => app.use('/ticket', router)
