/**
 * Wallet-related types
 */

export interface UserWallet {
  userId: string;
  embeddedWalletAddress: string; // User's embedded wallet (0xUSER...)
  serverWalletAddress: string;   // Agent's server wallet (0xAGENT...)
  serverWalletId: string;         // CDP wallet ID
  agentAuthorized: boolean;       // Whether user approved agent
  createdAt: Date;
}

export interface WalletBalance {
  token: string;           // Token symbol (USDC, ETH, etc)
  tokenAddress: string;    // Contract address
  balance: string;         // Amount in wei/smallest unit
  decimals: number;        // Token decimals
  formatted: string;       // Human-readable amount
}

export interface CreateWalletRequest {
  userId: string;
  userAddress: string;     // Embedded wallet address from frontend
}

export interface CreateWalletResponse {
  success: boolean;
  data?: {
    userId: string;
    embeddedWalletAddress: string;
    serverWalletAddress: string;
    agentAuthorized: boolean;
  };
  error?: string;
}

export interface GetBalancesRequest {
  userId: string;
  walletAddress: string;
}

export interface GetBalancesResponse {
  success: boolean;
  data?: {
    walletAddress: string;
    balances: WalletBalance[];
  };
  error?: string;
}

export interface AuthorizeAgentRequest {
  userId: string;
  userAddress: string;
  signature: string;       // User signature approving agent
  expiryHours?: number;    // Optional: hours until authorization expires
  spendingLimitUSD?: number; // Optional: maximum USD the agent can spend
}

export interface AuthorizeAgentResponse {
  success: boolean;
  data?: {
    authorized: boolean;
    expiryDate?: string;   // ISO string
    spendingLimit?: number;
    timestamp: number;
  };
  error?: string;
}
