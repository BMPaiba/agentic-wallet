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
  agentAuthorized: boolean;
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
    agentAuthorized: {
      type: Boolean,
      default: false,
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
