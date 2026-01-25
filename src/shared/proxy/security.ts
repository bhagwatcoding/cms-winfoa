// lib/proxy/security.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './config';

export class Security {
  // Patterns for WAF (SQLi, XSS, Path Traversal)
  private static BLOCKED_PATTERNS = [
    /<script>/i,
    /javascript:/i,
    / UNION /i,
    / SELECT /i,
    /\.\.\//,
    /etc\/passwd/i,
  ];

  static runWAF(req: NextRequest): boolean {
    if (!CONFIG.ENABLE_WAF) return true;

    const url = req.url;
    // Check if URL contains malicious patterns
    return !this.BLOCKED_PATTERNS.some((pattern) => pattern.test(url));
  }

  static getIP(req: NextRequest): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
  }

  static applyHeaders(res: NextResponse): NextResponse {
    Object.entries(CONFIG.HEADERS).forEach(([key, value]) => {
      res.headers.set(key, value);
    });
    return res;
  }
}
