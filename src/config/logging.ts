/**
 * Logging Configuration
 * Winston logger configuration for comprehensive logging
 */

export interface LoggingConfig {
  level: string;
  silent: boolean;
  format: 'json' | 'simple' | 'combined';
  transports: {
    console: {
      enabled: boolean;
      level: string;
      colorize: boolean;
    };
    file: {
      enabled: boolean;
      level: string;
      filename: string;
      maxSize: string;
      maxFiles: number;
    };
    error: {
      enabled: boolean;
      level: string;
      filename: string;
      maxSize: string;
      maxFiles: number;
    };
  };
  requestLogging: {
    enabled: boolean;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
    includeUserAgent: boolean;
    includeRemoteAddr: boolean;
  };
  performanceLogging: {
    enabled: boolean;
    threshold: number; // milliseconds
    includeStackTrace: boolean;
  };
}

export const loggingConfig: LoggingConfig = {
  level: 'info',
  silent: false,
  format: 'json',
  transports: {
    console: {
      enabled: true,
      level: 'debug',
      colorize: true
    },
    file: {
      enabled: true,
      level: 'info',
      filename: 'logs/combined.log',
      maxSize: '10m',
      maxFiles: 10
    },
    error: {
      enabled: true,
      level: 'error',
      filename: 'logs/error.log',
      maxSize: '10m',
      maxFiles: 10
    }
  },
  requestLogging: {
    enabled: true,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    includeUserAgent: true,
    includeRemoteAddr: true
  },
  performanceLogging: {
    enabled: true,
    threshold: 1000, // Log requests taking longer than 1 second
    includeStackTrace: false
  }
};

export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

export const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'grey'
};

export default loggingConfig;
