/**
 * Monitoring Dashboard Hooks
 * Custom React hooks for monitoring dashboard functionality
 * 
 * @module MonitoringHooks
 * @description Reusable hooks for monitoring dashboard
 */

import { useEffect, useState, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: Record<string, HealthCheckResult>;
}

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
// HEALTH MONITORING HOOK
// =============================================================================

export function useHealthMonitoring(refreshInterval = 5000) {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthStatus = useCallback(async () => {
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
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
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
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchHealthStatus(), fetchMetrics()]);
    setLoading(false);
  }, [fetchHealthStatus, fetchMetrics]);

  useEffect(() => {
    refresh();

    if (autoRefresh) {
      const interval = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refresh, autoRefresh, refreshInterval]);

  return {
    healthStatus,
    metrics,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refresh,
  };
}

// =============================================================================
// COMPONENT HEALTH HOOK
// =============================================================================

export function useComponentHealth(componentName: string) {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponentHealth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/health/${componentName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch component health');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, [componentName]);

  useEffect(() => {
    fetchComponentHealth();
  }, [fetchComponentHealth]);

  return {
    health,
    loading,
    error,
    refresh: fetchComponentHealth,
  };
}

// =============================================================================
// METRICS HOOK
// =============================================================================

export function useMetrics(timeRange: '1h' | '6h' | '24h' | '7d' = '1h') {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      // This is a placeholder - implement actual metrics fetching
      // based on time range from your monitoring system
      const mockMetrics: Metric[] = [
        { name: 'CPU Usage', value: Math.random() * 100, unit: '%', trend: 'stable' },
        { name: 'Memory Usage', value: Math.random() * 100, unit: '%', trend: 'up' },
        { name: 'Disk Usage', value: Math.random() * 100, unit: '%', trend: 'down' },
        { name: 'Request Rate', value: Math.random() * 1000, unit: 'req/s', trend: 'stable' },
        { name: 'Response Time', value: Math.random() * 500, unit: 'ms', trend: 'up' },
        { name: 'Error Rate', value: Math.random() * 5, unit: '%', trend: 'down' },
      ];
      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}

// =============================================================================
// ALERT HOOK
// =============================================================================

export function useAlerts(severity?: 'critical' | 'warning' | 'info') {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      // This is a placeholder - implement actual alerts fetching
      // from your alerting system
      const mockAlerts = [
        {
          id: '1',
          severity: 'critical',
          message: 'Database connection timeout',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          severity: 'warning',
          message: 'High memory usage detected',
          timestamp: new Date().toISOString(),
        },
      ];
      
      const filteredAlerts = severity 
        ? mockAlerts.filter(alert => alert.severity === severity)
        : mockAlerts;
        
      setAlerts(filteredAlerts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [severity]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    refresh: fetchAlerts,
  };
}

// =============================================================================
// PERFORMANCE HOOK
// =============================================================================

export function usePerformanceMetrics(metricName?: string) {
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    try {
      setLoading(true);
      // This is a placeholder - implement actual performance metrics fetching
      // from your performance monitoring system
      const mockPerformance = [
        {
          metric: 'lcp',
          value: Math.random() * 2500,
          unit: 'ms',
          timestamp: new Date().toISOString(),
        },
        {
          metric: 'fid',
          value: Math.random() * 100,
          unit: 'ms',
          timestamp: new Date().toISOString(),
        },
        {
          metric: 'cls',
          value: Math.random() * 0.1,
          unit: '',
          timestamp: new Date().toISOString(),
        },
      ];
      
      const filteredPerformance = metricName
        ? mockPerformance.filter(p => p.metric === metricName)
        : mockPerformance;
        
      setPerformance(filteredPerformance);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance metrics');
      setPerformance([]);
    } finally {
      setLoading(false);
    }
  }, [metricName]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return {
    performance,
    loading,
    error,
    refresh: fetchPerformance,
  };
}