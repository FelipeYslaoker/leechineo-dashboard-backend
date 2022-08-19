const express = require('express');
const paginate = require('../middlewares/paginate');
const Brand = require('../models/Brand');
const LogDB = require('../models/Log');
const auth = require('../middlewares/auth');

const router = express.Router();
router.get('/get', paginate(Brand), async (req, res) => {
    const id = req.query.id
    try {
        if (id) {
         const brand = await Brand.findOne({_id: id})   
         if (brand) {
            return res.send(brand)
         } else {
            return res.sendStatus(404)
         }
        } else {
            return res.send(res.paginatedResult);
        }
    } catch (e) {
        await LogDB.create({
            title: `Erro ao obter marcas`,
            type: 'error/get_brands',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        console.log(e)
        return res.status(500).send();
    }
});

router.post('/create', auth({onlyAdmin: true}), async (req, res) => {
    const {name, color, url} = req.body;
    try {
        await Brand.create({name, color, url});
        await LogDB.create({
            title: `Marca ${name} criada`,
            type: 'created/brand',
            body: {
                content: {
                    name, color, url
                }
            }
        });
        return res.send();
    } catch (e) {
        await LogDB.create({
            title: `Falha ao criar a marca ${name}`,
            type: 'error/create_brand',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        console.log(e);
        return res.status(500).send();
    }
});
module.exports = app => app.use('/brands', router);
