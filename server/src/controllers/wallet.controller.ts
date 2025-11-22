import { Request, Response } from 'express';
import { walletService } from '../services/wallet.service';
import {
  CreateWalletRequest,
  CreateWalletResponse,
  GetBalancesResponse,
  AuthorizeAgentRequest,
  AuthorizeAgentResponse,
} from '../types/wallet.types';

/**
 * Wallet Controller
 * Handles HTTP requests for wallet operations
 */

/**
 * POST /api/wallet/create
 * Create a new server wallet (agent wallet) for a user
 */
export async function createWallet(req: Request, res: Response): Promise<void> {
  try {
    const { userId, userAddress } = req.body as CreateWalletRequest;

    // Validate input
    if (!userId || !userAddress) {
      res.status(400).json({
        success: false,
        error: 'userId and userAddress are required',
      } as CreateWalletResponse);
      return;
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address format',
      } as CreateWalletResponse);
      return;
    }

    // Create server wallet
    const wallet = await walletService.createServerWallet(userId, userAddress);

    res.status(201).json({
      success: true,
      data: {
        userId: wallet.userId,
        embeddedWalletAddress: wallet.embeddedWalletAddress,
        serverWalletAddress: wallet.serverWalletAddress,
        agentAuthorized: wallet.agentAuthorized,
      },
    } as CreateWalletResponse);
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet',
    } as CreateWalletResponse);
  }
}

/**
 * GET /api/wallet/:userId
 * Get wallet information for a user
 */
export async function getWallet(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId is required',
      });
      return;
    }

    const userWallet = await walletService.getUserWallet(userId);

    if (!userWallet) {
      res.status(404).json({
        success: false,
        error: 'Wallet not found for this user',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: userWallet,
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet',
    });
  }
}

/**
 * GET /api/wallet/by-address/:address
 * Get wallet information by embedded wallet address
 */
export async function getWalletByAddress(req: Request, res: Response): Promise<void> {
  try {
    const { address } = req.params;

    if (!address) {
      res.status(400).json({
        success: false,
        error: 'address is required',
      });
      return;
    }

    const userWallet = await walletService.getWalletByAddress(address);

    if (!userWallet) {
      res.status(404).json({
        success: false,
        error: 'Wallet not found for this address',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: userWallet,
    });
  } catch (error) {
    console.error('Error getting wallet by address:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet',
    });
  }
}

/**
 * GET /api/wallet/:userId/balances
 * Get token balances for a wallet
 */
export async function getBalances(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { walletAddress } = req.query;

    if (!userId || !walletAddress) {
      res.status(400).json({
        success: false,
        error: 'userId and walletAddress are required',
      } as GetBalancesResponse);
      return;
    }

    const balances = await walletService.getBalances(walletAddress as string);

    res.status(200).json({
      success: true,
      data: {
        walletAddress: walletAddress as string,
        balances,
      },
    } as GetBalancesResponse);
  } catch (error) {
    console.error('Error getting balances:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get balances',
    } as GetBalancesResponse);
  }
}

/**
 * POST /api/wallet/authorize
 * Authorize the agent to execute transactions
 * (In production, this would verify the user's signature)
 */
export async function authorizeAgent(req: Request, res: Response): Promise<void> {
  try {
    const { userId, userAddress, signature } = req.body as AuthorizeAgentRequest;

    // Validate input
    if (!userId || !userAddress || !signature) {
      res.status(400).json({
        success: false,
        error: 'userId, userAddress, and signature are required',
      } as AuthorizeAgentResponse);
      return;
    }

    // TODO: Verify signature
    // In production, verify that the signature is valid and matches the user's address
    // For now, we'll just acknowledge the authorization

    console.log(`User ${userId} authorized agent for address ${userAddress}`);

    res.status(200).json({
      success: true,
      data: {
        authorized: true,
        timestamp: Date.now(),
      },
    } as AuthorizeAgentResponse);
  } catch (error) {
    console.error('Error authorizing agent:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to authorize agent',
    } as AuthorizeAgentResponse);
  }
}

/**
 * POST /api/wallet/:userId/sign
 * Sign a message with the server wallet (for testing)
 */
export async function signMessage(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!userId || !message) {
      res.status(400).json({
        success: false,
        error: 'userId and message are required',
      });
      return;
    }

    const signature = await walletService.signMessage(userId, message);

    res.status(200).json({
      success: true,
      data: {
        message,
        signature,
      },
    });
  } catch (error) {
    console.error('Error signing message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign message',
    });
  }
}
