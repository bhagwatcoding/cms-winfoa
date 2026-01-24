/**
 * Authentication Security Utilities
 * Security helpers for authentication
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SECURITY, SESSION } from '@/config';

// ==========================================
// PASSWORD UTILITIES
// ==========================================

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SECURITY.BCRYPT_ROUNDS);
}

/**
 * Verify password with bcrypt
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ==========================================
// TOKEN UTILITIES
// ==========================================

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate verification token
 */
export function generateVerificationToken(): string {
    return generateSecureToken(32);
}

/**
 * Generate password reset token
 */
export function generateResetToken(): string {
    return generateSecureToken(32);
}

// ==========================================
// SIGNATURE UTILITIES
// ==========================================

/**
 * Create session signature using HMAC SHA-256
 */
export function createSessionSignature(
    userId: string,
    sessionId: string,
    token: string
): string {
    const data = `${userId}:${sessionId}:${token}`;
    return crypto
        .createHmac('sha256', SESSION.SECRET)
        .update(data)
        .digest('hex');
}

/**
 * Verify session signature
 */
export function verifySessionSignature(
    userId: string,
    sessionId: string,
    token: string,
    signature: string
): boolean {
    const expectedSignature = createSessionSignature(userId, sessionId, token);

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Create data signature
 */
export function createDataSignature(data: string): string {
    return crypto
        .createHmac('sha256', SESSION.SECRET)
        .update(data)
        .digest('hex');
}

// ==========================================
// ENCRYPTION UTILITIES
// ==========================================

/**
 * Encrypt sensitive data
 */
export function encryptData(text: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(SESSION.SECRET, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedText: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(SESSION.SECRET, 'salt', 32);

    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// ==========================================
// RATE LIMITING
// ==========================================

interface RateLimitEntry {
    count: number;
    lastAttempt: number;
    blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit for an identifier
 */
export function checkRateLimit(
    identifier: string,
    maxAttempts: number = SECURITY.MAX_LOGIN_ATTEMPTS,
    windowMs: number = SECURITY.LOCKOUT_DURATION
): { allowed: boolean; remainingAttempts: number; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No previous attempts
    if (!entry) {
        rateLimitStore.set(identifier, { count: 1, lastAttempt: now });
        return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Check if blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
        return {
            allowed: false,
            remainingAttempts: 0,
            retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
        };
    }

    // Reset if window expired
    if (now - entry.lastAttempt > windowMs) {
        rateLimitStore.set(identifier, { count: 1, lastAttempt: now });
        return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Check if exceeded
    if (entry.count >= maxAttempts) {
        const blockedUntil = now + windowMs;
        rateLimitStore.set(identifier, {
            ...entry,
            blockedUntil,
        });
        return {
            allowed: false,
            remainingAttempts: 0,
            retryAfter: Math.ceil(windowMs / 1000),
        };
    }

    // Increment count
    entry.count++;
    entry.lastAttempt = now;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remainingAttempts: maxAttempts - entry.count,
    };
}

/**
 * Clear rate limit for identifier (after successful login)
 */
export function clearRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
}

/**
 * Clean up old rate limit entries (run periodically)
 */
export function cleanupRateLimits(): void {
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, entry] of rateLimitStore.entries()) {
        if (now - entry.lastAttempt > expiryTime) {
            rateLimitStore.delete(key);
        }
    }
}

// ==========================================
// SECURITY VALIDATION
// ==========================================

/**
 * Validate IP address format
 */
export function isValidIpAddress(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    if (ipv4Regex.test(ip)) {
        return ip.split('.').every(num => parseInt(num) <= 255);
    }

    return ipv6Regex.test(ip);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential XSS
        .slice(0, 1000); // Limit length
}

/**
 * Check if email is disposable
 */
export function isDisposableEmail(email: string): boolean {
    const disposableDomains = [
        'tempmail.com',
        '10minutemail.com',
        'guerrillamail.com',
        'mailinator.com',
        'throwaway.email',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
    return `session_${Date.now()}_${generateSecureToken(16)}`;
}

/**
 * Create audit log entry
 */
export interface AuditLogEntry {
    action: string;
    userId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    error?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export function createAuditLog(entry: Omit<AuditLogEntry, 'timestamp'>): AuditLogEntry {
    return {
        ...entry,
        timestamp: new Date(),
    };
}

/**
 * Log security event (in production, send to logging service)
 */
export function logSecurityEvent(event: AuditLogEntry): void {
    // In production, send to logging service (e.g., Sentry, LogRocket)
    console.log('[SECURITY EVENT]', JSON.stringify(event, null, 2));

    // Could save to database audit_logs collection
    // await AuditLog.create(event);
}
