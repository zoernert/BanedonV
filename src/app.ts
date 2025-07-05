/**
 * Express App Configuration
 * Main application setup with comprehensive middleware stack
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { serverConfig } from './config/server';
import { LoggingMiddleware } from './middleware/logging';
import { ErrorMiddleware } from './middleware/error';
import { RateLimitMiddleware } from './middleware/rate-limit';
import logger from './utils/logger';
import ResponseUtil from './utils/response';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import collectionRoutes from './routes/collections';
import fileRoutes from './routes/files';
import searchRoutes from './routes/search';
import billingRoutes from './routes/billing';
import adminRoutes from './routes/admin';
import integrationRoutes from './routes/integrations';
import healthRoutes from './routes/health';
import metricsRoutes from './routes/metrics';

export class App {
  public app: Express;
  private config = serverConfig;

  constructor() {
    this.app = express();
    this.setupGlobalErrorHandlers();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupStaticFiles();
    this.setupErrorHandlers();
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    ErrorMiddleware.setupGlobalHandlers();
  }

  /**
   * Setup middleware stack
   */
  private setupMiddleware(): void {
    // Trust proxy for rate limiting and IP detection
    if (this.config.security.trustProxy) {
      this.app.set('trust proxy', 1);
    }

    // Security middleware
    if (this.config.security.helmet) {
      this.app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        }
      }));
    }

    // CORS configuration
    if (this.config.cors.enabled) {
      this.app.use(cors({
        origin: this.config.cors.origin,
        credentials: this.config.cors.credentials,
        methods: this.config.cors.methods,
        allowedHeaders: this.config.cors.allowedHeaders
      }));
    }

    // Compression middleware
    if (this.config.compression.enabled) {
      this.app.use(compression({
        threshold: this.config.compression.threshold,
        level: this.config.compression.level
      }));
    }

    // Body parsing middleware
    this.app.use(bodyParser.json({ 
      limit: this.config.api.maxBodySize 
    }));
    this.app.use(bodyParser.urlencoded({ 
      extended: true, 
      limit: this.config.api.maxBodySize 
    }));
    this.app.use(cookieParser());

    // Logging middleware
    this.app.use(...LoggingMiddleware.getLoggingStack());
    this.app.use(LoggingMiddleware.getMorganLogger());

    // Rate limiting middleware
    if (process.env.NODE_ENV !== 'test') {
      const rateLimits = RateLimitMiddleware.getRateLimitConfig();
      this.app.use(rateLimits.standard);
    }

    logger.info('Middleware stack initialized');
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    const apiPrefix = `${this.config.api.prefix}/${this.config.api.version}`;

    // Health and metrics routes (no rate limiting)
    this.app.use('/health', healthRoutes);
    this.app.use('/metrics', metricsRoutes);
    this.app.use(`${apiPrefix}/metrics`, metricsRoutes);

    // API routes with rate limiting
    if (process.env.NODE_ENV !== 'test') {
      const rateLimits = RateLimitMiddleware.getRateLimitConfig();
      
      // Authentication routes with strict rate limiting (except /me)
      this.app.use(`${apiPrefix}/auth`, (req, res, next) => {
        // Apply standard rate limiting to /me endpoint
        if (req.path === '/me') {
          return rateLimits.api(req, res, next);
        }
        // Apply strict rate limiting to other auth endpoints
        return rateLimits.auth(req, res, next);
      }, authRoutes);
      
      // API routes with standard rate limiting
      this.app.use(`${apiPrefix}/users`, rateLimits.api, userRoutes);
      this.app.use(`${apiPrefix}/collections`, rateLimits.api, collectionRoutes);
      this.app.use(`${apiPrefix}/files`, rateLimits.api, fileRoutes);
      this.app.use(`${apiPrefix}/search`, rateLimits.search, searchRoutes);
      this.app.use(`${apiPrefix}/billing`, rateLimits.api, billingRoutes);
      this.app.use(`${apiPrefix}/admin`, rateLimits.api, adminRoutes);
      this.app.use(`${apiPrefix}/integrations`, rateLimits.api, integrationRoutes);
    } else {
      // No rate limiting for test environment
      this.app.use(`${apiPrefix}/auth`, authRoutes);
      this.app.use(`${apiPrefix}/users`, userRoutes);
      this.app.use(`${apiPrefix}/collections`, collectionRoutes);
      this.app.use(`${apiPrefix}/files`, fileRoutes);
      this.app.use(`${apiPrefix}/search`, searchRoutes);
      this.app.use(`${apiPrefix}/billing`, billingRoutes);
      this.app.use(`${apiPrefix}/admin`, adminRoutes);
      this.app.use(`${apiPrefix}/integrations`, integrationRoutes);
    }

    // API info endpoint
    this.app.get(`${apiPrefix}`, (req: Request, res: Response) => {
      ResponseUtil.success(res, {
        name: 'BanedonV Mock API',
        version: this.config.api.version,
        description: 'Mock API server for BanedonV development',
        endpoints: [
          `${apiPrefix}/auth`,
          `${apiPrefix}/users`,
          `${apiPrefix}/collections`,
          `${apiPrefix}/files`,
          `${apiPrefix}/search`,
          `${apiPrefix}/billing`,
          `${apiPrefix}/admin`,
          `${apiPrefix}/integrations`
        ],
        timestamp: new Date().toISOString()
      });
    });

    logger.info('API routes initialized', { prefix: apiPrefix });
  }

  /**
   * Setup static file serving with SPA fallback
   */
  private setupStaticFiles(): void {
    if (this.config.static.enabled) {
      const staticPath = path.resolve(this.config.static.path);
      
      // Serve static files
      this.app.use(express.static(staticPath, {
        maxAge: this.config.static.maxAge,
        index: false // Don't serve index.html automatically
      }));

      // SPA fallback - serve index.html for all non-API routes
      this.app.get('*', (req: Request, res: Response, next) => {
        // Skip API routes
        if (req.path.startsWith(this.config.api.prefix)) {
          return next();
        }

        // Skip health and metrics routes
        if (req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
          return next();
        }

        // Serve index.html for frontend routes
        const indexPath = path.join(staticPath, this.config.static.fallback);
        res.sendFile(indexPath, (err) => {
          if (err) {
            logger.error('Failed to serve index.html', { 
              error: err.message,
              path: indexPath,
              requestPath: req.path
            });
            next();
          }
        });
      });

      logger.info('Static file serving initialized', { 
        path: staticPath,
        fallback: this.config.static.fallback
      });
    }
  }

  /**
   * Setup error handling middleware
   */
  private setupErrorHandlers(): void {
    // 404 handler for undefined routes
    this.app.use(ErrorMiddleware.notFoundHandler);

    // Global error handler
    this.app.use(ErrorMiddleware.globalErrorHandler);

    logger.info('Error handlers initialized');
  }

  /**
   * Get Express app instance
   */
  public getApp(): Express {
    return this.app;
  }

  /**
   * Get server configuration
   */
  public getConfig() {
    return this.config;
  }
}

export default App;
