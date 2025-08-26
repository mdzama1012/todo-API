const { z } = require('zod');
const mongoose = require('mongoose');

function errorHandler(err, _, res, next) {
    if (res.headersSent) {
        // prevent default error handler
        return next(err);
    }

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    if (err instanceof z.ZodError) {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    } else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `The ${field} '${err.keyValue[field]}' is already in use.`;
    } else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
    } else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        statusCode = 404;
        message = 'Resource not found.';
    }

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

module.exports = errorHandler;
