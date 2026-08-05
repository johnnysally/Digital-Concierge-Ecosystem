const cleanupRooms = require('./cleanupRooms');
const releasePayouts = require('./releasePayouts');
const logger = require('../utils/logger');

const SCHEDULES = {
    ROOM_CLEANUP: 15 * 60 * 1000,
    PAYOUT_RELEASE: 6 * 60 * 60 * 1000,
};

let intervals = [];

const startSchedulers = () => {
    logger.info('Starting schedulers...');

    cleanupRooms().catch(e => logger.error(`Initial room cleanup failed: ${e.message}`));
    intervals.push(setInterval(() => {
        cleanupRooms().catch(e => logger.error(`Room cleanup failed: ${e.message}`));
    }, SCHEDULES.ROOM_CLEANUP));

    releasePayouts().catch(e => logger.error(`Initial payout release failed: ${e.message}`));
    intervals.push(setInterval(() => {
        releasePayouts().catch(e => logger.error(`Payout release failed: ${e.message}`));
    }, SCHEDULES.PAYOUT_RELEASE));

    logger.info(`Schedulers started: Room cleanup every 15min, Payout release every 6hrs`);
};

const stopSchedulers = () => {
    intervals.forEach(clearInterval);
    intervals = [];
    logger.info('Schedulers stopped');
};

module.exports = { startSchedulers, stopSchedulers };