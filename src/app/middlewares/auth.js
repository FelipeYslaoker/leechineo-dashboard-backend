require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(params = { required: true, onlyAdmin: false }) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            if (!params.required) {
                req.user = {
                    logged: false
                };
                return next();
            }
            return res.status(401).send({
                error: 'unathorized',
                message: 'Faça login para continuar'
            });
        }
        const parts = authHeader.split(' ');
        if (!(parts.length === 2))
            return res.status(401).send({
                error: 'unauthorized',
                message: 'Faça login para continuar'
            });

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme))
            return res.status(401).send(
                {
                    error: 'unauthorized',
                    message: 'Faça login para continuar'
                }
            );

        jwt.verify(token, process.env.AUTH_HASH, async (err, decoded) => {
            if (err)
                return res.status(401).send({
                    error: 'unauthorized',
                    message: 'Faça login para continuar'
                });
            const user = await User.findOne({ _id: decoded.id }).select('+admin');
            if (params.onlyAdmin && !user.admin) {
                return res.status(401).send({
                    error: 'unauthorized'
                });
            }
            req.user = {
                logged: true,
                _id: decoded.id,
                ...user._doc
            }
            return next();
        });
    }
}
module.exports = auth;
