/**
 * Session Service Utilities
 * Utility functions for session management
 */

import { SessionStatus } from "@/types";

/**
 * Generate secure session token
 */
export function generateSessionToken(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Validate session duration
 */
export function validateSessionDuration(duration: number): boolean {
  const minDuration = 5 * 60 * 1000; // 5 minutes
  const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
  return duration >= minDuration && duration <= maxDuration;
}

/**
 * Check if session is expired
 */
export function isSessionExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Format session data for display
 */
export function formatSessionData(session: any): {
  id: string;
  device: string;
  location: string;
  loginAt: string;
  lastActive: string;
  status: string;
  isCurrent: boolean;
} {
  const now = new Date();
  const loginAt = new Date(session.loginAt);
  const lastAccessedAt = new Date(session.lastAccessedAt);
  const isCurrent = session.isActive && !isSessionExpired(session.expiresAt);

  return {
    id: session._id.toString(),
    device: session.deviceInfo?.name || "Unknown Device",
    location: session.location || "Unknown Location",
    loginAt: formatDateTime(loginAt),
    lastActive: formatDateTime(lastAccessedAt),
    status: getSessionStatus(session.status, session.isActive, session.expiresAt),
    isCurrent
  };
}

/**
 * Format date and time
 */
function formatDateTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return "Just now";
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // More than 7 days - show date
  return date.toLocaleDateString();
}

/**
 * Get session status display text
 */
function getSessionStatus(status: SessionStatus, isActive: boolean, expiresAt: Date): string {
  if (!isActive) return "Revoked";
  
  if (isSessionExpired(expiresAt)) return "Expired";
  
  switch (status) {
    case SessionStatus.Active:  return "Active";
    case SessionStatus.Locked: return "Locked";
    case SessionStatus.Impersonated: return "Admin Session";
    default: return "Unknown";
  }
}

/**
 * Calculate session age in human readable format
 */
export function getSessionAge(createdAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Check if session should be renewed
 */
export function shouldRenewSession(lastAccessedAt: Date, expiresAt: Date): boolean {
  const now = new Date();
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();
  const sessionAge = now.getTime() - lastAccessedAt.getTime();
  
  // Renew if session expires in less than 1 hour
  const renewalThreshold = 60 * 60 * 1000; // 1 hour
  
  return timeUntilExpiry < renewalThreshold && sessionAge > 5 * 60 * 1000; // 5 minutes
}

/**
 * Validate session metadata
 */
export function validateSessionMetadata(metadata: any): boolean {
  if (!metadata) return true;
  
  // Validate user agent
  if (metadata.userAgent && typeof metadata.userAgent !== 'string') {
    return false;
  }
  
  // Validate IP address
  if (metadata.ipAddress && typeof metadata.ipAddress !== 'string') {
    return false;
  }
  
  // Validate remember me
  if (metadata.rememberMe && typeof metadata.rememberMe !== 'boolean') {
    return false;
  }
  
  return true;
}

/**
 * Sanitize session data for public display
 */
export function sanitizeSessionData(session: any): any {
  return {
    id: session._id.toString(),
    deviceInfo: {
      type: session.deviceInfo?.type,
      name: session.deviceInfo?.name,
      os: session.deviceInfo?.os
    },
    geoInfo: {
      country: session.geoInfo?.country,
      city: session.geoInfo?.city,
      timezone: session.geoInfo?.timezone
    },
    loginAt: session.loginAt,
    lastAccessedAt: session.lastAccessedAt,
    isActive: session.isActive,
    status: session.status,
    securityInfo: {
      riskLevel: session.securityInfo?.riskLevel,
      isVerified: session.securityInfo?.isVerified
    }
  };
}
