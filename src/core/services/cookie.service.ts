import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { encrypt, decrypt } from '@/core/utils/crypto.util';
import { SESSION } from '@/config';
import { IS_PROD } from '@/core/constants';
import { cookies } from 'next/headers';

// ==========================================
// TYPES & INTERFACES
// ==========================================
type CookieValue = string | object | number | boolean;

interface CookieOptions extends Partial<ResponseCookie> {
  days?: number; // Expiry in days
  isSecureData?: boolean; // Encryption toggle
  allSubdomains?: boolean; // Subdomain access toggle
}

/**
 * ENTERPRISE COOKIE SERVICE (Unified Version)
 * Optimized for: Subdomain sharing, Security, and Encryption.
 */
export class CookieService {
  private static readonly IS_PROD = IS_PROD;

  // Default security settings
  private static readonly SECURITY_CONFIG: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax', // Lax is better for cross-subdomain navigation
    path: '/',
  };

  // ---------------------------------------------------------
  // PRIVATE UTILITIES
  // ---------------------------------------------------------

  /**
   * Resolve the root domain for wildcard access (.example.com)
   */
  private static getDomainContext(): string | undefined {
    if (!this.IS_PROD) return undefined; // Localhost par domain set karne se issues hote hain

    // NEXT_PUBLIC_DOMAIN should be "example.com"
    const rootDomain = process.env.NEXT_PUBLIC_DOMAIN;
    return rootDomain ? `.${rootDomain}` : undefined;
  }

  private static serialize(value: CookieValue, shouldEncrypt: boolean): string {
    const stringified = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return shouldEncrypt ? encrypt(stringified) : stringified;
  }

  private static deserialize<T>(value: string, wasEncrypted: boolean): T | null {
    try {
      const data = wasEncrypted ? decrypt(value) : value;
      return JSON.parse(data) as T;
    } catch {
      return wasEncrypted ? null : (value as unknown as T);
    }
  }

  // ---------------------------------------------------------
  // CORE PUBLIC METHODS
  // ---------------------------------------------------------

  /**
   * UNIVERSAL SET: Handles plain, encrypted, and cross-subdomain cookies
   */
  static async set(name: string, value: CookieValue, options: CookieOptions = {}) {
    const { days, isSecureData = false, allSubdomains = false, ...rest } = options;
    const store = await cookies();

    const finalConfig: Partial<ResponseCookie> = {
      ...this.SECURITY_CONFIG,
      ...rest,
    };

    // Subdomain sharing logic
    if (allSubdomains) finalConfig.domain = this.getDomainContext();

    // Expiry logic
    if (days) finalConfig.expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    try {
      const payload = this.serialize(value, isSecureData);
      store.set(name, payload, finalConfig);
    } catch {
      console.error(
        `[CookieService] Set Error: Likely called in a Server Component. Use Actions/Routes.`
      );
    }
  }

  /**
   * UNIVERSAL GET: Retrieval with decryption support
   */
  static async get<T = string>(name: string, isSecureData = false): Promise<T | null> {
    const store = await cookies();
    const cookie = store.get(name);

    if (!cookie?.value) return null;
    return this.deserialize<T>(cookie.value, isSecureData);
  }

  /**
   * DELETE COOKIE
   */
  static async remove(name: string, allSubdomains = false) {
    const store = await cookies();
    const options: Partial<ResponseCookie> = { path: '/' };
    if (allSubdomains) options.domain = this.getDomainContext();

    try {
      store.delete(name);
    } catch {
      console.error(`[CookieService] Failed to delete cookie: ${name}`);
    }
  }

  // ---------------------------------------------------------
  // SEMANTIC HELPERS (Auth & Preferences)
  // ---------------------------------------------------------

  /**
   * Login Session with Subdomain & Encryption support
   */
  static async startSession(token: string, remember: boolean = false) {
    await this.set(
      SESSION.COOKIE.NAME,
      { token, createdAt: Date.now() },
      {
        days: remember ? 30 : 1,
        isSecureData: true,
        allSubdomains: true, // Allow user to stay logged in across subdomains
        sameSite: 'lax', // Lax is required for cross-subdomain auth flow
      }
    );
  }

  static async getSessionToken(): Promise<string | null> {
    const session = await this.get<{ token: string }>(SESSION.COOKIE.NAME, true);
    return session?.token || null;
  }

  static async endSession() {
    await this.remove(SESSION.COOKIE.NAME, true);
  }

  static async getAllCookies() {
    const store = await cookies();
    return store.getAll();
  }
}
