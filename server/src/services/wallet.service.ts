import { CdpClient } from '@coinbase/cdp-sdk';
import { createHash } from 'crypto';
import { config } from '../config/env.config';
import { Wallet } from '../config/schemas';
import { UserWallet, WalletBalance } from '../types/wallet.types';

/**
 * Wallet Service
 * Manages Server Wallets (Agent Wallets) using Coinbase CDP SDK v2
 */
class WalletService {
  private cdp: CdpClient | null = null;
  private accounts: Map<string, any> = new Map(); // userId -> EVM Account

  /**
   * Initialize Coinbase CDP Client
   */
  async initialize(): Promise<void> {
    try {
      if (!config.CDP_API_KEY_NAME || !config.CDP_PRIVATE_KEY || !config.CDP_WALLET_SECRET) {
        console.warn('⚠️  CDP credentials not configured - wallet service will run in mock mode');
        return;
      }

      // Initialize CDP Client with correct parameter names
      this.cdp = new CdpClient({
        apiKeyId: config.CDP_API_KEY_NAME,
        apiKeySecret: config.CDP_PRIVATE_KEY,
        walletSecret: config.CDP_WALLET_SECRET,
      });

      console.log('✅ Coinbase CDP Client v2 initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Coinbase CDP Client:', error);
      throw error;
    }
  }

  /**
   * Create a new Server Wallet for a user (Agent Wallet)
   * This wallet will execute transactions on behalf of the user
   */
  async createServerWallet(userId: string, userAddress: string): Promise<UserWallet> {
    if (!this.cdp) {
      throw new Error('CDP Client not initialized');
    }

    try {
      // Check if wallet already exists in MongoDB by embedded address
      const existingWallet = await Wallet.findOne({ 
        embeddedWalletAddress: userAddress.toLowerCase() 
      });

      if (existingWallet) {
        console.log(`Server wallet already exists for address: ${userAddress}`);
        return {
          userId: existingWallet.userId,
          embeddedWalletAddress: existingWallet.embeddedWalletAddress,
          serverWalletAddress: existingWallet.serverWalletAddress,
          serverWalletId: existingWallet.serverWalletId,
          agentAuthorized: existingWallet.agentAuthorized,
          createdAt: existingWallet.createdAt,
        };
      }

      // Create new EVM account using CDP v2
      console.log(`Creating server wallet for user: ${userId}`);
      const account = await this.cdp.evm.createAccount();
      
      console.log(`✅ Server wallet created: ${account.address}`);

      // Store account in memory for quick access
      this.accounts.set(userId, account);

      // Save to MongoDB
      const walletDoc = new Wallet({
        userId,
        embeddedWalletAddress: userAddress.toLowerCase(),
        serverWalletAddress: account.address.toLowerCase(),
        serverWalletId: account.address, // CDP v2 uses address as ID
        serverWalletData: JSON.stringify({ address: account.address }),
        agentAuthorized: false,
      });

      await walletDoc.save();

      return {
        userId: walletDoc.userId,
        embeddedWalletAddress: walletDoc.embeddedWalletAddress,
        serverWalletAddress: walletDoc.serverWalletAddress,
        serverWalletId: walletDoc.serverWalletId,
        agentAuthorized: walletDoc.agentAuthorized,
        createdAt: walletDoc.createdAt,
      };
    } catch (error) {
      console.error('Failed to create server wallet:', error);
      throw error;
    }
  }

  /**
   * Get user wallet info by embedded wallet address
   */
  async getWalletByAddress(embeddedAddress: string): Promise<UserWallet | null> {
    try {
      const walletDoc = await Wallet.findOne({
        embeddedWalletAddress: embeddedAddress.toLowerCase(),
      });

      if (!walletDoc) {
        return null;
      }

      return {
        userId: walletDoc.userId,
        embeddedWalletAddress: walletDoc.embeddedWalletAddress,
        serverWalletAddress: walletDoc.serverWalletAddress,
        serverWalletId: walletDoc.serverWalletId,
        agentAuthorized: walletDoc.agentAuthorized,
        createdAt: walletDoc.createdAt,
      };
    } catch (error) {
      console.error('Error getting wallet by address:', error);
      return null;
    }
  }

  /**
   * Get user wallet info by userId
   */
  async getUserWallet(userId: string): Promise<UserWallet | null> {
    try {
      const walletDoc = await Wallet.findOne({ userId });

      if (!walletDoc) {
        return null;
      }

      return {
        userId: walletDoc.userId,
        embeddedWalletAddress: walletDoc.embeddedWalletAddress,
        serverWalletAddress: walletDoc.serverWalletAddress,
        serverWalletId: walletDoc.serverWalletId,
        agentAuthorized: walletDoc.agentAuthorized,
        createdAt: walletDoc.createdAt,
      };
    } catch (error) {
      console.error('Error getting user wallet:', error);
      return null;
    }
  }

  /**
   * Get server wallet address for a user
   */
  async getServerWalletAddress(userId: string): Promise<string | null> {
    const wallet = await this.getUserWallet(userId);
    return wallet?.serverWalletAddress || null;
  }

  /**
   * Get wallet balances
   */
  async getBalances(_walletAddress: string): Promise<WalletBalance[]> {
    if (!this.cdp) {
      throw new Error('CDP Client not initialized');
    }

    try {
      // TODO: Implement actual balance fetching using CDP v2
      const balances: WalletBalance[] = [];
      return balances;
    } catch (error) {
      console.error('Failed to get balances:', error);
      throw error;
    }
  }

  /**
   * Sign a message with the server wallet
   */
  async signMessage(userId: string, message: string): Promise<string> {
    if (!this.cdp) {
      throw new Error('CDP Client not initialized');
    }

    try {
      const walletDoc = await Wallet.findOne({ userId });
      if (!walletDoc) {
        throw new Error('Wallet not found');
      }

      // Hash the message
      const messageHash = createHash('sha256').update(message).digest('hex');
      const hexHash = `0x${messageHash}`;

      // TODO: Implement signing with CDP v2 SDK
      // For now, return a placeholder
      return hexHash;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }
}

// Singleton instance
export const walletService = new WalletService();
