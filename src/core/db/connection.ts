/**
 * Professional MongoDB Connection Manager
 * Handles database connection with caching, pooling, and event monitoring
 *
 * @module DatabaseConnection
 */

import mongoose from 'mongoose';
import { DB } from '@/config/db';

// =============================================================================
// TYPES
// =============================================================================

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const MONGODB_URI = DB.URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Initialize global cache for hot reloading
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached: MongooseCache = global.mongoose;

// =============================================================================
// CONNECTION MANAGER
// =============================================================================

/**
 * Establish connection to MongoDB
 * Uses cached connection if available (singleton pattern)
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: DB.NAME,
      ...DB.OPTIONS,
      bufferCommands: false,
    };

    console.log(`[MongoDB] Connecting to ${DB.NAME}...`);

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      // Setup event listeners
      mongooseInstance.connection.on('connected', () => {
        console.log('✅ [MongoDB] Connected successfully');
      });

      mongooseInstance.connection.on('error', (err) => {
        console.error('❌ [MongoDB] Connection error:', err);
      });

      mongooseInstance.connection.on('disconnected', () => {
        console.warn('⚠️ [MongoDB] Disconnected');
      });

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ [MongoDB] Connection failed:', e);
    throw e;
  }

  return cached.conn;
}

/**
 * Force disconnect from MongoDB
 * Useful for testing or graceful shutdown
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('👋 [MongoDB] Disconnected');
  }
}

/**
 * Check connection status
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Alias for backward compatibility (lowercase version)
export default connectDB;
