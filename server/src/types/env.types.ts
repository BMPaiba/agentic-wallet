// Environment configuration types
export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  
  // Coinbase Developer Platform
  CDP_API_KEY_NAME: string;
  CDP_PRIVATE_KEY: string;
  CDP_WALLET_SECRET: string;
  
  // EVVM MATE Protocol
  EVVM_APP_ID: string;
  FISHER_API_URL: string;
  FISHER_WS_URL: string;
  MATE_TREASURY_ADDRESS: string;
  MATE_TOKEN_ADDRESS: string;
  
  // Blockchain
  SEPOLIA_RPC_URL: string;
  CHAIN_ID: number;
  
  // Database (future)
  DATABASE_URL?: string;
  MONGODB_URI: string;
  
  // OpenAI (for agent)
  OPENAI_API_KEY?: string;
}
