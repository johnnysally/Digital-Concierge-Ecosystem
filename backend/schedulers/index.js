const cleanupRooms = require('./cleanupRooms');
const releasePayouts = require('./releasePayouts');
const autoConfirmOrders = require('./autoConfirmOrders');
const logger = require('../utils/logger');

const SCHEDULES = {
    ROOM_CLEANUP: 15 * 60 * 1000,
    PAYOUT_RELEASE: 6 * 60 * 60 * 1000,
    AUTO_CONFIRM: 30 * 60 * 1000,
};

let intervals = [];

const startSchedulers = () => {
    logger.info('Starting schedulers...');

    cleanupRooms().catch(e => logger.error('Room cleanup failed: ' + e.message));
    intervals.push(setInterval(() => {
        cleanupRooms().catch(e => logger.error('Room cleanup failed: ' + e.message));
    }, SCHEDULES.ROOM_CLEANUP));

    releasePayouts().catch(e => logger.error('Payout release failed: ' + e.message));
    intervals.push(setInterval(() => {
        releasePayouts().catch(e => logger.error('Payout release failed: ' + e.message));
    }, SCHEDULES.PAYOUT_RELEASE));

    autoConfirmOrders().catch(e => logger.error('Auto-confirm failed: ' + e.message));
    intervals.push(setInterval(() => {
        autoConfirmOrders().catch(e => logger.error('Auto-confirm failed: ' + e.message));
    }, SCHEDULES.AUTO_CONFIRM));

    logger.info('Schedulers started: Room cleanup 15min, Payout release 6hrs, Auto-confirm 30min');
};

const stopSchedulers = () => {
    intervals.forEach(clearInterval);
    intervals = [];
    logger.info('Schedulers stopped');
};

module.exports = { startSchedulers, stopSchedulers };