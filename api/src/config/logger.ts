import pino from 'pino';
import config from './env.js';

const logger = pino({
    level: config.nodeEnv === 'test' ? 'silent' : process.env.LOG_LEVEL ?? 'info',
});

export default logger;