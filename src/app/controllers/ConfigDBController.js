const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const LogDB = require('../models/Log');
const Config = require('../models/Config');
const auth = require('../middlewares/auth');

router.get('/next-product-id', auth({onlyAdmin: true}), async (req, res) => {
    try {
        const config = await Config.find(
            {
                nextProductId: {
                    $gt: 0, $lt: Infinity
                }
            }
        ).exec();
    if(!config[0]){
        console.log(config[0])
        await Config.create(
            {
                nextProductId: 1000000
            }
        );
        return res.send({nextProductId: 1000000});
    } else {
        config[0].nextProductId = config[0].nextProductId + 1;
        await config[0].save();
        return res.send({nextProductId: config[0].nextProductId});
    }
    } catch (e) {
        console.log(e);
        LogDB.create({
            title: 'Erro ao obter o id do produto',
            type: 'error/get_product_id',
            body: {
                content: typeof e === 'object' ? JSON.stringify(e) : e
            }
        });
        return res.status(500).send({
            error: 'internal_server_error',
            message: 'Erro interno do servidor.'
        });
    }
});

module.exports = app => app.use('/configs', router);
