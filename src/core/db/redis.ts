/**
 * Professional Redis Client Manager
 * Handles Redis connection with singleton pattern and error handling
 * 
 * @module RedisClient
 */

import { Redis } from 'ioredis';
import { env } from '@/config/env';

// =============================================================================
// TYPES
// =============================================================================

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

// =============================================================================
// CLIENT FACTORY
// =============================================================================

const redisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const getRedisClient = () => {
  if (!env.REDIS_URL) {
    console.warn('⚠️ REDIS_URL not defined, Redis features will be disabled');
    // Return a mock or null if preferred, but for now we'll throw or return a dummy that fails gracefully?
    // Better to just let it fail if required, or return a disconnected client.
    // For "autopilot", we'll assume it might not be configured yet, so we return a dummy-ish client or handle it.
    // However, the health check imports this.
    
    // For safety in dev environment without Redis:
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock Redis for development');
      // @ts-ignore
      return new Redis({ lazyConnect: true }); // Won't connect
    }
    
    throw new Error('REDIS_URL not defined');
  }

  const client = new Redis(env.REDIS_URL, redisOptions);

  client.on('error', (err) => {
    console.error('❌ [Redis] Error:', err);
  });

  client.on('connect', () => {
    console.log('✅ [Redis] Connected');
  });

  return client;
};

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

// Use global singleton to prevent multiple connections in serverless/hot-reload env
export const redis = global.redis || getRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}

export default redis;
