/**
 * Session Analytics Service
 * Analytics and statistics for session management
 * Handles session metrics, device analytics, and usage statistics
 */

import 'server-only';
import { Session } from '@/models';
import { RiskLevel, SessionStatus, DeviceType } from '@/types';
import { connectDB } from '@/lib/db';
import type {
  SessionStats,
  DeviceAnalytics,
  LocationAnalytics,
  SecurityAnalytics,
  SessionCleanupResult,
} from './types';

export class SessionAnalyticsService {
  /**
   * Get comprehensive session statistics for a user
   */
  static async getSessionStats(userId: string): Promise<SessionStats> {
    try {
      await connectDB();

      // Use MongoDB aggregation for comprehensive statistics
      const sessionStats = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ['$isActive', true] }, { $gt: ['$expiresAt', new Date()] }] },
                  1,
                  0,
                ],
              },
            },
            expired: {
              $sum: {
                $cond: [{ $lte: ['$expiresAt', new Date()] }, 1, 0],
              },
            },
          },
        },
      ]);

      const deviceStats = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $ifNull: ['$deviceInfo.type', DeviceType.Unknown] },
            count: { $sum: 1 },
          },
        },
      ]);

      const riskStats = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $ifNull: ['$securityInfo.riskLevel', RiskLevel.Medium] },
            count: { $sum: 1 },
          },
        },
      ]);

      const statusStats = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $ifNull: ['$status', SessionStatus.Active] },
            count: { $sum: 1 },
          },
        },
      ]);

      const statsData = sessionStats[0] || { total: 0, active: 0, expired: 0 };

      const byDevice: Record<string, number> = {};
      deviceStats.forEach((stat) => {
        byDevice[stat._id] = stat.count;
      });

      const byRiskLevel: Record<string, number> = {};
      riskStats.forEach((stat) => {
        byRiskLevel[stat._id] = stat.count;
      });

      const byStatus: Record<string, number> = {};
      statusStats.forEach((stat) => {
        byStatus[stat._id] = stat.count;
      });

      const stats: SessionStats = {
        total: statsData.total,
        active: statsData.active,
        expired: statsData.expired,
        byDevice,
        byRiskLevel,
        byStatus,
        recentActivity: [],
      };

      // Get recent activity (last 10 sessions)
      const recentSessions = await Session.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      stats.recentActivity = recentSessions.map((session) => ({
        id: session._id.toString(),
        device: session.deviceInfo?.name || 'Unknown',
        location: session.geoInfo?.country || session.geoInfo?.city || 'Unknown',
        loginAt: session.createdAt,
        lastAccessedAt: session.lastAccessedAt,
        status: session.status || SessionStatus.Active,
        riskLevel: session.securityInfo?.riskLevel || RiskLevel.Medium,
        isActive: session.isActive,
      }));

      return stats;
    } catch (error) {
      console.error(`[SessionAnalyticsService] Error getting session stats for user ${userId}:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      return {
        total: 0,
        active: 0,
        expired: 0,
        byDevice: {},
        byRiskLevel: {},
        byStatus: {},
        recentActivity: [],
      };
    }
  }

  /**
   * Get device analytics for a user
   */
  static async getDeviceAnalytics(userId: string): Promise<DeviceAnalytics> {
    try {
      await connectDB();

      // Use MongoDB aggregation for better performance
      const deviceData = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              name: '$deviceInfo.name',
              os: '$deviceInfo.os',
              type: '$deviceInfo.type',
            },
            count: { $sum: 1 },
            lastUsed: { $max: '$lastAccessedAt' },
          },
        },
      ]);

      const deviceTypes: Record<string, number> = {};
      const osDistribution: Record<string, number> = {};
      const browserDistribution: Record<string, number> = {};
      let trustedDevices = 0;
      let suspiciousDevices = 0;
      const uniqueDevices: string[] = [];

      deviceData.forEach((device) => {
        const deviceInfo = device._id;
        const deviceKey = `${deviceInfo.name || 'Unknown'}-${deviceInfo.os || 'Unknown'}`;

        if (!uniqueDevices.includes(deviceKey)) {
          uniqueDevices.push(deviceKey);
        }

        // Device types
        const deviceType = deviceInfo.type || DeviceType.Unknown;
        deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + device.count;

        // OS distribution
        const os = deviceInfo.os || 'Unknown';
        osDistribution[os] = (osDistribution[os] || 0) + device.count;

        // Browser distribution (using name as browser)
        const browser = deviceInfo.name || 'Unknown';
        browserDistribution[browser] = (browserDistribution[browser] || 0) + device.count;

        // Trusted vs suspicious
        if (deviceInfo.type !== DeviceType.Unknown) {
          trustedDevices += device.count;
        } else {
          suspiciousDevices += device.count;
        }
      });

      return {
        totalDevices: uniqueDevices.length,
        uniqueDevices,
        deviceTypes,
        osDistribution,
        browserDistribution,
        trustedDevices,
        suspiciousDevices,
      };
    } catch (error) {
      console.error(
        `[SessionAnalyticsService] Error getting device analytics for user ${userId}:`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        totalDevices: 0,
        uniqueDevices: [],
        deviceTypes: {},
        osDistribution: {},
        browserDistribution: {},
        trustedDevices: 0,
        suspiciousDevices: 0,
      };
    }
  }

  /**
   * Get location analytics for a user
   */
  static async getLocationAnalytics(userId: string): Promise<LocationAnalytics> {
    try {
      await connectDB();

      // Use MongoDB aggregation for location analytics
      const locationData = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              country: '$geoInfo.country',
              city: '$geoInfo.city',
              timezone: '$geoInfo.timezone',
              ip: '$geoInfo.ip',
            },
            count: { $sum: 1 },
            lastAccessed: { $max: '$lastAccessedAt' },
          },
        },
      ]);

      const countryDistribution: Record<string, number> = {};
      const cityDistribution: Record<string, number> = {};
      const timezoneDistribution: Record<string, number> = {};
      let suspiciousLocations = 0;
      const uniqueCountries = new Set<string>();
      const uniqueCities = new Set<string>();

      locationData.forEach((location) => {
        const geoInfo = location._id;

        // Country distribution
        const country = geoInfo.country || 'Unknown';
        countryDistribution[country] = (countryDistribution[country] || 0) + location.count;
        if (country !== 'Unknown') uniqueCountries.add(country);

        // City distribution
        const city = geoInfo.city || 'Unknown';
        cityDistribution[city] = (cityDistribution[city] || 0) + location.count;
        if (city !== 'Unknown') uniqueCities.add(city);

        // Timezone distribution
        const timezone = geoInfo.timezone || 'Unknown';
        timezoneDistribution[timezone] = (timezoneDistribution[timezone] || 0) + location.count;

        // Suspicious location check
        if (!geoInfo.country || !geoInfo.ip) {
          suspiciousLocations += location.count;
        }
      });

      return {
        totalLocations: locationData.length,
        uniqueCountries: Array.from(uniqueCountries),
        uniqueCities: Array.from(uniqueCities),
        countryDistribution,
        cityDistribution,
        suspiciousLocations,
        timezoneDistribution,
      };
    } catch (error) {
      console.error(
        `[SessionAnalyticsService] Error getting location analytics for user ${userId}:`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        totalLocations: 0,
        uniqueCountries: [],
        uniqueCities: [],
        countryDistribution: {},
        cityDistribution: {},
        suspiciousLocations: 0,
        timezoneDistribution: {},
      };
    }
  }

  /**
   * Get security analytics for a user
   */
  static async getSecurityAnalytics(userId: string): Promise<SecurityAnalytics> {
    try {
      await connectDB();

      // Use MongoDB aggregation for security analytics
      const securityData = await Session.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              riskLevel: '$securityInfo.riskLevel',
              isVerified: '$securityInfo.isVerified',
              loginMethod: '$securityInfo.loginMethod',
            },
            count: { $sum: 1 },
          },
        },
      ]);

      const riskLevelDistribution: Record<string, number> = {};
      let verifiedSessions = 0;
      let unverifiedSessions = 0;
      let highRiskSessions = 0;
      const loginMethodDistribution: Record<string, number> = {};
      const securityRecommendations: string[] = [];

      securityData.forEach((item) => {
        const securityInfo = item._id;

        // Risk level distribution
        const riskLevel = securityInfo.riskLevel || RiskLevel.Medium;
        riskLevelDistribution[riskLevel] = (riskLevelDistribution[riskLevel] || 0) + item.count;

        // Verified vs unverified
        if (securityInfo.isVerified) {
          verifiedSessions += item.count;
        } else {
          unverifiedSessions += item.count;
        }

        // High risk sessions
        if (riskLevel === RiskLevel.High || riskLevel === RiskLevel.Critical) {
          highRiskSessions += item.count;
        }

        // Login method distribution
        const loginMethod = securityInfo.loginMethod || 'unknown';
        loginMethodDistribution[loginMethod] =
          (loginMethodDistribution[loginMethod] || 0) + item.count;
      });

      // Generate security recommendations
      if (highRiskSessions > 0) {
        securityRecommendations.push('Review high-risk sessions');
        securityRecommendations.push('Consider enabling two-factor authentication');
      }

      if (unverifiedSessions > verifiedSessions) {
        securityRecommendations.push('Many unverified sessions detected');
        securityRecommendations.push('Review recent login activity');
      }

      if (Object.keys(riskLevelDistribution).length === 0) {
        securityRecommendations.push('No session data available for analysis');
      }

      return {
        riskLevelDistribution,
        verifiedSessions,
        unverifiedSessions,
        highRiskSessions,
        securityRecommendations,
        loginMethodDistribution,
      };
    } catch (error) {
      console.error(
        `[SessionAnalyticsService] Error getting security analytics for user ${userId}:`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        }
      );

      return {
        riskLevelDistribution: {},
        verifiedSessions: 0,
        unverifiedSessions: 0,
        highRiskSessions: 0,
        securityRecommendations: ['Unable to analyze session security'],
        loginMethodDistribution: {},
      };
    }
  }

  /**
   * Cleanup expired sessions and get cleanup statistics
   */
  static async cleanupExpiredSessions(): Promise<SessionCleanupResult> {
    try {
      await connectDB();

      const now = new Date();

      // Find expired sessions
      const expiredSessions = await Session.find({
        expiresAt: { $lt: now },
      });

      // Find revoked sessions
      const revokedSessions = await Session.find({
        isActive: false,
        status: SessionStatus.Revoked,
      });

      // Delete all expired and revoked sessions
      const result = await Session.deleteMany({
        $or: [{ expiresAt: { $lt: now } }, { isActive: false, status: SessionStatus.Revoked }],
      });

      return {
        deletedCount: result.deletedCount || 0,
        expiredCount: expiredSessions.length,
        revokedCount: revokedSessions.length,
        totalCleaned: result.deletedCount || 0,
      };
    } catch (error) {
      console.error(`[SessionAnalyticsService] Error during session cleanup:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      return {
        deletedCount: 0,
        expiredCount: 0,
        revokedCount: 0,
        totalCleaned: 0,
      };
    }
  }
}
