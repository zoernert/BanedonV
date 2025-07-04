/**
 * Server Configuration
 * Express server configuration for mock middleware
 */

export interface ServerConfig {
  port: number;
  host: string;
  protocol: 'http' | 'https';
  cors: {
    enabled: boolean;
    origin: string[] | boolean;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
  };
  compression: {
    enabled: boolean;
    threshold: number;
    level: number;
  };
  static: {
    enabled: boolean;
    path: string;
    maxAge: number;
    fallback: string;
  };
  security: {
    helmet: boolean;
    trustProxy: boolean;
    hidePoweredBy: boolean;
  };
  api: {
    prefix: string;
    version: string;
    timeout: number;
    maxBodySize: string;
  };
}

export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3002', 10),
  host: process.env.HOST || '0.0.0.0',
  protocol: 'http',
  cors: {
    enabled: true,
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://10.0.0.14:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  },
  compression: {
    enabled: true,
    threshold: 1024, // Only compress responses larger than 1KB
    level: 6 // Compression level (1-9)
  },
  static: {
    enabled: true,
    path: './dist/frontend',
    maxAge: 86400000, // 1 day in milliseconds
    fallback: 'index.html' // For SPA fallback
  },
  security: {
    helmet: true,
    trustProxy: true,
    hidePoweredBy: true
  },
  api: {
    prefix: '/api',
    version: 'v1',
    timeout: 30000, // 30 seconds
    maxBodySize: '10mb'
  }
};

export const environmentConfig = {
  development: {
    ...serverConfig,
    cors: {
      ...serverConfig.cors,
      origin: true // Allow all origins in development
    },
    rateLimit: {
      ...serverConfig.rateLimit,
      max: 1000 // Higher limit for development
    }
  },
  production: {
    ...serverConfig,
    cors: {
      ...serverConfig.cors,
      origin: ['https://banedonv.com', 'https://app.banedonv.com']
    },
    rateLimit: {
      ...serverConfig.rateLimit,
      max: 50 // Lower limit for production
    }
  }
};

export default serverConfig;
