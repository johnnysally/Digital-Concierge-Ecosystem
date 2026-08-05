const Redis = require('ioredis');
const { REDIS } = require('./env');
const logger = require('../utils/logger');

let redis = null;

const connectRedis = async () => {
    if (!REDIS.ENABLED || !REDIS.URL) {
        logger.info('Redis disabled or not configured');
        return null;
    }

    try {
        redis = new Redis(REDIS.URL, {
            maxRetriesPerRequest: 1,
            retryStrategy() { return null; },
            lazyConnect: true,
            connectTimeout: 5000,
        });

        await redis.connect();
        
        const pong = await redis.ping();
        if (pong !== 'PONG') {
            throw new Error('Redis ping failed');
        }

        logger.info('Redis connected successfully');
        redis.on('error', (err) => {
            if (err?.message) logger.error(`Redis error: ${err.message}`);
        });

        return redis;
    } catch (error) {
        logger.error(`Redis connection failed: ${error.message}`);
        if (redis) {
            try { await redis.disconnect(); } catch {}
            redis = null;
        }
        return null;
    }
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };