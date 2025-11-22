import mongoose, { Schema, Document } from 'mongoose';

/**
 * Wallet Document Interface
 */
export interface IWallet extends Document {
  userId: string;
  embeddedWalletAddress: string;
  serverWalletAddress: string;
  serverWalletId: string;
  serverWalletData: string; // JSON stringified wallet export
  encryptedPrivateKey: string; // Encrypted private key for signing
  agentAuthorized: boolean;
  agentAuthorizationExpiry?: Date; // Optional expiration date
  agentSpendingLimit?: number; // Optional spending limit in USD
  agentSpentAmount: number; // Track spent amount
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Wallet Schema
 */
const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    embeddedWalletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    serverWalletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    serverWalletId: {
      type: String,
      required: true,
    },
    serverWalletData: {
      type: String,
      required: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: true,
    },
    agentAuthorized: {
      type: Boolean,
      default: false,
    },
    agentAuthorizationExpiry: {
      type: Date,
      required: false,
    },
    agentSpendingLimit: {
      type: Number,
      required: false,
    },
    agentSpentAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Wallet Model
 */
export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
