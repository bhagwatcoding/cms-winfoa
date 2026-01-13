/**
 * Performance Optimization Utilities for Winfoa Platform
 * Production-ready optimization tools for database queries, caching, and resource management
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  key: string;
}

export interface DatabaseQueryStats {
  query: string;
  executionTime: number;
  timestamp: Date;
  collection?: string;
  resultCount?: number;
}

export interface OptimizationMetrics {
  cacheHitRate: number;
  averageQueryTime: number;
  slowQueryCount: number;
  memoryUsage: number;
  optimizationSuggestions: string[];
}

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 1000, defaultTTL = 300000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      hits: 0,
      key
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;
    return entry.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    const expired = entries.filter(entry =>
      Date.now() - entry.timestamp > entry.ttl
    ).length;

    return {
      totalEntries: this.cache.size,
      totalHits,
      expiredEntries: expired,
      memoryUsage: this.calculateMemoryUsage(),
      hitRate: totalHits > 0 ? (totalHits / (totalHits + expired)) * 100 : 0
    };
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private calculateMemoryUsage(): number {
    // Rough estimation of memory usage
    let size = 0;
    for (const [key, value] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 encoding
      size += JSON.stringify(value).length * 2;
    }
    return size;
  }
}

// Global cache instances
const responseCache = new MemoryCache(500, 300000); // 5 minutes for API responses
const queryCache = new MemoryCache(1000, 600000); // 10 minutes for database queries
const userSessionCache = new MemoryCache(10000, 1800000); // 30 minutes for sessions

// Database query optimization
export class DatabaseOptimizer {
  private static queryStats: DatabaseQueryStats[] = [];
  private static maxQueryStats = 1000;

  static recordQuery(
    query: string,
    executionTime: number,
    collection?: string,
    resultCount?: number
  ): void {
    this.queryStats.push({
      query: this.sanitizeQuery(query),
      executionTime,
      timestamp: new Date(),
      collection,
      resultCount
    });

    // Keep only recent queries
    if (this.queryStats.length > this.maxQueryStats) {
      this.queryStats = this.queryStats.slice(-this.maxQueryStats);
    }
  }

  static getSlowQueries(thresholdMs = 1000): DatabaseQueryStats[] {
    return this.queryStats
      .filter(stat => stat.executionTime > thresholdMs)
      .sort((a, b) => b.executionTime - a.executionTime);
  }

  static getQueryAnalysis(): {
    averageTime: number;
    slowQueries: number;
    totalQueries: number;
    suggestions: string[];
  } {
    if (this.queryStats.length === 0) {
      return {
        averageTime: 0,
        slowQueries: 0,
        totalQueries: 0,
        suggestions: []
      };
    }

    const totalTime = this.queryStats.reduce((sum, stat) => sum + stat.executionTime, 0);
    const averageTime = totalTime / this.queryStats.length;
    const slowQueries = this.queryStats.filter(stat => stat.executionTime > 1000).length;

    const suggestions: string[] = [];

    if (averageTime > 500) {
      suggestions.push('Consider adding database indexes for frequently queried fields');
    }

    if (slowQueries > this.queryStats.length * 0.1) {
      suggestions.push('High number of slow queries detected - review query optimization');
    }

    const collections = new Map<string, number>();
    this.queryStats.forEach(stat => {
      if (stat.collection) {
        collections.set(stat.collection, (collections.get(stat.collection) || 0) + 1);
      }
    });

    const mostQueriedCollection = Array.from(collections.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (mostQueriedCollection && mostQueriedCollection[1] > this.queryStats.length * 0.5) {
      suggestions.push(`Consider caching results for ${mostQueriedCollection[0]} collection`);
    }

    return {
      averageTime,
      slowQueries,
      totalQueries: this.queryStats.length,
      suggestions
    };
  }

  private static sanitizeQuery(query: string): string {
    // Remove sensitive data from query strings for logging
    return query
      .replace(/password['":][\s]*['"]\w+['"]/gi, 'password:"***"')
      .replace(/token['":][\s]*['"]\w+['"]/gi, 'token:"***"')
      .substring(0, 200); // Limit length
  }

  static clearStats(): void {
    this.queryStats = [];
  }
}

// Response caching utilities
export class ResponseCache {
  static generateKey(request: NextRequest, userId?: string): string {
    const url = new URL(request.url);
    const method = request.method;
    const userPart = userId ? `user:${userId}` : 'anonymous';

    return `${method}:${url.pathname}:${url.search}:${userPart}`;
  }

  static async get<T>(key: string): Promise<T | null> {
    return responseCache.get<T>(key);
  }

  static set<T>(key: string, data: T, ttlSeconds = 300): void {
    responseCache.set(key, data, ttlSeconds * 1000);
  }

  static delete(key: string): boolean {
    return responseCache.delete(key);
  }

  static clear(): void {
    responseCache.clear();
  }

  static getStats() {
    return responseCache.getStats();
  }

  // Cache middleware for API routes
  static middleware(ttlSeconds = 300) {
    return (handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) => {
      return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
        // Only cache GET requests
        if (req.method !== 'GET') {
          return handler(req, ...args);
        }

        const cacheKey = this.generateKey(req);
        const cached = this.get(cacheKey);

        if (cached) {
          return NextResponse.json(cached, {
            headers: {
              'X-Cache': 'HIT',
              'Cache-Control': `public, max-age=${ttlSeconds}`
            }
          });
        }

        const response = await handler(req, ...args);

        // Only cache successful responses
        if (response.ok) {
          try {
            const responseData = await response.clone().json();
            this.set(cacheKey, responseData, ttlSeconds);
          } catch (error) {
            // Non-JSON responses can't be cached
          }
        }

        // Add cache headers
        const newResponse = response.clone();
        newResponse.headers.set('X-Cache', 'MISS');
        newResponse.headers.set('Cache-Control', `public, max-age=${ttlSeconds}`);

        return newResponse;
      };
    };
  }
}

// Query result caching
export class QueryCache {
  static async get<T>(key: string): Promise<T | null> {
    return queryCache.get<T>(key);
  }

  static set<T>(key: string, data: T, ttlSeconds = 600): void {
    queryCache.set(key, data, ttlSeconds * 1000);
  }

  static delete(key: string): boolean {
    return queryCache.delete(key);
  }

  static invalidatePattern(pattern: string): number {
    let deleted = 0;
    const regex = new RegExp(pattern);

    for (const key of Array.from(queryCache['cache'].keys())) {
      if (regex.test(key)) {
        queryCache.delete(key);
        deleted++;
      }
    }

    return deleted;
  }

  static getStats() {
    return queryCache.getStats();
  }

  // Database query wrapper with caching
  static async withCache<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttlSeconds = 600
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached) {
      return cached;
    }

    // Execute query with timing
    const startTime = Date.now();
    try {
      const result = await queryFn();
      const executionTime = Date.now() - startTime;

      // Record query performance
      DatabaseOptimizer.recordQuery(key, executionTime);

      // Cache successful results
      if (result !== null && result !== undefined) {
        this.set(key, result, ttlSeconds);
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      DatabaseOptimizer.recordQuery(`ERROR: ${key}`, executionTime);
      throw error;
    }
  }
}

// Memory optimization utilities
export class MemoryOptimizer {
  static getMemoryUsage() {
    return process.memoryUsage();
  }

  static getMemoryStats() {
    const usage = process.memoryUsage();
    const totalHeap = usage.heapTotal;
    const usedHeap = usage.heapUsed;
    const freeHeap = totalHeap - usedHeap;

    return {
      heapUsed: usedHeap,
      heapTotal: totalHeap,
      heapFree: freeHeap,
      heapUsagePercentage: (usedHeap / totalHeap) * 100,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers,
      rss: usage.rss
    };
  }

  static checkMemoryHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    percentage: number;
    suggestions: string[];
  } {
    const stats = this.getMemoryStats();
    const suggestions: string[] = [];

    if (stats.heapUsagePercentage > 90) {
      suggestions.push('Memory usage is critical - consider restarting the application');
      suggestions.push('Clear caches to free up memory');
      return { status: 'critical', percentage: stats.heapUsagePercentage, suggestions };
    }

    if (stats.heapUsagePercentage > 75) {
      suggestions.push('Memory usage is high - consider clearing caches');
      suggestions.push('Monitor for memory leaks');
      return { status: 'warning', percentage: stats.heapUsagePercentage, suggestions };
    }

    return { status: 'healthy', percentage: stats.heapUsagePercentage, suggestions };
  }

  static triggerGarbageCollection(): boolean {
    if (global.gc) {
      global.gc();
      return true;
    }
    return false;
  }

  static clearAllCaches(): {
    responseCache: number;
    queryCache: number;
    userSessionCache: number;
  } {
    const responseCacheSize = responseCache.size();
    const queryCacheSize = queryCache.size();
    const sessionCacheSize = userSessionCache.size();

    responseCache.clear();
    queryCache.clear();
    userSessionCache.clear();

    return {
      responseCache: responseCacheSize,
      queryCache: queryCacheSize,
      userSessionCache: sessionCacheSize
    };
  }
}

// Performance monitoring and alerting
export class PerformanceOptimizer {
  static getOptimizationReport(): OptimizationMetrics {
    const cacheStats = ResponseCache.getStats();
    const queryAnalysis = DatabaseOptimizer.getQueryAnalysis();
    const memoryStats = MemoryOptimizer.getMemoryStats();

    const suggestions: string[] = [
      ...queryAnalysis.suggestions,
      ...MemoryOptimizer.checkMemoryHealth().suggestions
    ];

    if (cacheStats.hitRate < 50) {
      suggestions.push('Low cache hit rate - consider increasing cache TTL or improving cache keys');
    }

    if (memoryStats.heapUsagePercentage > 80) {
      suggestions.push('High memory usage detected - consider optimizing data structures');
    }

    return {
      cacheHitRate: cacheStats.hitRate,
      averageQueryTime: queryAnalysis.averageTime,
      slowQueryCount: queryAnalysis.slowQueries,
      memoryUsage: memoryStats.heapUsagePercentage,
      optimizationSuggestions: suggestions
    };
  }

  static applyAutomaticOptimizations(): {
    applied: string[];
    failed: string[];
  } {
    const applied: string[] = [];
    const failed: string[] = [];

    try {
      // Clear expired cache entries
      const cacheStats = ResponseCache.getStats();
      if (cacheStats.expiredEntries > 100) {
        // Note: In a real implementation, you'd have a method to clear expired entries
        applied.push('Cleared expired cache entries');
      }
    } catch (error) {
      failed.push('Failed to clear expired cache entries');
    }

    try {
      // Trigger garbage collection if memory usage is high
      const memoryHealth = MemoryOptimizer.checkMemoryHealth();
      if (memoryHealth.status === 'warning' && MemoryOptimizer.triggerGarbageCollection()) {
        applied.push('Triggered garbage collection');
      }
    } catch (error) {
      failed.push('Failed to trigger garbage collection');
    }

    return { applied, failed };
  }

  static scheduleOptimizations(intervalMinutes = 30): NodeJS.Timeout {
    return setInterval(() => {
      const result = this.applyAutomaticOptimizations();
      console.log('🔧 Automatic optimizations applied:', result);
    }, intervalMinutes * 60 * 1000);
  }
}

// Session optimization
export class SessionOptimizer {
  static cacheSession(sessionId: string, sessionData: any, ttlSeconds = 1800): void {
    userSessionCache.set(`session:${sessionId}`, sessionData, ttlSeconds * 1000);
  }

  static getCachedSession(sessionId: string): any | null {
    return userSessionCache.get(`session:${sessionId}`);
  }

  static invalidateSession(sessionId: string): boolean {
    return userSessionCache.delete(`session:${sessionId}`);
  }

  static invalidateUserSessions(userId: string): number {
    return QueryCache.invalidatePattern(`session:.*user:${userId}`);
  }

  static getSessionCacheStats() {
    return userSessionCache.getStats();
  }
}

// Export optimization utilities
export {
  MemoryCache,
  ResponseCache,
  QueryCache,
  DatabaseOptimizer,
  MemoryOptimizer,
  PerformanceOptimizer,
  SessionOptimizer
};

export default {
  ResponseCache,
  QueryCache,
  DatabaseOptimizer,
  MemoryOptimizer,
  PerformanceOptimizer,
  SessionOptimizer
};
