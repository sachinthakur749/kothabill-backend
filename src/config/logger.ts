import winston from 'winston';
import path from 'path';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
  })
];

if (process.env.NODE_ENV !== 'production') {
  try {
    transports.push(
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
      })
    );
  } catch (err) {
    console.warn('Winston file transports could not be initialized (falling back to console-only):', err);
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'app' },
  transports,
});

export default logger;