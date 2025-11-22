import dotenv from 'dotenv';
import { EnvConfig } from '../types/env.types';

// Load environment variables
dotenv.config();

// Validate and export configuration
export const config: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Coinbase Developer Platform
  CDP_API_KEY_NAME: process.env.CDP_API_KEY_NAME || '',
  CDP_PRIVATE_KEY: process.env.CDP_PRIVATE_KEY || '',
  
  // EVVM MATE Protocol
  EVVM_APP_ID: process.env.EVVM_APP_ID || '',
  FISHER_API_URL: process.env.FISHER_API_URL || '',
  FISHER_WS_URL: process.env.FISHER_WS_URL || '',
  MATE_TREASURY_ADDRESS: process.env.MATE_TREASURY_ADDRESS || '',
  MATE_TOKEN_ADDRESS: process.env.MATE_TOKEN_ADDRESS || '',
  
  // Blockchain
  SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/',
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '11155111', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

// Validate required variables in production
export function validateConfig(): void {
  const requiredVars: (keyof EnvConfig)[] = [
    'CDP_API_KEY_NAME',
    'CDP_PRIVATE_KEY',
    'EVVM_APP_ID',
    'FISHER_API_URL',
    'MATE_TREASURY_ADDRESS',
  ];

  if (config.NODE_ENV === 'production') {
    const missingVars = requiredVars.filter((key) => !config[key]);
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  } else {
    // In development, just warn
    const missingVars = requiredVars.filter((key) => !config[key]);
    if (missingVars.length > 0) {
      console.warn(
        `⚠️  Missing environment variables (development mode): ${missingVars.join(', ')}`
      );
    }
  }
}
