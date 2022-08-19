const LogDB = require('../../db/dbconfig');

const LogSchema = new LogDB.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    type: String,
    message: String,
    body: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Log = LogDB.model('Logs', LogSchema);

module.exports = Log;
