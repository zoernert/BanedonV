import express from 'express';
import { securityHeaders, limiter } from '../../../libs/shared/src/security.middleware';
import searchController from './controllers/search.controller';
import fileController from './controllers/file.controller';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(securityHeaders);
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/search', searchController);
app.use('/api/files', fileController);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});

export default app;
