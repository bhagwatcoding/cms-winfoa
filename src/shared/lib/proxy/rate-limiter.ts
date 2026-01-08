// lib/proxy/rate-limiter.ts
import { CONFIG } from './config';

interface RateLimitEntry {
    count: number;
    resetTime: number;
    blocked?: number;
}

export class RateLimiter {
    private static store = new Map<string, RateLimitEntry>();
    
    static {
        // Cleanup old entries every 5 minutes
        if (typeof setInterval !== 'undefined') {
            setInterval(() => {
                const now = Date.now();
                for (const [key, value] of RateLimiter.store.entries()) {
                    if (value.resetTime < now && (!value.blocked || value.blocked < now)) {
                        RateLimiter.store.delete(key);
                    }
                }
            }, 300000);
        }
    }
    
    static check(identifier: string): { allowed: boolean; remaining: number } {
        const now = Date.now();
        const entry = this.store.get(identifier);
        
        // Check if blocked
        if (entry?.blocked && entry.blocked > now) {
            return { allowed: false, remaining: 0 };
        }
        
        // Reset if window expired
        if (!entry || entry.resetTime < now) {
            this.store.set(identifier, {
                count: 1,
                resetTime: now + CONFIG.RATE_LIMIT.WINDOW_MS
            });
            return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - 1 };
        }
        
        // Increment counter
        entry.count++;
        
        // Block if exceeded
        if (entry.count > CONFIG.RATE_LIMIT.MAX_REQUESTS) {
            entry.blocked = now + CONFIG.RATE_LIMIT.BLOCK_DURATION_MS;
            return { allowed: false, remaining: 0 };
        }
        
        return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - entry.count };
    }
    
    static reset(identifier: string): void {
        this.store.delete(identifier);
    }
    
    static clear(): void {
        this.store.clear();
    }
}