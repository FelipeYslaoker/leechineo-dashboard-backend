const express = require('express');
const Category = require('../models/Category');
const LogDB = require('../models/Log');

const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        if(req.query.id){
            console.log(req.query.id);
            const category = await Category.findOne({id: req.query.id});
            if(!category){
                return res.status(404).send();
            } else {
                return res.send(category);
            }
        } else {
            const categories = await Category.find()
            return res.send(categories);
        }
    } catch (e) {
        LogDB.create({
            title: 'Erro ao obter as categorias',
            type: 'error/get_category',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        return res.status(500).send();
    }
});

router.post('/save', auth({onlyAdmin: true}), async (req, res) => {
    try {
        const { icon, name, id, subCategories } = req.body;
        if (req.query.id){
            const oldCategory = await Category.findOne({id: req.query.id});
            const newCategory = await Category.findOneAndUpdate({id: req.query.id}, {icon, name, subCategories, id});
            await LogDB.create({
                title: `Categoria '${name}' atualizada`,
                type: 'updated/category',
                body: {
                    before: oldCategory,
                    after: newCategory
                }
            });
        } else {
            await Category.create({ icon, name, id, subCategories });
            await LogDB.create({
                title: `Categoria '${name}' criada`,
                type: 'created_category'
            });
        }
        return res.send({success: true});
    } catch (e) {
        LogDB.create({
            title: 'Erro ao salvar uma categoria',
            type: 'error/save_category',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        return res.status(500).send();
    }
});

router.delete('/delete', auth({onlyAdmin: true}), async (req, res) => {
    const id = req.query.id;
    try {
        const category = await Category.findOne({id});
        await Category.findOneAndDelete({id});
        await LogDB.create({
            title: `Categoria '${category.name}' deletada`,
            type: 'deleted/category'
        });
        return res.send({success: true});
    } catch (e) {
        LogDB.create({
            title: 'Erro ao deletar uma categoria',
            type: 'error/delete_category',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        return res.status(500).send();
    }
});

module.exports = app => app.use('/categories', router);
