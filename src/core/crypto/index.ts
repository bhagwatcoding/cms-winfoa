import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// ==========================================
// CONFIGURATION
// ==========================================

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production';
const ALGORITHM = 'sha256';
const SIGNATURE_LENGTH = 64;

// ... [Paste the rest of your provided code here] ...

export function sign(value: string, secret: string = SESSION_SECRET): string {
  if (!value) throw new Error('Value is required for signing');
  // ... implementation ...
  const signature = createHmac(ALGORITHM, secret).update(value).digest('hex');
  return `${value}.${signature}`;
}

export function unsign(signedValue: string, secret: string = SESSION_SECRET): string | null {
  if (!signedValue || !secret) return null;
  const lastDotIndex = signedValue.lastIndexOf('.');
  if (lastDotIndex === -1) return null;
  const value = signedValue.slice(0, lastDotIndex);
  const providedSignature = signedValue.slice(lastDotIndex + 1);
  if (providedSignature.length !== SIGNATURE_LENGTH) return null;
  const expectedSignature = createHmac(ALGORITHM, secret).update(value).digest('hex');
  try {
    const providedBuffer = Buffer.from(providedSignature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    if (providedBuffer.length !== expectedBuffer.length) return null;
    return timingSafeEqual(providedBuffer, expectedBuffer) ? value : null;
  } catch {
    return null;
  }
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function signCookie(name: string, value: string): string {
  const payload = `${name}=${value}`;
  return sign(payload);
}

export function unsignCookie(name: string, signedValue: string): string | null {
  const unsigned = unsign(signedValue);
  if (!unsigned) return null;
  const expectedPrefix = `${name}=`;
  if (!unsigned.startsWith(expectedPrefix)) return null;
  return unsigned.slice(expectedPrefix.length);
}

// ... Export everything ...
