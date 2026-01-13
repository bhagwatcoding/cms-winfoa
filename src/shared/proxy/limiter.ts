// lib/proxy/limiter.ts
import { CONFIG } from "./config";

interface LimitResult {
  success: boolean;
  remaining: number;
  resetAfter: number; // seconds
}

class MemoryRateLimiter {
  // Map<IP, { count, expiresAt }>
  private store = new Map<string, { count: number; expires: number }>();

  async check(ip: string): Promise<LimitResult> {
    const now = Date.now();
    const windowMs = CONFIG.RATE_LIMIT.WINDOW_SECONDS * 1000;

    // Lazy Cleanup: Delete if expired
    let record = this.store.get(ip);
    if (record && record.expires < now) {
      this.store.delete(ip);
      record = undefined;
    }

    // Initialize new record
    if (!record) {
      record = { count: 0, expires: now + windowMs };
      this.store.set(ip, record);
    }

    // Increment
    record.count++;

    const success = record.count <= CONFIG.RATE_LIMIT.MAX_REQUESTS;
    const remaining = Math.max(
      0,
      CONFIG.RATE_LIMIT.MAX_REQUESTS - record.count,
    );
    const resetAfter = Math.ceil((record.expires - now) / 1000);

    return { success, remaining, resetAfter };
  }
}

// Export singleton
export const limiter = new MemoryRateLimiter();
