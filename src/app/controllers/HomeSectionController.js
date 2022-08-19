const express = require('express');
const HomeSection = require('../models/HomeSection');
const LogDB = require('../models/Log');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/create', auth({onlyAdmin: true}), async (req, res) => {
    try {
        await HomeSection.create(req.body);
        LogDB.create({
            title: `Secao '${req.body.name || req.body.postion}' criada`,
            type: 'created/section',
            body: {
                content: req.body
            }
        });
        return res.send();
    } catch (e) {
        LogDB.create({
            title: 'Erro ao criar uma secoe',
            type: 'error/create_section',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        return res.status(500).send();
    }
});

router.get('/get', async (req, res) => {
    try {
        const sections = await HomeSection.find();
        return res.send({sections});
    } catch (e) {
        LogDB.create({
            title: 'Erro ao obter as secoes',
            type: 'error/get_sections',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
            }
        });
        return res.status(500).send();
    }
});
router.get('/index', auth({onlyAdmin: true}), async (req, res) => {
    try {
        const index = await HomeSection.countDocuments();
        return res.send({index});
    } catch (e) {
        LogDB.create({
            title: 'Erro ao obter o index da secao',
            type: 'error/get_section_index',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
            }
        });
        return res.status(500).send();
    }
});

module.exports = app => app.use('/section', router);
