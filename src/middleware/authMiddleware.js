const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorHandler');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findByPk(decoded.id);

            if (!user || user.token === 'Logout') {
                return next(new ErrorResponse('Not authorized, token failed', 401));
            }

            req.user = user;
            next();
        } catch (error) {
            return next(new ErrorResponse('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized, no token', 401));
    }
};

module.exports = { protect };