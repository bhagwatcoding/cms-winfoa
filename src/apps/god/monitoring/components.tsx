/**
 * Monitoring Dashboard UI Components
 * Professional UI components for the monitoring dashboard
 * 
 * @module MonitoringComponents
 * @description Reusable UI components for enterprise monitoring
 */

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle, CheckCircle, Clock, Database, HardDrive, MemoryStick, Server } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  message?: string;
  error?: string;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

export function StatusBadge({ status }: { status: string }) {
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

export function MetricCard({ metric }: { metric: Metric }) {
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

export function HealthCheckCard({ name, result }: { name: string; result: HealthCheckResult }) {
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

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

export function ErrorCard({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="container mx-auto p-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetry} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function SystemInfoCard({ 
  environment, 
  version, 
  uptime, 
  overallStatus 
}: { 
  environment: string;
  version: string;
  uptime: number;
  overallStatus: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Environment</p>
            <p className="font-medium">{environment}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Version</p>
            <p className="font-medium">{version}</p>
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
  );
}