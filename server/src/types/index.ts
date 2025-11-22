import { Request, Response } from 'express';

// Extend Express Request to include user data
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userAddress?: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  embeddedWalletAddress: string;
  serverWalletAddress: string;
  treasuryBalance: string;
  agentAuthorized: boolean;
  createdAt: Date;
}

// Payment types
export interface RecurringPayment {
  id: string;
  userId: string;
  recipientAddress: string;
  recipientName: string;
  amount: string;
  token: string;
  intervalDays: number;
  nextExecution: Date;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  gaslessEnabled: boolean;
  executionCount: number;
}

export interface PaymentIntent {
  id: string;
  paymentId: string;
  intentHash: string;
  signature: string;
  submittedToFisherAt?: Date;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
  createdAt: Date;
}

export interface PaymentExecution {
  id: string;
  paymentId: string;
  executedAt: Date;
  txHash?: string;
  fisherUsed: boolean;
  gasCost: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

// Fisher types
export interface FisherIntent {
  from: string;
  to: string;
  token: string;
  amount: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface FisherResponse {
  success: boolean;
  intentHash: string;
  executionId?: string;
  error?: string;
}
