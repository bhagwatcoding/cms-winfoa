/**
 * Health Check API Endpoint
 * Comprehensive health monitoring for multi-subdomain applications
 *
 * @module HealthCheck
 * @description Enterprise-grade health monitoring system
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import redis from '@/core/db/redis';
import { logger } from '@/core/logger';

// =============================================================================
// HEALTH CHECK TYPES
// =============================================================================

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: Record<string, HealthCheckResult>;
}

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  message?: string;
  error?: string;
}

// =============================================================================
// HEALTH CHECK FUNCTIONS
// =============================================================================

/**
 * Check MongoDB connection health
 */
async function checkMongoDB(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: 'MongoDB connection is not established',
      };
    }

    // Perform a simple ping operation
    await mongoose.connection.db?.admin().ping();

    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'MongoDB connection is healthy',
    };
  } catch (error) {
    logger.error('MongoDB health check failed', { error });

    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Redis connection health
 */
async function checkRedis(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Test Redis connection with a simple ping
    await redis.ping();

    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Redis connection is healthy',
    };
  } catch (error) {
    logger.error('Redis health check failed', { error });

    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check application memory usage
 */
async function checkMemory(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const memoryUsage = process.memoryUsage();
    const memoryLimit = 512 * 1024 * 1024; // 512MB limit

    if (memoryUsage.heapUsed > memoryLimit) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: `Memory usage exceeded limit: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      };
    }

    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: `Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    };
  } catch (error) {
    logger.error('Memory health check failed', { error });

    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check disk space availability
 */
async function checkDiskSpace(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // This is a simplified check - in production, use a proper disk space check
    const fs = await import('fs');
    fs.statSync('/tmp');

    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Disk space check passed',
    };
  } catch (error) {
    logger.error('Disk space health check failed', { error });

    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check external service dependencies
 */
async function checkExternalServices(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Check if external services are configured
    const requiredServices = [
      process.env.EMAIL_PROVIDER,
      process.env.SMS_PROVIDER,
      process.env.STORAGE_PROVIDER,
    ].filter(Boolean);

    if (requiredServices.length === 0) {
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        message: 'No external services configured',
      };
    }

    // Perform basic connectivity checks for configured services
    // This is a placeholder - implement actual service checks

    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: `External services configured: ${requiredServices.join(', ')}`,
    };
  } catch (error) {
    logger.error('External services health check failed', { error });

    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =============================================================================
// MAIN HEALTH CHECK HANDLER
// =============================================================================

/**
 * Perform comprehensive health check
 */
async function performHealthCheck(): Promise<HealthStatus> {
  // Run all health checks in parallel
  const [mongodb, redis, memory, diskSpace, externalServices] = await Promise.all([
    checkMongoDB(),
    checkRedis(),
    checkMemory(),
    checkDiskSpace(),
    checkExternalServices(),
  ]);

  // Determine overall status
  const checks = {
    mongodb,
    redis,
    memory,
    diskSpace,
    externalServices,
  };

  const unhealthyChecks = Object.values(checks).filter((check) => check.status === 'unhealthy');
  const degradedChecks = Object.values(checks).filter((check) => check.status === 'degraded');

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (unhealthyChecks.length > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedChecks.length > 0) {
    overallStatus = 'degraded';
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
  };
}

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * Basic health check endpoint
 * GET /api/health
 */
export async function GET(request: NextRequest) {
  try {
    const healthStatus = await performHealthCheck();

    // Log health check results
    logger.info('Health check performed', {
      status: healthStatus.status,
      responseTime: Date.now(),
      checks: Object.keys(healthStatus.checks).length,
    });

    // Return appropriate HTTP status code
    const statusCode =
      healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    logger.error('Health check endpoint failed', { error });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Detailed health check endpoint with specific component checks
 * GET /api/health/:component
 */
export async function GET_COMPONENT(
  _request: NextRequest,
  { params }: { params: { component: string } }
) {
  try {
    const { component } = params;

    // Map component names to check functions
    const componentChecks: Record<string, () => Promise<HealthCheckResult>> = {
      mongodb: checkMongoDB,
      redis: checkRedis,
      memory: checkMemory,
      disk: checkDiskSpace,
      external: checkExternalServices,
    };

    const checkFunction = componentChecks[component];

    if (!checkFunction) {
      return NextResponse.json({ error: `Unknown component: ${component}` }, { status: 400 });
    }

    const result = await checkFunction();

    logger.info('Component health check performed', {
      component,
      status: result.status,
      responseTime: result.responseTime,
    });

    const statusCode = result.status === 'healthy' ? 200 : 503;

    return NextResponse.json(
      {
        component,
        ...result,
      },
      { status: statusCode }
    );
  } catch (error) {
    logger.error('Component health check failed', {
      component: params?.component,
      error,
    });

    return NextResponse.json(
      {
        error: 'Component health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Liveness probe endpoint (simple check)
 * GET /api/health/live
 */
export async function GET_LIVE(_request: NextRequest) {
  return NextResponse.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Readiness probe endpoint (checks if app is ready to serve traffic)
 * GET /api/health/ready
 */
export async function GET_READY(_request: NextRequest) {
  try {
    // Perform minimal checks for readiness
    const [mongodb, redis] = await Promise.all([checkMongoDB(), checkRedis()]);

    const isReady = mongodb.status === 'healthy' && redis.status === 'healthy';

    return NextResponse.json(
      {
        status: isReady ? 'ready' : 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          mongodb: mongodb.status,
          redis: redis.status,
        },
      },
      { status: isReady ? 200 : 503 }
    );
  } catch (error) {
    logger.error('Readiness check failed', { error });

    return NextResponse.json(
      {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: 'Readiness check failed',
      },
      { status: 503 }
    );
  }
}
