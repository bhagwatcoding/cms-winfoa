/**
 * Comprehensive Monitoring and Performance Tracking System
 * Real-time performance metrics, error tracking, and system health monitoring
 */

import { NextRequest } from "next/server";

// Types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface ErrorMetric {
  error: string;
  stack?: string;
  endpoint: string;
  userId?: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: number;
  memory: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
  database: {
    connected: boolean;
    responseTime: number;
  };
  services: {
    [serviceName: string]: {
      status: "up" | "down" | "degraded";
      responseTime?: number;
      lastCheck: Date;
    };
  };
}

export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
}

// In-memory storage for metrics (in production, use Redis or database)
class MetricsStore {
  private performanceMetrics: PerformanceMetric[] = [];
  private errorMetrics: ErrorMetric[] = [];
  private apiMetrics: ApiMetrics[] = [];
  private maxStoredMetrics = 10000; // Keep last 10k metrics in memory

  addPerformanceMetric(metric: PerformanceMetric) {
    this.performanceMetrics.push(metric);
    this.cleanupOldMetrics();
  }

  addErrorMetric(error: ErrorMetric) {
    this.errorMetrics.push(error);
    this.cleanupOldMetrics();
  }

  addApiMetric(metric: ApiMetrics) {
    this.apiMetrics.push(metric);
    this.cleanupOldMetrics();
  }

  getPerformanceMetrics(hours: number = 24): PerformanceMetric[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.performanceMetrics.filter((m) => m.timestamp >= cutoff);
  }

  getErrorMetrics(hours: number = 24): ErrorMetric[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.errorMetrics.filter((m) => m.timestamp >= cutoff);
  }

  getApiMetrics(hours: number = 24): ApiMetrics[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.apiMetrics.filter((m) => m.timestamp >= cutoff);
  }

  private cleanupOldMetrics() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Keep 7 days

    if (this.performanceMetrics.length > this.maxStoredMetrics) {
      this.performanceMetrics = this.performanceMetrics
        .filter((m) => m.timestamp >= cutoff)
        .slice(-this.maxStoredMetrics);
    }

    if (this.errorMetrics.length > this.maxStoredMetrics) {
      this.errorMetrics = this.errorMetrics
        .filter((m) => m.timestamp >= cutoff)
        .slice(-this.maxStoredMetrics);
    }

    if (this.apiMetrics.length > this.maxStoredMetrics) {
      this.apiMetrics = this.apiMetrics
        .filter((m) => m.timestamp >= cutoff)
        .slice(-this.maxStoredMetrics);
    }
  }

  getStats() {
    return {
      performanceMetrics: this.performanceMetrics.length,
      errorMetrics: this.errorMetrics.length,
      apiMetrics: this.apiMetrics.length,
      totalMetrics:
        this.performanceMetrics.length +
        this.errorMetrics.length +
        this.apiMetrics.length,
    };
  }
}

// Global metrics store
const metricsStore = new MetricsStore();

// Performance monitoring
export class PerformanceMonitor {
  private static startTime = Date.now();

  static recordMetric(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>,
  ) {
    metricsStore.addPerformanceMetric({
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    });
  }

  static recordExecutionTime(
    name: string,
    startTime: number,
    tags?: Record<string, string>,
  ) {
    const executionTime = Date.now() - startTime;
    this.recordMetric(name, executionTime, "ms", tags);
    return executionTime;
  }

  static async measureAsync<T>(
    name: string,
    asyncOperation: Promise<T>,
    tags?: Record<string, string>,
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await asyncOperation;
      this.recordExecutionTime(`${name}.success`, startTime, tags);
      return result;
    } catch (error) {
      this.recordExecutionTime(`${name}.error`, startTime, tags);
      throw error;
    }
  }

  static measure<T>(
    name: string,
    operation: () => T,
    tags?: Record<string, string>,
  ): T {
    const startTime = Date.now();
    try {
      const result = operation();
      this.recordExecutionTime(`${name}.success`, startTime, tags);
      return result;
    } catch (error) {
      this.recordExecutionTime(`${name}.error`, startTime, tags);
      throw error;
    }
  }

  static getUptime(): number {
    return Date.now() - this.startTime;
  }
}

// Error tracking
export class ErrorTracker {
  static recordError(
    error: Error,
    endpoint: string,
    userId?: string,
    severity: ErrorMetric["severity"] = "medium",
  ) {
    metricsStore.addErrorMetric({
      error: error.message,
      stack: error.stack,
      endpoint,
      userId,
      timestamp: new Date(),
      severity,
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 [${severity.toUpperCase()}] ${endpoint}:`, error);
    }
  }

  static recordErrorMessage(
    message: string,
    endpoint: string,
    userId?: string,
    severity: ErrorMetric["severity"] = "medium",
  ) {
    metricsStore.addErrorMetric({
      error: message,
      endpoint,
      userId,
      timestamp: new Date(),
      severity,
    });
  }

  static getErrorRate(hours: number = 1): number {
    const errors = metricsStore.getErrorMetrics(hours);
    const apis = metricsStore.getApiMetrics(hours);

    if (apis.length === 0) return 0;
    return (errors.length / apis.length) * 100;
  }

  static getTopErrors(
    hours: number = 24,
    limit: number = 10,
  ): Array<{ error: string; count: number; lastSeen: Date }> {
    const errors = metricsStore.getErrorMetrics(hours);
    const errorCounts = new Map<string, { count: number; lastSeen: Date }>();

    errors.forEach((error) => {
      const key = error.error;
      const existing = errorCounts.get(key);
      if (existing) {
        existing.count++;
        if (error.timestamp > existing.lastSeen) {
          existing.lastSeen = error.timestamp;
        }
      } else {
        errorCounts.set(key, { count: 1, lastSeen: error.timestamp });
      }
    });

    return Array.from(errorCounts.entries())
      .map(([error, data]) => ({ error, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

// API metrics tracking
export class ApiMetricsTracker {
  static recordApiCall(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    request?: NextRequest,
    userId?: string,
  ) {
    metricsStore.addApiMetric({
      endpoint,
      method,
      statusCode,
      responseTime,
      userId,
      userAgent: request?.headers.get("user-agent") || undefined,
      ipAddress:
        request?.headers.get("x-forwarded-for") ||
        request?.headers.get("x-real-ip") ||
        undefined,
      timestamp: new Date(),
    });
  }

  static getAverageResponseTime(endpoint?: string, hours: number = 1): number {
    let metrics = metricsStore.getApiMetrics(hours);

    if (endpoint) {
      metrics = metrics.filter((m) => m.endpoint === endpoint);
    }

    if (metrics.length === 0) return 0;

    const totalTime = metrics.reduce(
      (sum, metric) => sum + metric.responseTime,
      0,
    );
    return totalTime / metrics.length;
  }

  static getRequestsPerMinute(hours: number = 1): number {
    const metrics = metricsStore.getApiMetrics(hours);
    if (metrics.length === 0) return 0;

    return metrics.length / (hours * 60);
  }

  static getStatusCodeDistribution(hours: number = 24): Record<number, number> {
    const metrics = metricsStore.getApiMetrics(hours);
    const distribution: Record<number, number> = {};

    metrics.forEach((metric) => {
      distribution[metric.statusCode] =
        (distribution[metric.statusCode] || 0) + 1;
    });

    return distribution;
  }

  static getSlowestEndpoints(
    hours: number = 24,
    limit: number = 10,
  ): Array<{
    endpoint: string;
    avgResponseTime: number;
    requestCount: number;
  }> {
    const metrics = metricsStore.getApiMetrics(hours);
    const endpointStats = new Map<
      string,
      { totalTime: number; count: number }
    >();

    metrics.forEach((metric) => {
      const key = `${metric.method} ${metric.endpoint}`;
      const existing = endpointStats.get(key);
      if (existing) {
        existing.totalTime += metric.responseTime;
        existing.count++;
      } else {
        endpointStats.set(key, { totalTime: metric.responseTime, count: 1 });
      }
    });

    return Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        avgResponseTime: stats.totalTime / stats.count,
        requestCount: stats.count,
      }))
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
      .slice(0, limit);
  }
}

// System health monitoring
export class SystemHealthMonitor {
  static async getSystemHealth(): Promise<SystemHealth> {
    const memoryUsage = process.memoryUsage();

    return {
      status: "healthy",
      uptime: PerformanceMonitor.getUptime(),
      memory: {
        used: memoryUsage.heapUsed,
        free: memoryUsage.heapTotal - memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      },
      database: {
        connected: true, // Would check actual DB connection
        responseTime: 0, // Would measure actual DB response time
      },
      services: {
        api: {
          status: "up",
          responseTime: ApiMetricsTracker.getAverageResponseTime(),
          lastCheck: new Date(),
        },
        email: {
          status: "up",
          lastCheck: new Date(),
        },
        fileUpload: {
          status: "up",
          lastCheck: new Date(),
        },
      },
    };
  }

  static isHealthy(): boolean {
    const memoryUsage = process.memoryUsage();
    const memoryPercentage =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    const errorRate = ErrorTracker.getErrorRate(1);

    // System is unhealthy if:
    // - Memory usage > 90%
    // - Error rate > 10% in the last hour
    return memoryPercentage < 90 && errorRate < 10;
  }
}

// Middleware for automatic API monitoring
export function createMonitoringMiddleware() {
  return (
    handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>,
  ) => {
    return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
      const startTime = Date.now();
      const endpoint = new URL(req.url).pathname;

      try {
        const response = await handler(req, ...args);
        const responseTime = Date.now() - startTime;

        ApiMetricsTracker.recordApiCall(
          endpoint,
          req.method,
          response.status,
          responseTime,
          req,
        );

        return response;
      } catch (error) {
        const responseTime = Date.now() - startTime;

        ApiMetricsTracker.recordApiCall(
          endpoint,
          req.method,
          500,
          responseTime,
          req,
        );

        ErrorTracker.recordError(
          error instanceof Error ? error : new Error(String(error)),
          endpoint,
          undefined,
          "high",
        );

        throw error;
      }
    };
  };
}

// Alert system
export class AlertSystem {
  private static alertThresholds = {
    errorRate: 10, // percentage
    avgResponseTime: 5000, // ms
    memoryUsage: 90, // percentage
  };

  static checkAlerts(): Array<{
    type: string;
    message: string;
    severity: "warning" | "critical";
  }> {
    const alerts: Array<{
      type: string;
      message: string;
      severity: "warning" | "critical";
    }> = [];

    // Check error rate
    const errorRate = ErrorTracker.getErrorRate(1);
    if (errorRate > this.alertThresholds.errorRate) {
      alerts.push({
        type: "high_error_rate",
        message: `Error rate is ${errorRate.toFixed(2)}% (threshold: ${this.alertThresholds.errorRate}%)`,
        severity: errorRate > 20 ? "critical" : "warning",
      });
    }

    // Check response time
    const avgResponseTime = ApiMetricsTracker.getAverageResponseTime();
    if (avgResponseTime > this.alertThresholds.avgResponseTime) {
      alerts.push({
        type: "slow_response_time",
        message: `Average response time is ${avgResponseTime.toFixed(0)}ms (threshold: ${this.alertThresholds.avgResponseTime}ms)`,
        severity: avgResponseTime > 10000 ? "critical" : "warning",
      });
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryPercentage =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    if (memoryPercentage > this.alertThresholds.memoryUsage) {
      alerts.push({
        type: "high_memory_usage",
        message: `Memory usage is ${memoryPercentage.toFixed(1)}% (threshold: ${this.alertThresholds.memoryUsage}%)`,
        severity: memoryPercentage > 95 ? "critical" : "warning",
      });
    }

    return alerts;
  }
}

// Metrics aggregation and reporting
export class MetricsReporter {
  static generateReport(hours: number = 24) {
    const performanceMetrics = metricsStore.getPerformanceMetrics(hours);
    const errorMetrics = metricsStore.getErrorMetrics(hours);
    const apiMetrics = metricsStore.getApiMetrics(hours);

    return {
      timeRange: {
        hours,
        from: new Date(Date.now() - hours * 60 * 60 * 1000),
        to: new Date(),
      },
      summary: {
        totalRequests: apiMetrics.length,
        totalErrors: errorMetrics.length,
        errorRate:
          apiMetrics.length > 0
            ? (errorMetrics.length / apiMetrics.length) * 100
            : 0,
        averageResponseTime: ApiMetricsTracker.getAverageResponseTime(
          undefined,
          hours,
        ),
        requestsPerMinute: ApiMetricsTracker.getRequestsPerMinute(hours),
      },
      topErrors: ErrorTracker.getTopErrors(hours),
      slowestEndpoints: ApiMetricsTracker.getSlowestEndpoints(hours),
      statusCodeDistribution:
        ApiMetricsTracker.getStatusCodeDistribution(hours),
      systemHealth: {
        uptime: PerformanceMonitor.getUptime(),
        memoryUsage: process.memoryUsage(),
        isHealthy: SystemHealthMonitor.isHealthy(),
      },
      alerts: AlertSystem.checkAlerts(),
    };
  }

  static exportMetrics(format: "json" | "csv" = "json", hours: number = 24) {
    const report = this.generateReport(hours);

    if (format === "json") {
      return JSON.stringify(report, null, 2);
    }

    // Simple CSV export for API metrics
    if (format === "csv") {
      const apiMetrics = metricsStore.getApiMetrics(hours);
      const csvHeader =
        "timestamp,endpoint,method,statusCode,responseTime,userId\n";
      const csvRows = apiMetrics
        .map(
          (metric) =>
            `${metric.timestamp.toISOString()},${metric.endpoint},${metric.method},${metric.statusCode},${metric.responseTime},${metric.userId || ""}`,
        )
        .join("\n");

      return csvHeader + csvRows;
    }

    return report;
  }
}

// Dashboard data provider
export class MonitoringDashboard {
  static getDashboardData() {
    const last24Hours = MetricsReporter.generateReport(24);
    const lastHour = MetricsReporter.generateReport(1);

    return {
      realtime: {
        requestsPerMinute: ApiMetricsTracker.getRequestsPerMinute(1 / 60), // Last minute
        errorRate: ErrorTracker.getErrorRate(1 / 60),
        averageResponseTime: ApiMetricsTracker.getAverageResponseTime(
          undefined,
          1 / 60,
        ),
        activeAlerts: AlertSystem.checkAlerts(),
      },
      hourly: lastHour.summary,
      daily: last24Hours.summary,
      trends: {
        errors: ErrorTracker.getTopErrors(24, 5),
        slowEndpoints: ApiMetricsTracker.getSlowestEndpoints(24, 5),
        statusCodes: ApiMetricsTracker.getStatusCodeDistribution(24),
      },
      system: {
        uptime: PerformanceMonitor.getUptime(),
        memory: process.memoryUsage(),
        health: SystemHealthMonitor.isHealthy(),
      },
    };
  }
}

// Export all monitoring components
export default {
  PerformanceMonitor,
  ErrorTracker,
  ApiMetricsTracker,
  SystemHealthMonitor,
  AlertSystem,
  MetricsReporter,
  MonitoringDashboard,
  createMonitoringMiddleware,
};
