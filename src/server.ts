/**
 * Server Entry Point
 * Starts the Express server with comprehensive configuration
 */

import App from './app';
import logger from './utils/logger';
import { serverConfig } from './config/server';
import { ErrorMiddleware } from './middleware/error';

// Setup global error handlers to run only once
ErrorMiddleware.setupGlobalHandlers();

// Create Express app
const app = new App();
const server = app.getApp();
const config = app.getConfig();

// Start server
const PORT = parseInt(process.env.PORT || config.port.toString(), 10);
const HOST = process.env.HOST || config.host;

const httpServer = server.listen(PORT, HOST, () => {
  logger.info('BanedonV Mock Server started', {
    port: PORT,
    host: HOST,
    protocol: config.protocol,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid,
    timestamp: new Date().toISOString()
  });
  
  logger.info('Available endpoints:', {
    health: `${config.protocol}://${HOST}:${PORT}/health`,
    metrics: `${config.protocol}://${HOST}:${PORT}/metrics`,
    api: `${config.protocol}://${HOST}:${PORT}${config.api.prefix}/${config.api.version}`,
    docs: `${config.protocol}://${HOST}:${PORT}${config.api.prefix}/${config.api.version}`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default httpServer;
