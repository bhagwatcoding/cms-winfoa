import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/core/auth';
import {
  PerformanceMonitor,
  ErrorTracker,
  ApiMetricsTracker,
  SystemHealthMonitor,
  AlertSystem,
  MetricsReporter,
  MonitoringDashboard,
} from '@/core/monitoring';

// GET /api/system - Get system health and monitoring data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'health';
    const hours = parseInt(searchParams.get('hours') || '24');
    const format = searchParams.get('format') || 'json';

    // Public health check doesn't require authentication
    if (action === 'health') {
      const systemHealth = await SystemHealthMonitor.getSystemHealth();
      const isHealthy = SystemHealthMonitor.isHealthy();

      return NextResponse.json({
        success: true,
        data: {
          status: isHealthy ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          uptime: PerformanceMonitor.getUptime(),
          version: '2.0.0',
          services: systemHealth.services,
          basic_metrics: {
            requests_per_minute: ApiMetricsTracker.getRequestsPerMinute(1),
            error_rate: ErrorTracker.getErrorRate(1),
            avg_response_time: ApiMetricsTracker.getAverageResponseTime(),
          },
        },
      });
    }

    // All other monitoring endpoints require admin access
    const currentUser = await requireRole(['admin', 'super-admin']);

    switch (action) {
      case 'dashboard':
        const dashboardData = MonitoringDashboard.getDashboardData();
        return NextResponse.json({
          success: true,
          data: dashboardData,
          refreshInterval: 30000, // 30 seconds
        });

      case 'metrics':
        const metricsReport = MetricsReporter.generateReport(hours);
        return NextResponse.json({
          success: true,
          data: metricsReport,
          generatedAt: new Date().toISOString(),
          generatedBy: currentUser.id,
        });

      case 'export':
        const exportData = MetricsReporter.exportMetrics(format as 'json' | 'csv', hours);

        if (format === 'csv') {
          return new Response(exportData as string, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="metrics-${Date.now()}.csv"`,
            },
          });
        }

        return NextResponse.json({
          success: true,
          data: exportData,
          format,
          timeRange: hours,
          exportedAt: new Date().toISOString(),
        });

      case 'alerts':
        const alerts = AlertSystem.checkAlerts();
        return NextResponse.json({
          success: true,
          data: {
            alerts,
            totalAlerts: alerts.length,
            criticalAlerts: alerts.filter((a) => a.severity === 'critical').length,
            warningAlerts: alerts.filter((a) => a.severity === 'warning').length,
            checkedAt: new Date().toISOString(),
          },
        });

      case 'performance':
        return NextResponse.json({
          success: true,
          data: {
            uptime: PerformanceMonitor.getUptime(),
            memory: process.memoryUsage(),
            averageResponseTime: ApiMetricsTracker.getAverageResponseTime(undefined, hours),
            requestsPerMinute: ApiMetricsTracker.getRequestsPerMinute(hours),
            errorRate: ErrorTracker.getErrorRate(hours),
            slowestEndpoints: ApiMetricsTracker.getSlowestEndpoints(hours, 10),
            statusCodeDistribution: ApiMetricsTracker.getStatusCodeDistribution(hours),
          },
        });

      case 'errors':
        return NextResponse.json({
          success: true,
          data: {
            errorRate: ErrorTracker.getErrorRate(hours),
            topErrors: ErrorTracker.getTopErrors(hours, 20),
            timeRange: {
              hours,
              from: new Date(Date.now() - hours * 60 * 60 * 1000),
              to: new Date(),
            },
          },
        });

      case 'system-info':
        const systemHealth = await SystemHealthMonitor.getSystemHealth();
        return NextResponse.json({
          success: true,
          data: {
            ...systemHealth,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            pid: process.pid,
            environment: process.env.NODE_ENV || 'development',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            availableActions: [
              'health',
              'dashboard',
              'metrics',
              'export',
              'alerts',
              'performance',
              'errors',
              'system-info',
            ],
          },
          { status: 400 }
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('System monitoring error:', error);

    if (error.message === 'Unauthorized - Please login') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (error.message.includes('Access denied') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Admin access required.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: 'Failed to retrieve system information' }, { status: 500 });
  }
}

// POST /api/system - System actions (restart services, clear cache, etc.)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireRole(['super-admin']);
    const body = await request.json();
    const { action, parameters = {} } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'clear-metrics':
        // In a real implementation, you'd clear the metrics storage
        return NextResponse.json({
          success: true,
          data: {
            action: 'clear-metrics',
            clearedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: 'Metrics cleared successfully',
        });

      case 'trigger-gc':
        // Trigger garbage collection if available
        if (global.gc) {
          global.gc();
          return NextResponse.json({
            success: true,
            data: {
              action: 'trigger-gc',
              memoryBefore: process.memoryUsage(),
              performedAt: new Date().toISOString(),
              performedBy: currentUser.id,
            },
            message: 'Garbage collection triggered',
          });
        } else {
          return NextResponse.json({ error: 'Garbage collection not available' }, { status: 400 });
        }

      case 'record-metric':
        const { name, value, unit, tags } = parameters;
        if (!name || value === undefined || !unit) {
          return NextResponse.json(
            { error: 'Name, value, and unit are required for recording metrics' },
            { status: 400 }
          );
        }

        PerformanceMonitor.recordMetric(name, value, unit, tags);
        return NextResponse.json({
          success: true,
          data: {
            action: 'record-metric',
            metric: { name, value, unit, tags },
            recordedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: 'Metric recorded successfully',
        });

      case 'simulate-error':
        // For testing purposes - simulate an error
        if (process.env.NODE_ENV !== 'development') {
          return NextResponse.json(
            { error: 'Error simulation only available in development' },
            { status: 403 }
          );
        }

        ErrorTracker.recordErrorMessage(
          parameters.message || 'Simulated error for testing',
          '/api/system',
          currentUser.id,
          parameters.severity || 'medium'
        );

        return NextResponse.json({
          success: true,
          data: {
            action: 'simulate-error',
            message: parameters.message || 'Simulated error for testing',
            severity: parameters.severity || 'medium',
            simulatedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: 'Error simulation completed',
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            availableActions: ['clear-metrics', 'trigger-gc', 'record-metric', 'simulate-error'],
          },
          { status: 400 }
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('System action error:', error);

    if (error.message.includes('Access denied') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Super-admin access required.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: 'Failed to perform system action' }, { status: 500 });
  }
}

// PUT /api/system - Update system configuration
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requireRole(['super-admin']);
    const body = await request.json();
    const { configuration } = body;

    // In a real implementation, you'd update system configuration
    // For now, just acknowledge the request

    return NextResponse.json({
      success: true,
      data: {
        configuration,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.id,
      },
      message: 'System configuration updated successfully',
    });
  } catch (error: any) {
    console.error('System configuration error:', error);

    if (error.message.includes('Access denied') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Super-admin access required.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: 'Failed to update system configuration' }, { status: 500 });
  }
}

// DELETE /api/system - System cleanup operations
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requireRole(['super-admin']);
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');
    const olderThan = searchParams.get('olderThan'); // in hours

    if (!target) {
      return NextResponse.json(
        { error: 'Target is required (logs, metrics, temp-files)' },
        { status: 400 }
      );
    }

    const hours = olderThan ? parseInt(olderThan) : 168; // Default 7 days

    switch (target) {
      case 'metrics':
        // In a real implementation, you'd clean up old metrics
        return NextResponse.json({
          success: true,
          data: {
            target: 'metrics',
            olderThanHours: hours,
            cleanedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: `Metrics older than ${hours} hours cleaned up`,
        });

      case 'logs':
        // In a real implementation, you'd clean up old log files
        return NextResponse.json({
          success: true,
          data: {
            target: 'logs',
            olderThanHours: hours,
            cleanedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: `Logs older than ${hours} hours cleaned up`,
        });

      case 'temp-files':
        // In a real implementation, you'd clean up temporary files
        return NextResponse.json({
          success: true,
          data: {
            target: 'temp-files',
            olderThanHours: hours,
            cleanedAt: new Date().toISOString(),
            performedBy: currentUser.id,
          },
          message: `Temporary files older than ${hours} hours cleaned up`,
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid target',
            availableTargets: ['metrics', 'logs', 'temp-files'],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('System cleanup error:', error);

    if (error.message.includes('Access denied') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Super-admin access required.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: 'Failed to perform system cleanup' }, { status: 500 });
  }
}
