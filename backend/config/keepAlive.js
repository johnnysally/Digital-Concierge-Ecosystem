const axios = require('axios');
const { API_URL, KEEP_ALIVE_ENABLED } = require('./env');
const logger = require('../utils/logger');

const PING_URL = `${API_URL}/health`;
const INITIAL_DELAY = 60 * 1000;
const INTERVAL = 10 * 60 * 1000;

const ping = async () => {
    try {
        const res = await axios.get(PING_URL, { timeout: 10000 });
        logger.info(`Keep-alive ping: ${res.status} - ${res.data?.status || 'ok'}`);
    } catch (error) {
        logger.warn(`Keep-alive ping failed: ${error.message}`);
    }
};

const startKeepAlive = () => {
    if (KEEP_ALIVE_ENABLED !== 'true') {
        logger.info('Keep-alive disabled');
        return;
    }

    logger.info(`Keep-alive enabled. First ping in 1 minute, then every 10 minutes. Target: ${PING_URL}`);

    setTimeout(() => {
        ping();
        setInterval(ping, INTERVAL);
    }, INITIAL_DELAY);
};

module.exports = { startKeepAlive };