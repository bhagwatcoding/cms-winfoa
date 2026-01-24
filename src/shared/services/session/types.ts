/**
 * Session Service Types
 * TypeScript interfaces and types for session services
 */

import { RiskLevel, SessionStatus, LoginMethod } from "@/types";

// ===== SESSION ANALYTICS TYPES =====

export interface SessionStats {
  total: number;
  active: number;
  expired: number;
  byDevice: Record<string, number>;
  byRiskLevel: Record<string, number>;
  byStatus: Record<string, number>;
  recentActivity: SessionActivity[];
}

export interface SessionActivity {
  id: string;
  device: string;
  location: string;
  loginAt: Date;
  lastAccessedAt: Date;
  status: SessionStatus;
  riskLevel: RiskLevel;
  isActive: boolean;
}

export interface DeviceAnalytics {
  totalDevices: number;
  uniqueDevices: string[];
  deviceTypes: Record<string, number>;
  osDistribution: Record<string, number>;
  browserDistribution: Record<string, number>;
  trustedDevices: number;
  suspiciousDevices: number;
}

export interface LocationAnalytics {
  totalLocations: number;
  uniqueCountries: string[];
  uniqueCities: string[];
  countryDistribution: Record<string, number>;
  cityDistribution: Record<string, number>;
  suspiciousLocations: number;
  timezoneDistribution: Record<string, number>;
}

export interface SecurityAnalytics {
  riskLevelDistribution: Record<string, number>;
  verifiedSessions: number;
  unverifiedSessions: number;
  highRiskSessions: number;
  securityRecommendations: string[];
  loginMethodDistribution: Record<string, number>;
}

export interface SessionDashboard {
  overview: SessionStats;
  devices: DeviceAnalytics;
  locations: LocationAnalytics;
  security: SecurityAnalytics;
  lastUpdated: Date;
}

// ===== SESSION SECURITY TYPES =====

export interface SecurityAnalysis {
  isTrusted: boolean;
  riskScore: number;
  recommendations: string[];
}

export interface DeviceAnalysis extends SecurityAnalysis {
  deviceType: string;
  deviceName: string;
  os: string;
  browser: string;
}

export interface LocationAnalysis extends SecurityAnalysis {
  country: string;
  city: string;
  timezone: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface SessionSecurityContext {
  isTrustedDevice: boolean;
  isTrustedLocation: boolean;
  deviceAnalysis: DeviceAnalysis;
  locationAnalysis: LocationAnalysis;
  securityRecommendations: string[];
}

// ===== SESSION CORE TYPES =====

export interface SessionCreateOptions {
  userId: string;
  token: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    rememberMe?: boolean;
    deviceInfo?: any;
    geoInfo?: any;
    securityInfo?: any;
  };
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: any;
  error?: string;
}

// ===== SESSION MANAGEMENT TYPES =====

export interface SessionRevokeResult {
  success: boolean;
  revokedCount: number;
  message?: string;
}

export interface SessionCleanupResult {
  deletedCount: number;
  expiredCount: number;
  revokedCount: number;
  totalCleaned: number;
}

export interface SessionTokenInfo {
  token: string;
  expiresAt: Date;
  isValid: boolean;
}