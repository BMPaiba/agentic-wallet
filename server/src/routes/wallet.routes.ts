import { Router } from 'express';
import {
  createWallet,
  getWallet,
  getBalances,
  authorizeAgent,
  signMessage,
} from '../controllers/wallet.controller';

const router = Router();

/**
 * Wallet Routes
 */

// POST /api/wallet/create - Create a new server wallet for user
router.post('/create', createWallet);

// GET /api/wallet/:userId - Get wallet info
router.get('/:userId', getWallet);

// GET /api/wallet/:userId/balances - Get token balances
router.get('/:userId/balances', getBalances);

// POST /api/wallet/authorize - Authorize agent to execute transactions
router.post('/authorize', authorizeAgent);

// POST /api/wallet/:userId/sign - Sign a message (for testing)
router.post('/:userId/sign', signMessage);

export default router;
