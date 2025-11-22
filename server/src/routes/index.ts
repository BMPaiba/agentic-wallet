import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { database } from '../config/database';
import walletRoutes from './wallet.routes';

const router = Router();

// Mount wallet routes
router.use('/wallet', walletRoutes);

// Health check endpoint
router.get('/health', async (_req: Request, res: Response) => {
  const dbStats = await database.getStats();
  
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStats,
    },
  };
  res.json(response);
});

// Database check endpoint
router.get('/db-check', async (_req: Request, res: Response) => {
  const stats = await database.getStats();
  
  res.json({
    success: database.isReady(),
    data: stats,
  });
});

// Info endpoint
router.get('/info', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      name: 'Agentic Wallet Server',
      version: '1.0.0',
      description: 'Gasless payment server with EVVM MATE Protocol',
      endpoints: {
        health: '/api/health',
        users: '/api/users',
        payments: '/api/payments',
        wallet: '/api/wallet',
      },
    },
  };
  res.json(response);
});

export default router;
