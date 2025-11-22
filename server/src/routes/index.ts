import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import walletRoutes from './wallet.routes';

const router = Router();

// Mount wallet routes
router.use('/wallet', walletRoutes);

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
  };
  res.json(response);
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
