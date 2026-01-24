/**
 * Monitoring Dashboard Component
 * Real-time monitoring dashboard for multi-subdomain applications
 * 
 * @module MonitoringDashboard
 * @description Enterprise monitoring dashboard with real-time metrics
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle, CheckCircle, Clock, Database, HardDrive, MemoryStick, Server } from 'lucide-react';

// =============================================================================
// TYPES
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
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  message?: string;
  error?: string;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// =============================================================================
// HOOKS
// =============================================================================

function useHealthMonitoring() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Fetch additional metrics from your monitoring system
      // This is a placeholder - implement actual metrics fetching
      const mockMetrics: Metric[] = [
        { name: 'CPU Usage', value: Math.random() * 100, unit: '%', trend: 'stable' },
        { name: 'Memory Usage', value: Math.random() * 100, unit: '%', trend: 'up' },
        { name: 'Disk Usage', value: Math.random() * 100, unit: '%', trend: 'down' },
        { name: 'Request Rate', value: Math.random() * 1000, unit: 'req/s', trend: 'stable' },
        { name: 'Response Time', value: Math.random() * 500, unit: 'ms', trend: 'up' },
        { name: 'Error Rate', value: Math.random() * 5, unit: '%', trend: 'down' },
      ];
      setMetrics(mockMetrics);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchHealthStatus();
        fetchMetrics();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    healthStatus,
    metrics,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    refresh: fetchHealthStatus,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: string }) {
  const variants = {
    healthy: 'default',
    degraded: 'secondary',
    unhealthy: 'destructive',
  };

  const icons = {
    healthy: <CheckCircle className="h-4 w-4" />,
    degraded: <AlertCircle className="h-4 w-4" />,
    unhealthy: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <Badge variant={variants[status as keyof typeof variants] as any}>
      {icons[status as keyof typeof icons]}
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→',
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-500',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
        <span className={`text-lg ${trendColors[metric.trend]}`}>
          {trendIcons[metric.trend]}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.value.toFixed(2)} {metric.unit}
        </div>
      </CardContent>
    </Card>
  );
}

function HealthCheckCard({ name, result }: { name: string; result: HealthCheckResult }) {
  const icons = {
    mongodb: <Database className="h-4 w-4" />,
    redis: <Server className="h-4 w-4" />,
    memory: <MemoryStick className="h-4 w-4" />,
    diskSpace: <HardDrive className="h-4 w-4" />,
    externalServices: <Server className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icons[name as keyof typeof icons] || <Server className="h-4 w-4" />}
          {name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </CardTitle>
        <StatusBadge status={result.status} />
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Response Time: {result.responseTime}ms
        </div>
        {result.message && (
          <div className="text-xs text-muted-foreground mt-1">
            {result.message}
          </div>
        )}
        {result.error && (
          <div className="text-xs text-red-500 mt-1">
            {result.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MonitoringDashboard() {
  const {
    healthStatus,
    metrics,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    refresh,
  } = useHealthMonitoring();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refresh} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!healthStatus) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Health Data Available</CardTitle>
            <CardDescription>Unable to retrieve health status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refresh} variant="outline">
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallStatus = healthStatus.status;
  const uptime = Math.floor(healthStatus.uptime / 60); // Convert to minutes

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time health status and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Auto Refresh:</label>
            <Button
              size="sm"
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={overallStatus === 'unhealthy' ? 'border-red-200' : overallStatus === 'degraded' ? 'border-yellow-200' : 'border-green-200'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Overall System Status
            <StatusBadge status={overallStatus} />
          </CardTitle>
          <CardDescription>
            Environment: {healthStatus.environment} | Version: {healthStatus.version} | Uptime: {uptime}m
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(healthStatus.timestamp).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.name} metric={metric} />
          ))}
        </div>
      </div>

      {/* Health Checks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Health Checks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(healthStatus.checks).map(([name, result]) => (
            <HealthCheckCard key={name} name={name} result={result} />
          ))}
        </div>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Environment</p>
              <p className="font-medium">{healthStatus.environment}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">{healthStatus.version}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-medium">{uptime} minutes</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{overallStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}