const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT, NODE_ENV, CORS_ORIGIN } = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/global/errorHandler');
const { generalLimiter } = require('./middleware/global/rateLimiter');
const requestLogger = require('./middleware/global/logger');
const logger = require('./utils/logger');
const customerRoutes = require('./routes/customerRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN.split(','), credentials: true }));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use(requestLogger);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Digital Concierge API',
        version: '1.0.0',
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Digital Concierge API - v1',
        customer: '/api/customer',
        partners: '/api/partners',
        health: '/health',
    });
});

app.use('/api/customer', customerRoutes);
app.use('/api/partners', partnerRoutes);

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage().rss,
        timestamp: new Date().toISOString(),
    });
});

app.use(errorHandler);

const start = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.clear();
            console.log('═══════════════════════════════════════════');
            console.log('  Digital Concierge Ecosystem API');
            console.log('═══════════════════════════════════════════');
            console.log(`  Status   : Online`);
            console.log(`  Port     : ${PORT}`);
            console.log(`  Env      : ${NODE_ENV}`);
            console.log(`  Health   : http://localhost:${PORT}/health`);
            console.log(`  Customer : http://localhost:${PORT}/api/customer`);
            console.log(`  Partner  : http://localhost:${PORT}/api/partner`);
            console.log('═══════════════════════════════════════════');
        });

        const shutdown = async (signal) => {
            console.log('');
            console.log(`  ${signal} received. Shutting down gracefully...`);
            logger.info(`${signal} received. Shutting down...`);
            server.close(() => {
                console.log('  Server closed.');
                logger.info('Server closed');
                process.exit(0);
            });
            setTimeout(() => {
                console.log('  Forced shutdown.');
                logger.error('Forced shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('unhandledRejection', (err) => {
            logger.error(`Unhandled: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        logger.error(`Startup failed: ${error.message}`);
        process.exit(1);
    }
};

start();