import mongoose from 'mongoose';
import { config } from './env.config';

/**
 * MongoDB Database Service
 */
class DatabaseService {
  private isConnected = false;

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('✅ Already connected to MongoDB');
      return;
    }

    try {
      const uri = config.MONGODB_URI || 'mongodb://localhost:27017/agentic_wallet';
      
      await mongoose.connect(uri);
      
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
      console.log(`   Database: ${mongoose.connection.name}`);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      // Don't throw in development, just warn
      if (config.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error);
      throw error;
    }
  }

  /**
   * Check connection status
   */
  isReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get database stats
   */
  async getStats() {
    if (!this.isReady()) {
      return {
        connected: false,
        message: 'Database not connected',
      };
    }

    return {
      connected: true,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
      collections: Object.keys(mongoose.connection.collections),
    };
  }
}

// Singleton instance
export const database = new DatabaseService();
