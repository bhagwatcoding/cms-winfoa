interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export class RateLimitService {
  /**
   * Check rate limit for API key
   */
  static async checkRateLimit(
    apiKeyId: string,
    limit: number
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
  }> {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window

    // Get or create rate limit entry
    if (!rateLimitStore[apiKeyId] || rateLimitStore[apiKeyId].resetAt < now) {
      rateLimitStore[apiKeyId] = {
        count: 0,
        resetAt: now + windowMs,
      };
    }

    const entry = rateLimitStore[apiKeyId];

    // Check if limit exceeded
    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment count
    entry.count++;

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Reset rate limit for API key
   */
  static resetRateLimit(apiKeyId: string) {
    delete rateLimitStore[apiKeyId];
  }

  /**
   * Get current rate limit status
   */
  static getRateLimitStatus(apiKeyId: string, limit: number) {
    const entry = rateLimitStore[apiKeyId];

    if (!entry || entry.resetAt < Date.now()) {
      return {
        count: 0,
        remaining: limit,
        resetAt: Date.now() + 60 * 60 * 1000,
      };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, limit - entry.count),
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries
   */
  static cleanup() {
    const now = Date.now();

    for (const key in rateLimitStore) {
      if (rateLimitStore[key].resetAt < now) {
        delete rateLimitStore[key];
      }
    }
  }
}

// Cleanup expired entries every 10 minutes
if (typeof global !== 'undefined') {
  setInterval(
    () => {
      RateLimitService.cleanup();
    },
    10 * 60 * 1000
  );
}
