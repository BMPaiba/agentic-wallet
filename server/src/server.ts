import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/env.config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger, corsOptions } from './middleware/logger.middleware';
import apiRoutes from './routes';

// Create Express app
const app: Application = express();

// Validate configuration
try {
  validateConfig();
  console.log('✅ Configuration validated');
} catch (error) {
  console.error('❌ Configuration error:', error);
  if (config.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 Agentic Wallet Server - EVVM MATE Protocol Integration',
    version: '1.0.0',
    documentation: '/api/info',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🚀 Agentic Wallet Server`);
  console.log(`🚀 Environment: ${config.NODE_ENV}`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📡 Available endpoints:');
  console.log(`   GET  /              - Root`);
  console.log(`   GET  /api/health    - Health check`);
  console.log(`   GET  /api/info      - API info`);
  console.log('');
  console.log('⚡ Ready to accept connections...');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
