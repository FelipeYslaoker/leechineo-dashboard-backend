const mongoose = require('../../db/dbconfig');

const ConfigSchema = new mongoose.Schema({
    nextProductId: Number,
});

const Config = mongoose.model('configs', ConfigSchema);

module.exports = Config;
