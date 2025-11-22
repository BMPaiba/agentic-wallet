import { CdpClient } from '@coinbase/cdp-sdk';
import { Wallet as EthersWallet } from 'ethers';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
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
  private encryptionKey: Buffer;

  constructor() {
    // Use CDP_WALLET_SECRET as encryption key (32 bytes for AES-256)
    const hash = createHash('sha256').update(config.CDP_WALLET_SECRET || 'default-secret').digest();
    this.encryptionKey = hash;
  }

  /**
   * Encrypt private key for storage
   */
  private encryptPrivateKey(privateKey: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt private key from storage
   */
  private decryptPrivateKey(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

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
      // Check if wallet already exists - if so, delete it to recreate
      const existingWallet = await Wallet.findOne({ 
        embeddedWalletAddress: userAddress.toLowerCase() 
      });

      if (existingWallet) {
        console.log(`🔄 Wallet exists for address: ${userAddress}, deleting old wallet...`);
        await Wallet.deleteOne({ embeddedWalletAddress: userAddress.toLowerCase() });
        this.accounts.delete(existingWallet.userId);
      }

      // Create new EVM account using CDP v2
      console.log(`Creating server wallet for user: ${userId}`);
      const account = await this.cdp.evm.createAccount();
      
      console.log(`✅ Server wallet created: ${account.address}`);
      console.log(`Account keys available:`, Object.keys(account));

      // Try to access the private key from the account
      // The CDP SDK uses viem's Account under the hood
      let privateKey: string | null = null;
      
      // Check if account has a privateKey property or method
      if ('privateKey' in account) {
        privateKey = (account as any).privateKey;
      } else if ('getPrivateKey' in account) {
        privateKey = await (account as any).getPrivateKey();
      }

      if (!privateKey) {
        console.warn('⚠️  Could not extract private key, wallet will only work in memory');
      }

      // Store account in memory for signing operations
      this.accounts.set(userId, account);

      // Encrypt and store private key if available
      const encryptedPrivateKey = privateKey 
        ? this.encryptPrivateKey(privateKey)
        : this.encryptPrivateKey(account.address); // Fallback to address

      // Save to MongoDB
      const walletDoc = new Wallet({
        userId,
        embeddedWalletAddress: userAddress.toLowerCase(),
        serverWalletAddress: account.address.toLowerCase(),
        serverWalletId: account.address,
        serverWalletData: JSON.stringify({ 
          address: account.address,
          hasPrivateKey: !!privateKey 
        }),
        encryptedPrivateKey,
        agentAuthorized: false,
        agentSpentAmount: 0,
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
    try {
      const walletDoc = await Wallet.findOne({ userId });
      if (!walletDoc) {
        throw new Error('Wallet not found');
      }

      // Check if agent is authorized
      if (!walletDoc.agentAuthorized) {
        throw new Error('Agent not authorized for this wallet');
      }

      // Check authorization expiry
      if (walletDoc.agentAuthorizationExpiry && walletDoc.agentAuthorizationExpiry < new Date()) {
        throw new Error('Agent authorization has expired');
      }

      // Try to get account from memory first
      let account = this.accounts.get(userId);
      
      if (account) {
        // Use CDP SDK account to sign
        const signature = await account.signMessage({ message });
        console.log(`✅ Message signed by wallet: ${walletDoc.serverWalletAddress}`);
        return signature;
      }

      // If not in memory, try to use stored private key with ethers
      try {
        const privateKey = this.decryptPrivateKey(walletDoc.encryptedPrivateKey);
        
        // Validate it's a real private key (not just the address placeholder)
        if (!privateKey.startsWith('0x') || privateKey.length < 64) {
          throw new Error('Invalid private key stored');
        }

        const ethersWallet = new EthersWallet(privateKey);
        const signature = await ethersWallet.signMessage(message);
        
        console.log(`✅ Message signed with stored key: ${walletDoc.serverWalletAddress}`);
        return signature;
      } catch (error) {
        throw new Error('Account not available and no valid private key stored. Server may have been restarted.');
      }
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  /**
   * Authorize agent with optional limits
   */
  async authorizeAgent(
    userId: string,
    options: {
      authorized: boolean;
      expiryDate?: Date;
      spendingLimit?: number;
    }
  ): Promise<boolean> {
    try {
      const updateData: any = {
        agentAuthorized: options.authorized,
        agentSpentAmount: 0, // Reset spent amount when re-authorizing
      };

      if (options.expiryDate) {
        updateData.agentAuthorizationExpiry = options.expiryDate;
      }

      if (options.spendingLimit) {
        updateData.agentSpendingLimit = options.spendingLimit;
      }

      const result = await Wallet.updateOne({ userId }, { $set: updateData });

      console.log(`📝 Authorization update for ${userId}: ${result.modifiedCount} document(s) modified`);

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Failed to authorize agent:', error);
      throw error;
    }
  }

  /**
   * Delete wallet from DB and memory
   */
  async deleteWallet(userId: string): Promise<boolean> {
    try {
      // Delete from MongoDB
      const result = await Wallet.deleteOne({ userId });
      
      // Delete from memory
      this.accounts.delete(userId);
      
      console.log(`🗑️  Wallet deleted for user: ${userId}`);
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      throw error;
    }
  }
}

// Singleton instance
export const walletService = new WalletService();
