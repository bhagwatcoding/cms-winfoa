/**
 * Cryptographic Utilities for Session Security
 * HMAC-SHA256 signing for cookies and session tokens
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// ==========================================
// CONFIGURATION
// ==========================================

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production';
const ALGORITHM = 'sha256';
const SIGNATURE_LENGTH = 64; // hex length of sha256

// ==========================================
// SIGNING UTILITIES
// ==========================================

/**
 * Sign a value using HMAC-SHA256
 * @param value - Value to sign
 * @param secret - Secret key (defaults to SESSION_SECRET)
 * @returns Signed value in format: value.signature
 */
export function sign(value: string, secret: string = SESSION_SECRET): string {
    if (!value) throw new Error('Value is required for signing');
    if (!secret) throw new Error('Secret is required for signing');

    const signature = createHmac(ALGORITHM, secret)
        .update(value)
        .digest('hex');

    return `${value}.${signature}`;
}

/**
 * Unsign a signed value and verify signature
 * @param signedValue - Signed value in format: value.signature
 * @param secret - Secret key (defaults to SESSION_SECRET)
 * @returns Original value if valid, null if invalid
 */
export function unsign(signedValue: string, secret: string = SESSION_SECRET): string | null {
    if (!signedValue) return null;
    if (!secret) return null;

    const lastDotIndex = signedValue.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    const value = signedValue.slice(0, lastDotIndex);
    const providedSignature = signedValue.slice(lastDotIndex + 1);

    if (providedSignature.length !== SIGNATURE_LENGTH) return null;

    const expectedSignature = createHmac(ALGORITHM, secret)
        .update(value)
        .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    try {
        const providedBuffer = Buffer.from(providedSignature, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');

        if (providedBuffer.length !== expectedBuffer.length) return null;

        const isValid = timingSafeEqual(providedBuffer, expectedBuffer);
        return isValid ? value : null;
    } catch {
        return null;
    }
}

/**
 * Verify if a signed value is valid
 * @param signedValue - Signed value to verify
 * @param secret - Secret key (defaults to SESSION_SECRET)
 * @returns True if valid signature
 */
export function verify(signedValue: string, secret: string = SESSION_SECRET): boolean {
    return unsign(signedValue, secret) !== null;
}

// ==========================================
// TOKEN GENERATION
// ==========================================

/**
 * Generate a cryptographically secure random token
 * @param length - Length in bytes (default: 32)
 * @returns Secure random token (hex encoded)
 */
export function generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
}

/**
 * Generate a signed session token
 * Includes timestamp to prevent replay attacks
 * @returns Signed session token
 */
export function generateSignedSessionToken(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = generateSecureToken(24); // 24 bytes = 48 hex chars
    const unsignedToken = `${timestamp}.${randomPart}`;

    return sign(unsignedToken);
}

/**
 * Verify and extract session token
 * @param signedToken - Signed session token
 * @returns Unsigned token if valid, null otherwise
 */
export function verifySessionToken(signedToken: string): string | null {
    const unsignedToken = unsign(signedToken);

    if (!unsignedToken) return null;

    // Optionally verify token format (timestamp.random)
    const parts = unsignedToken.split('.');
    if (parts.length !== 2) return null;

    return unsignedToken;
}

// ==========================================
// ENCRYPTION UTILITIES (Optional - for sensitive data)
// ==========================================

/**
 * Create a hash of a value
 * Useful for comparing values without storing plain text
 * @param value - Value to hash
 * @param salt - Optional salt
 * @returns Hash (hex encoded)
 */
export function hash(value: string, salt?: string): string {
    const hmac = createHmac(ALGORITHM, SESSION_SECRET);
    if (salt) hmac.update(salt);
    hmac.update(value);
    return hmac.digest('hex');
}

/**
 * Generate a secure random salt
 * @param length - Length in bytes (default: 16)
 * @returns Random salt (hex encoded)
 */
export function generateSalt(length: number = 16): string {
    return randomBytes(length).toString('hex');
}

// ==========================================
// COOKIE SIGNING UTILITIES
// ==========================================

/**
 * Sign a cookie value
 * @param name - Cookie name
 * @param value - Cookie value
 * @returns Signed cookie value
 */
export function signCookie(name: string, value: string): string {
    const payload = `${name}=${value}`;
    return sign(payload);
}

/**
 * Unsign a cookie value
 * @param name - Cookie name
 * @param signedValue - Signed cookie value
 * @returns Original value if valid, null otherwise
 */
export function unsignCookie(name: string, signedValue: string): string | null {
    const unsigned = unsign(signedValue);
    if (!unsigned) return null;

    const expectedPrefix = `${name}=`;
    if (!unsigned.startsWith(expectedPrefix)) return null;

    return unsigned.slice(expectedPrefix.length);
}

// ==========================================
// SECURITY HELPERS
// ==========================================

/**
 * Check if session secret is configured properly
 * @returns True if secure secret is configured
 */
export function isSecretConfigured(): boolean {
    return SESSION_SECRET !== 'fallback-secret-key-change-in-production' &&
        SESSION_SECRET.length >= 32;
}

/**
 * Validate session secret strength
 * @throws Error if secret is weak
 */
export function validateSecretStrength(): void {
    if (!isSecretConfigured()) {
        console.warn('⚠️  WARNING: Using default or weak SESSION_SECRET. Set a strong secret in production!');
    }
}

/**
 * Generate a secure session secret
 * Use this to generate a new secret for your .env file
 * @returns Cryptographically secure secret (64 bytes)
 */
export function generateSessionSecret(): string {
    return randomBytes(64).toString('hex');
}

// ==========================================
// EXPORTS
// ==========================================

export const crypto = {
    sign,
    unsign,
    verify,
    generateSecureToken,
    generateSignedSessionToken,
    verifySessionToken,
    hash,
    generateSalt,
    signCookie,
    unsignCookie,
    isSecretConfigured,
    validateSecretStrength,
    generateSessionSecret,
};
