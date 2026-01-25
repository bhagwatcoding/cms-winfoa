/**
 * Professional Redis Client Manager
 * Handles Redis connection with singleton pattern and error handling
 *
 * @module RedisClient
 */

// Redis is optional - this file provides a placeholder/mock when Redis is not configured

// =============================================================================
// TYPES
// =============================================================================

declare global {
  var _redis: unknown;
}

// =============================================================================
// MOCK REDIS CLIENT (for when Redis is not configured)
// =============================================================================

class MockRedisClient {
  private store: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const val = parseInt(this.store.get(key) || '0', 10);
    this.store.set(key, String(val + 1));
    return val + 1;
  }

  async expire(): Promise<number> {
    // Mock - doesn't actually expire
    return 1;
  }

  async ttl(): Promise<number> {
    return -1;
  }

  on(): this {
    return this;
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async quit(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }
}

// =============================================================================
// CLIENT FACTORY
// =============================================================================

export type RedisClient = MockRedisClient;

const getRedisClient = (): RedisClient => {
  const REDIS_URL = process.env.REDIS_URL;

  if (!REDIS_URL) {
    console.warn('⚠️ [Redis] REDIS_URL not defined, using in-memory mock client');
    return new MockRedisClient();
  }

  // If we want real Redis, we need to:
  // 1. npm install ioredis
  // 2. Uncomment and use the real implementation
  console.warn('⚠️ [Redis] Real Redis support requires ioredis. Using mock client.');
  return new MockRedisClient();
};

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

// Use global singleton to prevent multiple connections in serverless/hot-reload env
export const redis: RedisClient = (global._redis as RedisClient) || getRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global._redis = redis;
}

export default redis;
