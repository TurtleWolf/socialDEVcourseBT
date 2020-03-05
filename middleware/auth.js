const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // split token from Bearer in header
        token = req.headers.authorization.split(' ')[1];
    }
    // // OR Set token from cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Security Token is invalid, //MiddleWare/Auth.JS', 401));
    }

    try {
        // Verify token by matching it to the user's :id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new ErrorResponse('Security Token is invalid, //MiddleWare/Auth.JS', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `user ROLE ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
