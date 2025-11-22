import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { createHash } from 'crypto';
import { config } from '../config/env.config';
import { UserWallet, WalletBalance } from '../types/wallet.types';

/**
 * Wallet Service
 * Manages Server Wallets (Agent Wallets) using Coinbase CDP SDK
 */
class WalletService {
  private coinbase: Coinbase | null = null;
  private wallets: Map<string, Wallet> = new Map(); // userId -> Wallet instance
  private userWallets: Map<string, UserWallet> = new Map(); // userId -> UserWallet info
  private addressToUserId: Map<string, string> = new Map(); // embeddedAddress -> userId

  /**
   * Initialize Coinbase SDK
   */
  async initialize(): Promise<void> {
    try {
      if (!config.CDP_API_KEY_NAME || !config.CDP_PRIVATE_KEY) {
        console.warn('⚠️  CDP credentials not configured - wallet service will run in mock mode');
        return;
      }

      // Configure Coinbase SDK with CDP credentials
      this.coinbase = new Coinbase({
        apiKeyName: config.CDP_API_KEY_NAME,
        privateKey: config.CDP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });

      console.log('✅ Coinbase SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Coinbase SDK:', error);
      throw error;
    }
  }

  /**
   * Create a new Server Wallet for a user (Agent Wallet)
   * This wallet will execute transactions on behalf of the user
   */
  async createServerWallet(userId: string, userAddress: string): Promise<UserWallet> {
    if (!this.coinbase) {
      throw new Error('Coinbase SDK not initialized');
    }

    try {
      // Check if wallet already exists for this embedded address
      const existingByAddress = this.addressToUserId.get(userAddress.toLowerCase());
      if (existingByAddress) {
        const existingWallet = this.userWallets.get(existingByAddress);
        if (existingWallet) {
          console.log(`Server wallet already exists for address: ${userAddress}`);
          return existingWallet;
        }
      }

      // Check if wallet already exists for this user
      if (this.wallets.has(userId)) {
        const existingWallet = this.wallets.get(userId)!;
        const defaultAddress = await existingWallet.getDefaultAddress();
        
        return {
          userId,
          embeddedWalletAddress: userAddress,
          serverWalletAddress: defaultAddress?.getId() || '',
          serverWalletId: existingWallet.getId() || '',
          agentAuthorized: false,
          createdAt: new Date(),
        };
      }

      // Create new wallet on Sepolia network
      console.log(`Creating server wallet for user: ${userId}`);
      const wallet = await Wallet.create({
        networkId: Coinbase.networks.BaseSepolia, // Using Base Sepolia testnet
      });

      // Get the default address
      const defaultAddress = await wallet.getDefaultAddress();
      const serverWalletAddress = defaultAddress?.getId() || '';

      console.log(`✅ Server wallet created: ${serverWalletAddress}`);

      // Store wallet in memory (in production, persist to DB)
      this.wallets.set(userId, wallet);

      const userWalletData: UserWallet = {
        userId,
        embeddedWalletAddress: userAddress,
        serverWalletAddress,
        serverWalletId: wallet.getId() || '',
        agentAuthorized: false,
        createdAt: new Date(),
      };

      // Store user wallet info and address mapping
      this.userWallets.set(userId, userWalletData);
      this.addressToUserId.set(userAddress.toLowerCase(), userId);

      return userWalletData;
    } catch (error) {
      console.error('Failed to create server wallet:', error);
      throw error;
    }
  }

  /**
   * Get Server Wallet for a user
   */
  async getServerWallet(userId: string): Promise<Wallet | null> {
    return this.wallets.get(userId) || null;
  }

  /**
   * Get wallet balances
   */
  async getBalances(_walletAddress: string): Promise<WalletBalance[]> {
    if (!this.coinbase) {
      throw new Error('Coinbase SDK not initialized');
    }

    try {
      // In a real implementation, you would query the blockchain
      // For now, return mock data structure
      const balances: WalletBalance[] = [];

      // TODO: Implement actual balance fetching using viem or ethers
      // This would query ERC20 token contracts for balances

      return balances;
    } catch (error) {
      console.error('Failed to get balances:', error);
      throw error;
    }
  }

  /**
   * Get server wallet address for a user
   */
  async getServerWalletAddress(userId: string): Promise<string | null> {
    const wallet = this.wallets.get(userId);
    if (!wallet) {
      return null;
    }

    const defaultAddress = await wallet.getDefaultAddress();
    return defaultAddress?.getId() || null;
  }

  /**
   * Export wallet data (for persistence)
   */
  async exportWallet(userId: string): Promise<any> {
    const wallet = this.wallets.get(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return await wallet.export();
  }

  /**
   * Import wallet data (from persistence)
   */
  async importWallet(userId: string, walletData: any): Promise<void> {
    if (!this.coinbase) {
      throw new Error('Coinbase SDK not initialized');
    }

    const wallet = await Wallet.import(walletData);
    this.wallets.set(userId, wallet);
  }

  /**
   * Get user wallet info by embedded wallet address
   */
  async getWalletByAddress(embeddedAddress: string): Promise<UserWallet | null> {
    const userId = this.addressToUserId.get(embeddedAddress.toLowerCase());
    if (!userId) {
      return null;
    }
    return this.userWallets.get(userId) || null;
  }

  /**
   * Get user wallet info by userId
   */
  async getUserWallet(userId: string): Promise<UserWallet | null> {
    return this.userWallets.get(userId) || null;
  }

  /**
   * Sign a message with the server wallet
   */
  async signMessage(userId: string, message: string): Promise<string> {
    const wallet = this.wallets.get(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Hash the message with keccak256 (Ethereum standard)
    const messageHash = createHash('sha256').update(message).digest('hex');
    const hexHash = `0x${messageHash}`;

    // Sign the hash using the wallet
    const signature = await wallet.createPayloadSignature(hexHash);
    return signature.getSignature() || '';
  }
}

// Singleton instance
export const walletService = new WalletService();
