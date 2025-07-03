import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Qdrant
  QDRANT_URL: process.env.QDRANT_URL || 'http://localhost:6333',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // AI/ML
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  
  // File Storage
  FILE_STORAGE_PATH: process.env.FILE_STORAGE_PATH || '/opt/banedonv/storage',
  
  // SMTP
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // API
  API_KEY: process.env.API_KEY!,
  
  // Server
  PORT: parseInt(process.env.PORT || '3000'),
};

// Validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'GEMINI_API_KEY',
  'API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
