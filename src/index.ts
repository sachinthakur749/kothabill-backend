import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import logger from './config/logger';
import { connectDatabase } from './config/database';
import routes from './routes';
import { setupSwagger } from './config/swagger';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Request logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Documentation
setupSwagger(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
let server: any;

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
    });
  }

  try {
    const { pool } = require('./config/database');
    await pool().end();
    logger.info('Database pool closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error during database pool shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();

export default app;
