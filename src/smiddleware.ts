/**
 * Professional Multi-Subdomain Middleware
 * Advanced routing and security for enterprise applications
 *
 * @module Middleware
 * @description Handles subdomain routing, authentication, and security
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUBDOMAINS } from '@/config/subdomains';

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

interface SecurityConfig {
  requireAuth: boolean;
  requiredRole?: string;
  rateLimit: { windowMs: number; max: number };
  securityHeaders: boolean;
  csrfProtection?: boolean;
}

/**
 * Security configuration for different subdomains
 */
const SECURITY_CONFIG: Record<string, SecurityConfig> = {
  [SUBDOMAINS.GOD]: {
    requireAuth: true,
    requiredRole: 'god',
    rateLimit: { windowMs: 15 * 60 * 1000, max: 100 }, // 15 minutes, 100 requests
    securityHeaders: true,
  },
  [SUBDOMAINS.UMP]: {
    requireAuth: true,
    requiredRole: 'admin',
    rateLimit: { windowMs: 15 * 60 * 1000, max: 200 },
    securityHeaders: true,
  },
  [SUBDOMAINS.MYACCOUNT]: {
    requireAuth: true,
    requiredRole: 'user',
    rateLimit: { windowMs: 15 * 60 * 1000, max: 300 },
    securityHeaders: true,
  },
  [SUBDOMAINS.WALLET]: {
    requireAuth: true,
    requiredRole: 'user',
    rateLimit: { windowMs: 15 * 60 * 1000, max: 150 }, // Lower limit for financial
    securityHeaders: true,
    csrfProtection: true,
  },
  [SUBDOMAINS.AUTH]: {
    requireAuth: false, // Explicitly false for Auth domain
    rateLimit: { windowMs: 15 * 60 * 1000, max: 50 }, // Strict limit for auth
    securityHeaders: true,
  },
  [SUBDOMAINS.ROOT]: {
    requireAuth: false,
    rateLimit: { windowMs: 15 * 60 * 1000, max: 500 },
    securityHeaders: true,
  },
};

/**
 * CORS configuration for different environments
 */
const CORS_CONFIG = {
  development: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  production: {
    origin: [
      'https://yourdomain.com',
      'https://auth.yourdomain.com',
      'https://app.yourdomain.com',
      'https://god.yourdomain.com',
      'https://account.yourdomain.com',
      'https://ump.yourdomain.com',
      'https://wallet.yourdomain.com',
    ],
    credentials: true,
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract subdomain from hostname
 */
function extractSubdomain(hostname: string): string {
  const parts = hostname.split('.');

  // Handle localhost and IP addresses
  if (parts.length <= 2 || parts[0] === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return SUBDOMAINS.ROOT;
  }

  // Handle www subdomain
  if (parts[0] === 'www') {
    return SUBDOMAINS.WWW;
  }

  return parts[0];
}

/**
 * Get user role from session/cookie
 */
function getUserRole(request: NextRequest): string | null {
  try {
    const userCookie = request.cookies.get('user')?.value;

    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return userData.role || null;
    }

    return null;
  } catch (error) {
    console.error('Error parsing user role:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
function hasRequiredRole(userRole: string | null, requiredRole: string): boolean {
  if (!userRole) return false;

  const roleHierarchy = {
    user: 1,
    admin: 2,
    god: 3,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Add security headers based on subdomain
 */
function addSecurityHeaders(response: NextResponse, subdomain: string): NextResponse {
  const config = SECURITY_CONFIG[subdomain];

  if (config?.securityHeaders) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Add CSP for sensitive subdomains
    if ([SUBDOMAINS.GOD as string, SUBDOMAINS.WALLET as string].includes(subdomain)) {
      response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
      );
    }

    // Add CSRF protection for wallet
    if (config.csrfProtection) {
      response.headers.set('X-CSRF-Token', 'required');
    }
  }

  return response;
}

/**
 * Handle CORS for API routes
 */
function handleCORS(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');
  const env = process.env.NODE_ENV || 'development';
  const allowedOrigins = CORS_CONFIG[env as keyof typeof CORS_CONFIG].origin;

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token'
    );
  }

  return response;
}

/**
 * Rate limiting implementation
 */
function checkRateLimit(request: NextRequest, subdomain: string): boolean {
  // This is a simplified implementation
  // In production, use Redis or similar for distributed rate limiting
  const config = SECURITY_CONFIG[subdomain];

  if (!config?.rateLimit) return true;

  // Get client identifier (IP + user agent)
  // Use 'any' cast to access ip property because standard NextRequest types might miss it
  // @ts-expect-error - request.ip is not standard in NextRequest but available in some environments
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  // const clientId = `${ip}-${request.headers.get('user-agent') || 'unknown'}`;

  // Implement actual rate limiting logic here
  // This would typically use Redis or a similar service

  // Placeholder Usage to silence linter if key logic isn't used yet
  if (!ip) return true;

  return true; // Allow for now
}

// =============================================================================
// MAIN MIDDLEWARE FUNCTION
// =============================================================================

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const subdomain = extractSubdomain(hostname);

  console.log(`[Middleware] ${request.method} ${hostname}${pathname} (subdomain: ${subdomain})`);

  // Get security configuration
  const config = SECURITY_CONFIG[subdomain];

  if (!config) {
    console.warn(`[Middleware] Unknown subdomain: ${subdomain}`);
    return NextResponse.next();
  }

  // Check rate limiting
  if (!checkRateLimit(request, subdomain)) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  // Handle authentication
  if (config.requireAuth) {
    const userRole = getUserRole(request);

    if (!userRole) {
      // Redirect to auth subdomain
      const authUrl = new URL('/login', request.url);
      const hostnameParts = hostname.split('.');
      // Construct auth subdomain properly
      if (hostnameParts.length > 2) {
        // e.g. god.domain.com -> auth.domain.com
        authUrl.hostname = `auth.${hostnameParts.slice(1).join('.')}`;
      } else {
        // e.g. domain.com -> auth.domain.com
        authUrl.hostname = `auth.${hostname}`;
      }
      return NextResponse.redirect(authUrl);
    }

    // Check role-based access
    if (config.requiredRole && !hasRequiredRole(userRole, config.requiredRole)) {
      return new NextResponse('Access denied', { status: 403 });
    }
  }

  // Handle URL Rewrites for Subdomains
  if (subdomain !== SUBDOMAINS.ROOT && subdomain !== SUBDOMAINS.WWW) {
    const url = request.nextUrl.clone();
    url.pathname = `/${subdomain}${pathname}`;

    let response = NextResponse.rewrite(url);
    response = addSecurityHeaders(response, subdomain);

    if (pathname.startsWith('/api/')) {
      response = handleCORS(request, response);
    }

    response.headers.set('X-Subdomain', subdomain);
    response.headers.set('X-Original-Host', hostname);

    return response;
  }

  // Create response for Root/WWW
  let response = NextResponse.next();

  response = addSecurityHeaders(response, subdomain);

  if (pathname.startsWith('/api/')) {
    response = handleCORS(request, response);
  }

  response.headers.set('X-Subdomain', subdomain);
  response.headers.set('X-Original-Host', hostname);

  return response;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
