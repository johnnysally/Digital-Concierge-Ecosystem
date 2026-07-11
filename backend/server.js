const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT, NODE_ENV, CORS_ORIGIN } = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/global/errorHandler');
const { generalLimiter } = require('./middleware/global/rateLimiter');
const requestLogger = require('./middleware/global/logger');
const { initSocket } = require('./socket');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

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
        message: 'Digital Concierge Ecosystem API',
        version: '2.0.0',
        environment: NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Digital Concierge API v2',
        modules: {
            customer: '/api/customer',
            accommodation: '/api/accommodation',
            restaurant: '/api/restaurant',
            transport: '/api/transport',
            admin: '/api/admin',
        },
        health: '/health',
        docs: '/api',
    });
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api', require('./routes'));
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB();
        initSocket(server);

        server.listen(PORT, () => {
            console.clear();
            console.log('');
            console.log('  ╔══════════════════════════════════════════════╗');
            console.log('  ║                                              ║');
            console.log('  ║   🏨  DIGITAL CONCIERGE ECOSYSTEM  🌍       ║');
            console.log('  ║                                              ║');
            console.log('  ╠══════════════════════════════════════════════╣');
            console.log('  ║                                              ║');
            console.log(`  ║   Status      : 🟢 Online                    ║`);
            console.log(`  ║   Port        : ${String(PORT).padEnd(28)}║`);
            console.log(`  ║   Environment : ${NODE_ENV.padEnd(28)}║`);
            console.log('  ║                                              ║');
            console.log('  ╠══════════════════════════════════════════════╣');
            console.log('  ║   DATABASE                                   ║');
            console.log(`  ║   State       : ${'connected'.padEnd(28)}║`);
            console.log(`  ║   Host        : ${(mongoose.connection.host || 'localhost').padEnd(28)}║`);
            console.log('  ║                                              ║');
            console.log('  ╠══════════════════════════════════════════════╣');
            console.log('  ║   ENDPOINTS                                  ║');
            console.log(`  ║   Health      : http://localhost:${PORT}/health`.padEnd(49) + '║');
            console.log(`  ║   API         : http://localhost:${PORT}/api   `.padEnd(49) + '║');
            console.log('  ║                                              ║');
            console.log('  ╠══════════════════════════════════════════════╣');
            console.log('  ║   MODULES                                    ║');
            console.log(`  ║   👤 Customer      /api/customer             ║`);
            console.log(`  ║   🏨 Accommodation /api/accommodation        ║`);
            console.log(`  ║   🍽️  Restaurant    /api/restaurant           ║`);
            console.log(`  ║   🚗 Transport     /api/transport            ║`);
            console.log(`  ║   🛡️  Admin         /api/admin                ║`);
            console.log('  ║                                              ║');
            console.log('  ╠══════════════════════════════════════════════╣');
            console.log('  ║   SERVICES                                   ║');
            console.log(`  ║   WebSocket   : 🟢 Active                    ║`);
            console.log(`  ║   Email       : ${process.env.EMAIL_PROVIDER?.padEnd(28) || 'brevo'.padEnd(28)}║`);
            console.log('  ║                                              ║');
            console.log('  ╚══════════════════════════════════════════════╝');
            console.log('');
            console.log('  ✨ Server is ready to handle requests ✨');
            console.log('');
        });

        const shutdown = async (signal) => {
            console.log('');
            console.log(`  ⚠️  ${signal} received. Shutting down gracefully...`);
            logger.info(`${signal} received`);

            server.close(async () => {
                await mongoose.connection.close();
                logger.info('MongoDB disconnected');
                console.log('  🔌 Database disconnected');
                console.log('  🛑 Server closed');
                console.log('');
                process.exit(0);
            });

            setTimeout(() => {
                console.log('  💥 Forced shutdown after 10s');
                logger.error('Forced shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

        process.on('unhandledRejection', (err) => {
            logger.error(`Unhandled Rejection: ${err.message}`);
            console.error(`  ❌ Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (err) => {
            logger.error(`Uncaught Exception: ${err.message}`);
            console.error(`  ❌ Uncaught Exception: ${err.message}`);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        logger.error(`Startup failed: ${error.message}`);
        console.error('');
        console.error('  ╔══════════════════════════════════════╗');
        console.error('  ║   ❌ STARTUP FAILED                 ║');
        console.error(`  ║   ${error.message.padEnd(36)}║`);
        console.error('  ╚══════════════════════════════════════╝');
        console.error('');
        process.exit(1);
    }
};

start();