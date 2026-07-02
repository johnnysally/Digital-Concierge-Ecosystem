const logger = require('../../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
};

module.exports = requestLogger;