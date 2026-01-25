/**
 * Session Security Service
 * Advanced security features for session management
 * Handles risk analysis, device detection, and security scoring
 */

import 'server-only';
import { User, Session } from '@/models';
import { IDeviceInfo, IGeoInfo } from '@/core/db/interfaces';
import { DeviceType, RiskLevel, LoginMethod } from '@/core/db/enums';
import { connectDB } from '@/lib/db';

export class SessionSecurityService {
  /**
   * Calculate risk score for session based on device and location
   */
  static async calculateRisk(
    userId: string,
    device: IDeviceInfo,
    location: IGeoInfo
  ): Promise<{ riskScore: number; riskLevel: RiskLevel }> {
    let riskScore = 0;

    try {
      await connectDB();
      const user = await User.findById(userId);

      if (!user) {
        return { riskScore: 100, riskLevel: RiskLevel.Critical };
      }

      // Device-based risk factors
      if (device.type === DeviceType.Unknown) riskScore += 20;
      if (!device.browser) riskScore += 15;
      if (!device.os) riskScore += 10;

      // Location-based risk factors
      if (!location.country) riskScore += 25;
      if (!location.ip) riskScore += 20;

      // User history-based risk factors
      const recentSessions = await Session.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      // Check for new device
      const isNewDevice = !recentSessions.some(
        (session) =>
          session.deviceInfo?.userAgent === device.userAgent && session.deviceInfo?.os === device.os
      );

      if (isNewDevice) riskScore += 30;

      // Check for new location
      const isNewLocation = !recentSessions.some(
        (session) =>
          session.geoInfo?.country === location.country && session.geoInfo?.city === location.city
      );

      if (isNewLocation) riskScore += 25;

      // Determine risk level
      let riskLevel: RiskLevel;
      if (riskScore >= 70) riskLevel = RiskLevel.Critical;
      else if (riskScore >= 50) riskLevel = RiskLevel.High;
      else if (riskScore >= 30) riskLevel = RiskLevel.Medium;
      else riskLevel = RiskLevel.Low;

      return { riskScore, riskLevel };
    } catch (error) {
      console.error('Risk calculation error:', error);
      return { riskScore: 50, riskLevel: RiskLevel.Medium };
    }
  }

  /**
   * Analyze device security
   */
  static async analyzeDevice(deviceInfo: IDeviceInfo): Promise<{
    isTrusted: boolean;
    riskScore: number;
    recommendations: string[];
  }> {
    let riskScore = 0;
    const recommendations: string[] = [];

    // Device type analysis
    if (deviceInfo.type === DeviceType.Unknown) {
      riskScore += 20;
      recommendations.push('Device type could not be determined');
    }

    // OS analysis
    if (!deviceInfo.os) {
      riskScore += 15;
      recommendations.push('Operating system information missing');
    }

    return {
      isTrusted: riskScore < 30,
      riskScore,
      recommendations,
    };
  }

  /**
   * Analyze location security
   */
  static async analyzeLocation(geoInfo: IGeoInfo): Promise<{
    isTrusted: boolean;
    riskScore: number;
    recommendations: string[];
  }> {
    let riskScore = 0;
    const recommendations: string[] = [];

    // Country analysis
    if (!geoInfo.country) {
      riskScore += 25;
      recommendations.push('Country could not be determined');
    }

    // IP analysis
    if (!geoInfo.ip) {
      riskScore += 20;
      recommendations.push('IP address not detected');
    }

    // Timezone analysis
    if (!geoInfo.timezone) {
      riskScore += 10;
      recommendations.push('Timezone not detected');
    }

    // Coordinate analysis
    if (!geoInfo.coordinates?.latitude || !geoInfo.coordinates?.longitude) {
      riskScore += 15;
      recommendations.push('Geographic coordinates not available');
    }

    return {
      isTrusted: riskScore < 30,
      riskScore,
      recommendations,
    };
  }

  /**
   * Check if device is trusted for user
   */
  static async isTrustedDevice(userId: string, deviceInfo: IDeviceInfo): Promise<boolean> {
    try {
      await connectDB();

      const recentSessions = await Session.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days
        'deviceInfo.name': deviceInfo.name,
        'deviceInfo.os': deviceInfo.os,
      });

      return recentSessions.length > 0;
    } catch (error) {
      console.error('Trusted device check error:', error);
      return false;
    }
  }

  /**
   * Check if location is trusted for user
   */
  static async isTrustedLocation(userId: string, geoInfo: IGeoInfo): Promise<boolean> {
    try {
      await connectDB();

      const recentSessions = await Session.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days
        'geoInfo.country': geoInfo.country,
        'geoInfo.city': geoInfo.city,
      });

      return recentSessions.length > 0;
    } catch (error) {
      console.error('Trusted location check error:', error);
      return false;
    }
  }

  /**
   * Generate security recommendations
   */
  static generateSecurityRecommendations(
    deviceAnalysis: { isTrusted: boolean; recommendations: string[] },
    locationAnalysis: { isTrusted: boolean; recommendations: string[] },
    riskLevel: RiskLevel
  ): string[] {
    const recommendations: string[] = [];

    // Device recommendations
    if (!deviceAnalysis.isTrusted) {
      recommendations.push(...deviceAnalysis.recommendations);
    }

    // Location recommendations
    if (!locationAnalysis.isTrusted) {
      recommendations.push(...locationAnalysis.recommendations);
    }

    // Risk level recommendations
    if (riskLevel === RiskLevel.High || riskLevel === RiskLevel.Critical) {
      recommendations.push('Consider enabling two-factor authentication');
      recommendations.push('Review recent account activity');
    }

    if (riskLevel === RiskLevel.Critical) {
      recommendations.push("Contact support if this wasn't you");
    }

    return recommendations;
  }

  /**
   * Create security info object
   */
  static createSecurityInfo(
    loginMethod: LoginMethod,
    riskScore: number,
    riskLevel: RiskLevel,
    failedAttempts: number = 0
  ): Record<string, unknown> {
    return {
      loginMethod,
      riskScore,
      riskLevel,
      isVerified: riskLevel === RiskLevel.Low,
      failedAttempts,
      lastSecurityCheck: new Date(),
    };
  }
}
