// lib/proxy/config.ts
export const CONFIG = Object.freeze({
    ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000',
    AUTH_COOKIE: 'auth_session',
    IS_PROD: process.env.NODE_ENV === 'production',
    
    // Rate limiting
    RATE_LIMIT: {
        WINDOW_MS: 60000, // 1 minute
        MAX_REQUESTS: 100,
        BLOCK_DURATION_MS: 300000 // 5 minutes
    },
    
    // Security headers
    SECURITY_HEADERS: {
        'X-DNS-Prefetch-Control': 'on',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    
    CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
    
    PUBLIC_PATHS: new Set([
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-email'
    ]),
    
    STATIC_PREFIXES: new Set([
        '/favicon.ico',
        '/_next',
        '/images',
        '/public',
        '/api',
        '/_vercel'
    ]),
    
    VALID_SUBDOMAINS: new Set([
        'ump',
        'provider',
        'skills',
        'api',
        'auth',
        'myaccount',
        'wallet',
        'www'
    ]),
    
    BLOCKED_COUNTRIES: new Set<string>([]),
    
    PORT_REGEX: /:3000$/,
    SUBDOMAIN_REGEX: /^([a-z0-9-]+)\.(.+)$/,
    BOT_REGEX: /bot|crawler|spider|crawling|googlebot|bingbot/i
});

export type SubdomainType = 'ump' | 'provider' | 'skills' | 'api' | 'auth' | 'myaccount' | 'wallet' | 'www' | null;