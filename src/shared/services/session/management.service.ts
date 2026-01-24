/**
 * Session Management Service
 * High-level session management operations
 * Handles session lifecycle, user sessions, and session operations
 */

import "server-only";
import { User } from "@/models";
import { LoginMethod, SessionStatus, ResourceType, ActionType } from "@/types";
import { SessionCoreService } from "./core.service";
import { SessionSecurityService } from "./security.service";
import { SessionAnalyticsService } from "./analytics.service";
import { ActivityLogger } from "@/shared/services/activity.service";

import { RequestDetective } from "@/core/detector";

export class SessionManagementService {
  /**
   * Create a comprehensive session with security analysis
   */
  static async createSession(
    userId: string,
    method: LoginMethod = LoginMethod.Password,
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      rememberMe?: boolean;
    }
  ) {
    try {
      // 1. Gather Intelligence (Device & Location Detection)
      const deviceInfo = await RequestDetective.getDeviceInfo();
      const geoInfo = await RequestDetective.getGeoInfo();

      // 2. Risk Calculation Engine
      const { riskScore, riskLevel } = await SessionSecurityService.calculateRisk(
        userId,
        deviceInfo,
        geoInfo
      );

      // 3. Generate Secure Token (High Entropy)
      const token = SessionCoreService.generateSessionToken();

      // 4. Create Security Info
      const securityInfo = SessionSecurityService.createSecurityInfo(
        method,
        riskScore,
        riskLevel
      );

      // 5. Create Session with comprehensive data
      const session = await SessionCoreService.createSession(userId, token, {
        userAgent: metadata?.userAgent,
        ipAddress: metadata?.ipAddress,
        rememberMe: metadata?.rememberMe,
        deviceInfo,
        geoInfo,
        securityInfo
      });

      // 6. Log Activity for Audit Trail
      await ActivityLogger.log(
        userId,
        ActionType.Login,
        ResourceType.Session,
        `User logged in via ${method}`,
        session._id.toString(),
        { 
          device: deviceInfo.name || "Unknown", 
          method: method.toString(),
          riskLevel: riskLevel.toString(),
          location: `${geoInfo.city || "Unknown"}, ${geoInfo.country || "Unknown"}`
        }
      );

      return session;
    } catch (error) {
      console.error("Session creation error:", error);
      throw error;
    }
  }

  /**
   * Logout user and invalidate session
   */
  static async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const session = await SessionCoreService.getCurrentSession();
      if (session) {
        // Mark session as revoked
        session.status = SessionStatus.Revoked;
        session.isActive = false;
        await session.save();

        // Log logout activity
        await ActivityLogger.log(
          session.userId._id,
          ActionType.Logout,
          ResourceType.Session,
          "User logged out",
          session._id.toString()
        );

        // Invalidate session and clear cookie
        await SessionCoreService.invalidateSession(session);
      }

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Logout failed" };
    }
  }

  /**
   * Get current user session with security context
   */
  static async getCurrentSessionWithSecurity() {
    try {
      const session = await SessionCoreService.getCurrentSession();
      if (!session) return null;

      // Add security context
      const securityContext = {
        isTrustedDevice: await SessionSecurityService.isTrustedDevice(
          session.userId._id,
          session.deviceInfo
        ),
        isTrustedLocation: await SessionSecurityService.isTrustedLocation(
          session.userId._id,
          session.geoInfo
        ),
        deviceAnalysis: await SessionSecurityService.analyzeDevice(session.deviceInfo),
        locationAnalysis: await SessionSecurityService.analyzeLocation(session.geoInfo),
        securityRecommendations: SessionSecurityService.generateSecurityRecommendations(
          await SessionSecurityService.analyzeDevice(session.deviceInfo),
          await SessionSecurityService.analyzeLocation(session.geoInfo),
          session.securityInfo?.riskLevel
        )
      };

      return {
        ...session.toObject(),
        securityContext
      };
    } catch (error) {
      console.error("Get current session with security error:", error);
      return null;
    }
  }

  /**
   * Get all user sessions with security analysis
   */
  static async getUserSessions(userId: string) {
    try {
      const sessions = await SessionCoreService.getSessionsByUserId(userId);
      
      // Add security analysis to each session
      const sessionsWithSecurity = await Promise.all(
        sessions.map(async (session) => {
          const deviceAnalysis = await SessionSecurityService.analyzeDevice(session.deviceInfo);
          const locationAnalysis = await SessionSecurityService.analyzeLocation(session.geoInfo);
          
          return {
            ...session.toObject(),
            securityAnalysis: {
              deviceAnalysis,
              locationAnalysis,
              isTrustedDevice: await SessionSecurityService.isTrustedDevice(userId, session.deviceInfo),
              isTrustedLocation: await SessionSecurityService.isTrustedLocation(userId, session.geoInfo),
              recommendations: SessionSecurityService.generateSecurityRecommendations(
                deviceAnalysis,
                locationAnalysis,
                session.securityInfo?.riskLevel
              )
            }
          };
        })
      );

      return sessionsWithSecurity;
    } catch (error) {
      console.error("Get user sessions error:", error);
      return [];
    }
  }

  /**
   * Revoke specific session
   */
  static async revokeSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const session = await SessionCoreService.getSessionById(sessionId);
      
      if (!session || session.userId.toString() !== userId) {
        return false;
      }

      // Mark as revoked
      session.status = SessionStatus.Revoked;
      session.isActive = false;
      await session.save();

      // Log activity
      await ActivityLogger.log(
        userId,
        ActionType.Update,
        ResourceType.Session,
        "Session revoked by user",
        sessionId
      );

      return true;
    } catch (error) {
      console.error("Revoke session error:", error);
      return false;
    }
  }

  /**
   * Revoke all sessions for a user (except current)
   */
  static async revokeAllSessions(userId: string, excludeSessionId?: string): Promise<number> {
    try {
      const sessions = await SessionCoreService.getSessionsByUserId(userId);
      let revokedCount = 0;

      for (const session of sessions) {
        if (excludeSessionId && session._id.toString() === excludeSessionId) {
          continue; // Skip the current session
        }

        if (session.isActive && session.status !== SessionStatus.Revoked) {
          session.status = SessionStatus.Revoked;
          session.isActive = false;
          await session.save();
          revokedCount++;
        }
      }

      // Log bulk revoke activity
      if (revokedCount > 0) {
        await ActivityLogger.log(
          userId,
          ActionType.Update,
          ResourceType.Session,
          `Revoked ${revokedCount} sessions`,
          "bulk"
        );
      }

      return revokedCount;
    } catch (error) {
      console.error("Revoke all sessions error:", error);
      return 0;
    }
  }

  /**
   * Get session dashboard data
   */
  static async getSessionDashboard(userId: string) {
    try {
      const [
        sessionStats,
        deviceAnalytics,
        locationAnalytics,
        securityAnalytics
      ] = await Promise.all([
        SessionAnalyticsService.getSessionStats(userId),
        SessionAnalyticsService.getDeviceAnalytics(userId),
        SessionAnalyticsService.getLocationAnalytics(userId),
        SessionAnalyticsService.getSecurityAnalytics(userId)
      ]);

      return {
        overview: sessionStats,
        devices: deviceAnalytics,
        locations: locationAnalytics,
        security: securityAnalytics,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error("Get session dashboard error:", error);
      return {
        overview: { total: 0, active: 0, expired: 0, byDevice: {}, byRiskLevel: {} },
        devices: { totalDevices: 0, uniqueDevices: [], deviceTypes: {}, osDistribution: {}, browserDistribution: {}, trustedDevices: 0, suspiciousDevices: 0 },
        locations: { totalLocations: 0, uniqueCountries: [], uniqueCities: [], countryDistribution: {}, cityDistribution: {}, suspiciousLocations: 0, timezoneDistribution: {} },
        security: { riskLevelDistribution: {}, verifiedSessions: 0, unverifiedSessions: 0, highRiskSessions: 0, securityRecommendations: [], loginMethodDistribution: {} },
        lastUpdated: new Date()
      };
    }
  }

  /**
   * Cleanup expired and old sessions
   */
  static async cleanupSessions(): Promise<{
    deletedCount: number;
    expiredCount: number;
    revokedCount: number;
    totalCleaned: number;
  }> {
    return SessionAnalyticsService.cleanupExpiredSessions();
  }
}