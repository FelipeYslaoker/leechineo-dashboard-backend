const ticketDB = require('../../db/dbconfig')

const TicketSchema = new ticketDB.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Object,
        required: true
    },
    products: Array,
    type: {
        type: String,
        required: true
    },
    rules: {
        type: Array,
        required: true
    }
});

const Ticket = ticketDB.model('Ticket', TicketSchema);

module.exports = Ticket;
