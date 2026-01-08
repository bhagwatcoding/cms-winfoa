import { NextRequest, NextResponse } from 'next/server';
import { getLoginRedirectUrl } from '@/helpers';

type SubdomainType = 'ump' | 'god' | 'skills' | 'api' | 'auth' | 'myaccount' | 'www' | 'wallet' | null;

export interface ProxyConfig {
    subdomain: SubdomainType;
    path: string;
    hostname: string;
    isAuthenticated: boolean;
}

export class SubdomainProxy {

    private static readonly CONFIG = {
        ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000',
        AUTH_COOKIE: 'auth_session',
        PUBLIC_PATHS: ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'],
        STATIC_PATHS: ['/favicon.ico', '/_next', '/images', '/public', '/api'],
    };

    /**
     * Extract subdomain from hostname
     */
    private static getSubdomain(hostname: string): SubdomainType {
        const cleanHost = hostname.replace(':3000', '');
        const cleanRoot = this.CONFIG.ROOT_DOMAIN.replace(':3000', '');

        // If exact match, no subdomain
        if (cleanHost === cleanRoot) return null;

        // Extract subdomain
        if (cleanHost.endsWith(`.${cleanRoot}`)) {
            const subdomain = cleanHost.replace(`.${cleanRoot}`, '');

            // Validate subdomain
            const validSubdomains: SubdomainType[] = ['ump', 'god', 'skills', 'api', 'auth', 'myaccount', 'www', 'wallet'];
            if (validSubdomains.includes(subdomain as SubdomainType)) {
                return subdomain as SubdomainType;
            }
        }

        return null;
    }

    /**
     * Check if path is static asset
     */
    private static isStaticPath(path: string): boolean {
        return this.CONFIG.STATIC_PATHS.some(p => path.startsWith(p));
    }

    /**
     * Check if path is public (no auth required)
     */
    private static isPublicPath(path: string): boolean {
        return this.CONFIG.PUBLIC_PATHS.some(p => path.startsWith(p));
    }

    /**
     * Handle GOD subdomain (god.example.com)
     * Super admin panel with full system access
     */
    private static handleGodSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // Redirect to auth if not authenticated
        if (!isAuthenticated && !this.isPublicPath(path)) {
            const authUrl = getLoginRedirectUrl(request.url);
            return NextResponse.redirect(authUrl);
        }

        // Rewrite to god routes
        return NextResponse.rewrite(new URL(`/god${path === '/' ? '' : path}`, request.url));
    }

    /**
     * Handle SKILLS subdomain (skills.example.com)
     * Skills/Education portal for courses and certificates
     */
    private static handleSkillsSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // Allow API routes without rewrite
        if (path.startsWith('/api')) {
            return NextResponse.next();
        }

        // Redirect to auth if not authenticated
        if (!isAuthenticated && !this.isPublicPath(path)) {
            const authUrl = getLoginRedirectUrl(request.url);
            return NextResponse.redirect(authUrl);
        }

        // Rewrite to skills routes
        return NextResponse.rewrite(new URL(`/skills${path === '/' ? '' : path}`, request.url));
    }

    /**
     * Handle API subdomain (api.example.com)
     * API gateway for all services
     */
    private static handleApiSubdomain(
        request: NextRequest,
        path: string
    ): NextResponse {
        // Rewrite to API routes
        const apiPath = path.startsWith('/api') ? path : `/api${path}`;
        return NextResponse.rewrite(new URL(apiPath, request.url));
    }

    /**
     * Handle AUTH subdomain (auth.example.com)
     * Centralized authentication service
     */
    private static handleAuthSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // If already authenticated and trying to access login, redirect to dashboard
        // We need to know which dashboard to redirect to, defaulting to root or checking query param
        if (isAuthenticated && this.isPublicPath(path)) {
            // For simplicity, redirect to center if no role info, or parse query param 'redirect'
            const redirectParam = request.nextUrl.searchParams.get('redirect');
            if (redirectParam) {
                return NextResponse.redirect(redirectParam);
            }
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Rewrite to auth routes
        return NextResponse.rewrite(new URL(`/auth${path === '/' ? '/login' : path}`, request.url));
    }

    /**
     * Handle MYACCOUNT subdomain (myaccount.example.com)
     * User account management portal
     */
    private static handleMyAccountSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // Redirect to auth if not authenticated
        if (!isAuthenticated) {
            const authUrl = getLoginRedirectUrl(request.url);
            return NextResponse.redirect(authUrl);
        }

        // Rewrite to myaccount routes
        return NextResponse.rewrite(new URL(`/myaccount${path === '/' ? '' : path}`, request.url));
    }

    /**
     * Handle WALLET subdomain (wallet.example.com)
     * User wallet management portal
     */
    private static handleWalletSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // Redirect to auth if not authenticated
        if (!isAuthenticated) {
            const authUrl = getLoginRedirectUrl(request.url);
            return NextResponse.redirect(authUrl);
        }

        // Rewrite to wallet routes
        return NextResponse.rewrite(new URL(`/wallet${path === '/' ? '' : path}`, request.url));
    }

    /**
     * Handle UMP subdomain (ump.example.com)
     * User Management Portal for admin operations
     */
    private static handleUmpSubdomain(
        request: NextRequest,
        path: string,
        isAuthenticated: boolean
    ): NextResponse {
        // Redirect to auth if not authenticated
        if (!isAuthenticated && !this.isPublicPath(path)) {
            const authUrl = getLoginRedirectUrl(request.url);
            return NextResponse.redirect(authUrl);
        }

        // Rewrite to ump routes
        return NextResponse.rewrite(new URL(`/ump${path === '/' ? '' : path}`, request.url));
    }

    /**
     * Handle root domain (example.com)
     * Landing page and marketing site
     */
    private static handleRootDomain(
        request: NextRequest,
        path: string
    ): NextResponse {
        // Auto-redirect auth-related paths to auth subdomain
        const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
        if (authPaths.includes(path) || path.startsWith('/auth/')) {
            const rootDomain = this.CONFIG.ROOT_DOMAIN;
            const authUrl = `http://auth.${rootDomain}${path.startsWith('/auth/') ? path.replace('/auth', '') : path}`;
            return NextResponse.redirect(authUrl);
        }

        // Just serve the root routes (landing page)
        return NextResponse.next();
    }

    /**
     * Main proxy execution
     */
    public static async execute(request: NextRequest): Promise<NextResponse> {
        const url = request.nextUrl;
        const hostname = request.headers.get('host') || '';
        const path = url.pathname;

        // Skip static assets
        if (this.isStaticPath(path)) {
            return NextResponse.next();
        }

        // Extract subdomain
        const subdomain = this.getSubdomain(hostname);

        // Check authentication
        const isAuthenticated = !!request.cookies.get(this.CONFIG.AUTH_COOKIE);

        // Route based on subdomain
        let response: NextResponse;

        switch (subdomain) {
            case 'god':
                response = this.handleGodSubdomain(request, path, isAuthenticated);
                break;

            case 'ump':
                response = this.handleUmpSubdomain(request, path, isAuthenticated);
                break;

            case 'skills':
                response = this.handleSkillsSubdomain(request, path, isAuthenticated);
                break;

            case 'api':
                response = this.handleApiSubdomain(request, path);
                break;

            case 'auth':
                response = this.handleAuthSubdomain(request, path, isAuthenticated);
                break;

            case 'myaccount':
                response = this.handleMyAccountSubdomain(request, path, isAuthenticated);
                break;

            case 'wallet':
                response = this.handleWalletSubdomain(request, path, isAuthenticated);
                break;

            default:
                response = this.handleRootDomain(request, path);
                break;
        }

        // Add custom headers for debugging
        response.headers.set('x-subdomain', subdomain || 'root');
        response.headers.set('x-path', path);
        response.headers.set('x-authenticated', isAuthenticated.toString());

        return response;
    }
}

// Export the proxy function
export default async function proxy(request: NextRequest) {
    return await SubdomainProxy.execute(request);
}

// Matcher configuration
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         * - Image files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};