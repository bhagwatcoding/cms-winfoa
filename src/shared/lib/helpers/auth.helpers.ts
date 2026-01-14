/**
 * Authentication Helper Utilities
 * Common helper functions for auth actions
 */

import { headers } from 'next/headers';
import type { IUser } from '@/models';
import { DeviceType } from '@/types/enums';

// Import interfaces from centralized types
import type {
    RequestMetadata,
    DeviceInfo,
    SessionSignature,
    UserSafeData
} from '@/types/auth';

// Import and re-export validation utilities
import {
    isStrongPassword,
    validateEmail
} from '@/lib/validations/utils.validation';

export { isStrongPassword, validateEmail };

// ==========================================
// REQUEST HELPERS
// ==========================================

/**
 * Get request metadata from headers
 */
export async function getRequestMetadata(): Promise<RequestMetadata> {
    const headersList = await headers();

    return {
        userAgent: headersList.get('user-agent') || undefined,
        ipAddress:
            headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            headersList.get('x-real-ip') ||
            headersList.get('cf-connecting-ip') || // Cloudflare
            undefined,
        referer: headersList.get('referer') || undefined,
        origin: headersList.get('origin') || undefined,
    };
}

/**
 * Parse user agent to extract device info
 */
export function parseUserAgent(userAgent?: string): DeviceInfo {
    if (!userAgent) {
        return {
            browser: 'Unknown',
            os: 'Unknown',
            device: 'Unknown',
            type: DeviceType.UNKNOWN,
            isMobile: false,
        };
    }

    const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) os = 'iOS';

    const device = isMobile ? (isTablet ? 'Tablet' : 'Mobile') : 'Desktop';

    let type = DeviceType.DESKTOP;
    if (isTablet) type = DeviceType.TABLET;
    else if (isMobile) type = DeviceType.MOBILE;

    return { browser, os, device, type, isMobile };
}

/**
 * Get client IP address
 */
export async function getClientIp(): Promise<string | undefined> {
    const metadata = await getRequestMetadata();
    return metadata.ipAddress;
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
        name: user.name,
        email: user.email,
        role: user.role,
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

    const maskedLocal = local.length > 3
        ? `${local.slice(0, 2)}***${local.slice(-1)}`
        : `${local[0]}***`;

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
// TIME HELPERS
// ==========================================

/**
 * Format duration in human-readable format
 */
export function formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 10) return `${seconds} seconds ago`;
    return 'Just now';
}

// ==========================================
// ERROR HELPERS
// ==========================================

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
    return error instanceof Error && error.name === 'ValidationError';
}

/**
 * Create standard error response
 */
export function createErrorResponse(message: string, code?: string) {
    return {
        success: false as const,
        error: message,
        code,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create standard success response
 */
export function createSuccessResponse<T>(data: T, message?: string) {
    return {
        success: true as const,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
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
export function buildUrlWithParams(
    baseUrl: string,
    params: Record<string, string>
): string {
    const url = new URL(baseUrl, 'http://dummy.com');
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    return url.pathname + url.search;
}
