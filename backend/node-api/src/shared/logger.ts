// ─────────────────────────────────────────────────────────────────
//  shared/logger.js
//  Winston logger — use everywhere instead of console.log
//  Usage: const logger = require('../../shared/logger');
//         logger.info('Server started');
//         logger.error('Something failed', err);
// ─────────────────────────────────────────────────────────────────

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger: Logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console — coloured in development
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // Error log file
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    // Combined log file
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
    }),
  ],
});

export default logger;
// module.exports = logger;
