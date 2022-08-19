const express = require('express');

const Product = require('../models/Product');
const LogDB = require('../models/Log');

const paginate = require('../middlewares/paginate');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/create', auth({onlyAdmin: true}), async (req, res) => {
    try {
        let { urlNumber, name, specifications, category, subCategory, subSubCategory, brand, type, description, images, variants, visibility } = req.body;
        
        const product = {
            urlNumber,
            name,
            type,
            description,
            images,
            brand,
            category,
            subCategory,
            subSubCategory,
            specifications,
            variants,
            visibility
        }
        await Product.create(product)
        await LogDB.create({
            title: `Produto ${urlNumber} criado`,
            type: 'created/product',
            body: {
                after: product
            },
        });
        res.send();
    } catch (e) {
        LogDB.create({
            title: 'Erro ao criar um produto',
            type: 'error/create_product',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        console.log(e)
        res.status(500).send();
    }
});

router.get('/get', paginate(Product, true), async (req, res) => {
    try {
        if (req.query.id) {
            const product = await Product.findOne({ urlNumber: req.query.id });
            if (!product) {
                return res.status(404).send();
            } else {
                return res.send({ product });
            }
        } else {
            return res.send(res.paginatedResult);
        }
    } catch (e) {
        LogDB.create({
            title: 'Erro ao obter os produtos',
            type: 'error/get_products',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        console.log(e)
        return res.status(500).send();
    }
});
router.get('/getAll', paginate(Product, false), async (req, res) => {
    try {
        if (req.query.id) {
            const product = await Product.findOne({ urlNumber: req.query.id });
            if (!product) {
                return res.status(404).send();
            } else {
                return res.send({ product });
            }
        } else {
            return res.send(res.paginatedResult);
        }
    } catch (e) {
        LogDB.create({
            title: 'Erro ao obter os produtos',
            type: 'error/get_products',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        return res.status(500).send();
    }
});

router.put('/update', auth({onlyAdmin: true}), async (req, res) => {
    try {
        let { urlNumber, name, specifications, category, subCategory, subSubCategory, brand, type, description, images, variants, visibility } = req.body;
        console.log(urlNumber)
        
        const product = {
            urlNumber,
            name,
            type,
            description,
            images,
            brand,
            category,
            subCategory,
            subSubCategory,
            specifications,
            variants,
            visibility
        }
        await Product.findOneAndUpdate({urlNumber}, product)
        await LogDB.create({
            title: `Produto ${urlNumber} atualizado`,
            type: 'updated/product',
            body: {
                after: product
            },
        });
        res.send();
    } catch (e) {
        console.log(e)
        LogDB.create({
            title: 'Erro ao atualizar um produto',
            type: 'error/update_product',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        console.log(e)
        return res.sendStatus(500);
    }
});

router.put('/change-privacy', auth({onlyAdmin: true}), async (req, res) => {
    const id = req.body.id;
    const product = await Product.findOne({ urlNumber: id }) || { visibility: 'public' };
    try {
        if (product.visibility === 'private') {
            product.visibility = 'public';
            await product.save()
        } else {
            product.visibility = 'private';
            await product.save()
        }
        const log = LogDB.create({
            title: 'Privacidade alterada',
            description: `Privacidade do produto ${id} alterada`,
            type: 'changed_visibility',
            body: {
                before: product.visibility === 'private' ? 'public' : 'private',
                after: product.visibility
            }
        });
        return res.send({ 'new-visibility': product.visibility, log });
    } catch (e) {
        LogDB.create({
            title: 'Erro ao atualizar a privacidade de um produto',
            type: 'error/update_product_privacy',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e,
                bodyRequest: req.body
            }
        });
        return res.status(500).send();
    }
});

module.exports = app => app.use('/product', router);
