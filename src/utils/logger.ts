/**
 * Winston Logger Setup
 * Comprehensive logging utility for the mock middleware
 */

import winston from 'winston';
import { loggingConfig, logLevels, logColors } from '../config/logging';

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Custom format for structured logging
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.json()
);

// Console format with colors
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }: any) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport
if (loggingConfig.transports.console.enabled) {
  transports.push(
    new winston.transports.Console({
      level: loggingConfig.transports.console.level,
      format: loggingConfig.transports.console.colorize ? consoleFormat : customFormat
    })
  );
}

// File transport
if (loggingConfig.transports.file.enabled) {
  transports.push(
    new winston.transports.File({
      level: loggingConfig.transports.file.level,
      filename: loggingConfig.transports.file.filename,
      format: customFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: loggingConfig.transports.file.maxFiles,
      tailable: true
    })
  );
}

// Error file transport
if (loggingConfig.transports.error.enabled) {
  transports.push(
    new winston.transports.File({
      level: loggingConfig.transports.error.level,
      filename: loggingConfig.transports.error.filename,
      format: customFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: loggingConfig.transports.error.maxFiles,
      tailable: true
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: loggingConfig.level,
  levels: logLevels,
  format: customFormat,
  transports,
  silent: loggingConfig.silent,
  exitOnError: false
});

// Add colors to winston
winston.addColors(logColors);

// Helper functions for structured logging
export const logRequest = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    requestId: req.requestId,
    contentLength: res.get('Content-Length'),
    timestamp: new Date().toISOString()
  };

  if (res.statusCode >= 400) {
    logger.error('HTTP Request Error', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

export const logError = (error: Error, context?: any) => {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context,
    timestamp: new Date().toISOString()
  };

  logger.error('Application Error', logData);
};

export const logPerformance = (operation: string, duration: number, context?: any) => {
  if (loggingConfig.performanceLogging.enabled && duration > loggingConfig.performanceLogging.threshold) {
    const logData = {
      operation,
      duration,
      context,
      timestamp: new Date().toISOString()
    };

    logger.warn('Performance Warning', logData);
  }
};

export const logAuth = (action: string, userId?: string, success: boolean = true, context?: any) => {
  const logData = {
    action,
    userId,
    success,
    context,
    timestamp: new Date().toISOString()
  };

  if (success) {
    logger.info('Authentication Event', logData);
  } else {
    logger.warn('Authentication Failure', logData);
  }
};

export const logApiUsage = (endpoint: string, method: string, userId?: string, responseTime?: number) => {
  const logData = {
    endpoint,
    method,
    userId,
    responseTime,
    timestamp: new Date().toISOString()
  };

  logger.info('API Usage', logData);
};

export const logSecurity = (event: string, severity: 'low' | 'medium' | 'high', context?: any) => {
  const logData = {
    event,
    severity,
    context,
    timestamp: new Date().toISOString()
  };

  logger.warn('Security Event', logData);
};

export default logger;
