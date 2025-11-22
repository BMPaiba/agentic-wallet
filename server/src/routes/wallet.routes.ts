import { Router } from 'express';
import {
  createWallet,
  getWallet,
  getWalletByAddress,
  getBalances,
  authorizeAgent,
  signMessage,
  deleteWallet,
} from '../controllers/wallet.controller';

const router = Router();

/**
 * Wallet Routes
 */

// POST /api/wallet/create - Create a new server wallet for user
router.post('/create', createWallet);

// GET /api/wallet/by-address/:address - Get wallet info by embedded address
router.get('/by-address/:address', getWalletByAddress);

// GET /api/wallet/:userId - Get wallet info by userId
router.get('/:userId', getWallet);

// GET /api/wallet/:userId/balances - Get token balances
router.get('/:userId/balances', getBalances);

// POST /api/wallet/authorize - Authorize agent to execute transactions
router.post('/authorize', authorizeAgent);

// POST /api/wallet/:userId/sign - Sign a message (for testing)
router.post('/:userId/sign', signMessage);

// DELETE /api/wallet/:userId - Delete wallet
router.delete('/:userId', deleteWallet);

export default router;
