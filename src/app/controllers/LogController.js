const express = require('express');
const paginate = require('../middlewares/paginate');
const auth = require('../middlewares/auth');
const Log = require('../models/Log');

const router = express.Router();

router.get('/get', auth({onlyAdmin: true}), paginate(Log), (req, res) => {
    res.send(res.paginatedResult);
});

module.exports = app => app.use('/logs', router);
