const mongoose = require('../../db/dbconfig');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    birthday: {
        type: Object,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    cart: {
        type: Array,
        default: []
    },
    adresses: {
        type: Array,
        default: []
    },
    paymentMethods: {
        type: Array,
        default: []
    },
    favorites: {
        type: Array,
        default: []
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
    },
    verifiedAccount: {
        type: Boolean,
        default: false,
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    emailConfirmationToken: {
        type: String,
        select: false
    },
    emailConfirmationExpires: {
        type: Date,
        select: false
    },
    orders: {
        type: Array,
        default: []
    },
    usedTickets: {
        type: Array,
        default: []
    },
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('Users', UserSchema);

module.exports = User;
