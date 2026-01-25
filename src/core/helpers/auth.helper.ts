/**
 * Authentication Helper Utilities
 * Common helper functions for auth actions
 */

import type { IUser } from '@/models';
import { DeviceType } from '@/core/db/enums';
import { IDeviceInfo } from '@/core/db/interfaces';

// Import interfaces from centralized types
import { RequestMetadata, UserSafeData } from '@/shared/types/auth';

// Import and re-export validation utilities
// import { isStrongPassword, validateEmail } from '@/lib/utils/validations/utils.validation';

// export { isStrongPassword, validateEmail };
import { HeaderStore } from '@/core/helpers';
// import { createErrorResponse, createSuccessResponse } from '@/core/helpers/error.healper';
import { BrowserType, OSType } from '../types/enums';

// ==========================================
// REQUEST HELPERS
// ==========================================

/**
 * Get request metadata from headers
 */
export async function getRequestMetadata(): Promise<RequestMetadata> {
  // Use HeaderStore static methods directly
  const [userAgent, ipAddress, os, device, browser, referer, city, country] = await Promise.all([
    HeaderStore.userAgent(),
    HeaderStore.ip(),
    HeaderStore.os(),
    HeaderStore.device(),
    HeaderStore.browser(),
    HeaderStore.referer(),
    HeaderStore.city(),
    HeaderStore.country(),
  ]);

  return {
    userAgent: userAgent || undefined,
    ipAddress: ipAddress || undefined,
    os: os || undefined,
    device: device || undefined,
    browser: browser || undefined,
    referer: referer || undefined,
    location: city && country ? `${city}, ${country}` : undefined,
  };
}

/**
 * Parse user agent to extract device info
 */
export async function parseUserAgent(userAgent?: string): Promise<IDeviceInfo> {
  if (!userAgent) {
    return {
      browser: BrowserType.Unknown,
      os: OSType.Unknown,
      device: DeviceType.Unknown,
      isMobile: false,
    };
  }

  const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);

  let browser = BrowserType.Unknown;
  if (/Chrome/.test(userAgent) && !/Chromium|Edg/.test(userAgent)) {
    browser = BrowserType.Chrome;
  } else if (/Firefox/.test(userAgent)) {
    browser = BrowserType.Firefox;
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser = BrowserType.Safari;
  } else if (/Edg/.test(userAgent)) {
    browser = BrowserType.Edge;
  } else if (/OPR|Opera/.test(userAgent)) {
    browser = BrowserType.Opera;
  }

  let os = OSType.Unknown;
  if (/Windows/.test(userAgent)) {
    os = OSType.Windows;
  } else if (/Mac OS/.test(userAgent) || /Macintosh/.test(userAgent)) {
    os = OSType.MacOS;
  } else if (/Linux/.test(userAgent)) {
    os = OSType.Linux;
  } else if (/Android/.test(userAgent)) {
    os = OSType.Android;
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = OSType.iOS;
  }

  let device = DeviceType.Unknown;
  if (isMobile) device = DeviceType.Mobile;
  else if (isTablet) device = DeviceType.Tablet;
  else device = DeviceType.Desktop;

  return { browser, os, device, isMobile };
}

/**
 * Get client IP address
 */
export async function getClientIp(): Promise<string | undefined> {
  return await HeaderStore.ip();
}

/**
 * Get client location from IP (simplified)
 */
export function getLocationFromIp(ip?: string): string {
  // In production, use a service like MaxMind GeoIP2
  if (!ip) return 'Unknown';

  // Simplified for demo
  if (ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'Local Network';
  }

  return 'Unknown Location';
}

// ==========================================
// USER DATA HELPERS
// ==========================================

/**
 * Convert user model to safe data (remove sensitive fields)
 */
export function toSafeUserData(user: IUser): UserSafeData {
  return {
    id: user._id.toString(),
    name: user.fullName,
    email: user.email,
    role: user.role || 'user',
    emailVerified: user.emailVerified,
    avatar: user.avatar,
    phone: user.phone,
  };
}

/**
 * Mask email for privacy
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  const maskedLocal =
    local.length > 3 ? `${local.slice(0, 2)}***${local.slice(-1)}` : `${local[0]}***`;

  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for privacy
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;

  return `***${phone.slice(-4)}`;
}

// ==========================================
// REDIRECT HELPERS
// ==========================================

/**
 * Get redirect URL based on user role
 */
export function getRoleBasedRedirect(role: string): string {
  const redirectMap: Record<string, string> = {
    admin: '/admin/dashboard',
    moderator: '/moderator/dashboard',
    user: '/dashboard',
    guest: '/home',
  };

  return redirectMap[role] || '/dashboard';
}

/**
 * Build URL with query parameters
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl, 'http://dummy.com');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.pathname + url.search;
}
