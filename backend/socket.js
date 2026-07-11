const { Server } = require('socket.io');
const logger = require('./utils/logger');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        socket.on('join', (userId) => {
            socket.join(`user:${userId}`);
            logger.info(`User ${userId} joined room`);
        });

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket not initialized');
    return io;
};

module.exports = { initSocket, getIO };