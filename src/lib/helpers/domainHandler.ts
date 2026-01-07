import { NextRequest, NextResponse } from 'next/server';

// ============================================
// TYPES
// ============================================

type SubdomainType = 'api' | 'app' | 'root' | string;

interface RequestContext {
    domain: string;
    subdomain: SubdomainType | null;
    path: string;
    searchParams: string;
    host: string;
    url: URL;
}

// ============================================
// CLASS DEFINITION
// ============================================

class AppMiddleware {
    // ------------------------------------------
    // Configuration
    // ------------------------------------------
    private static readonly CONFIG = {
        ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000',
        PATHS: {
            AUTH: ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'],
            PUBLIC_ASSETS: ['/favicon.ico', '/_next', '/images', '/public'],
            API_PREFIX: '/api',
        },
        SUBDOMAINS: {
            API: 'api',
            WWW: 'www',
        },
        REWRITES: {
            TENANT_ROOT: '/center', // Internal folder for tenant logic
        }
    } as const;

    // ------------------------------------------
    // Helper Methods (Private)
    // ------------------------------------------

    /**
     * Parses the incoming request to extract domain context
     */
    private static parseRequest(request: NextRequest): RequestContext {
        const url = request.nextUrl;
        const host = request.headers.get('host') || '';

        const cleanHost = host.replace(`:3000`, '');
        const cleanRoot = this.CONFIG.ROOT_DOMAIN.replace(`:3000`, '');

        let subdomain: string | null = null;

        if (cleanHost !== cleanRoot && cleanHost.endsWith(`.${cleanRoot}`)) {
            subdomain = cleanHost.replace(`.${cleanRoot}`, '');
        }

        return {
            domain: this.CONFIG.ROOT_DOMAIN,
            subdomain,
            path: url.pathname,
            searchParams: url.search,
            host,
            url
        };
    }

    /**
     * Checks if path is a static asset (images, next internals)
     */
    private static isStaticAsset(path: string): boolean {
        return this.CONFIG.PATHS.PUBLIC_ASSETS.some(p => path.startsWith(p));
    }

    /**
     * Checks if path is a shared authentication route
     */
    private static isAuthRoute(path: string): boolean {
        return this.CONFIG.PATHS.AUTH.some(p => path.startsWith(p));
    }

    // ------------------------------------------
    // Core Logic Handlers
    // ------------------------------------------

    private static handleApiSubdomain(req: NextRequest, path: string): NextResponse {
        // Ensure path starts with /api for internal routing
        const newPath = path.startsWith('/api') ? path : `/api${path}`;
        return NextResponse.rewrite(new URL(newPath, req.url));
    }

    private static handleTenantSubdomain(
        req: NextRequest,
        path: string,
        subdomain: string,
        hasSession: boolean
    ): NextResponse {
        const isApi = path.startsWith(this.CONFIG.PATHS.API_PREFIX);
        const isAuth = this.isAuthRoute(path);

        // 1. Security: Protect Tenant Routes
        if (!isApi && !isAuth && !hasSession) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('from', subdomain);
            return NextResponse.redirect(loginUrl);
        }

        // 2. Internal API Proxy
        if (isApi) {
            return NextResponse.rewrite(new URL(path, req.url));
        }

        // 3. Rewrite to Tenant Folder (/center)
        return NextResponse.rewrite(
            new URL(`${this.CONFIG.REWRITES.TENANT_ROOT}${path === '/' ? '' : path}`, req.url)
        );
    }

    private static handleRootDomain(
        req: NextRequest,
        path: string,
        hasSession: boolean
    ): NextResponse {
        const isAuth = this.isAuthRoute(path);

        // Redirect logged-in users away from login pages
        if (isAuth && hasSession) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();
    }

    // ------------------------------------------
    // Main Entry Point (Public)
    // ------------------------------------------

    public static async execute(request: NextRequest): Promise<NextResponse> {
        const ctx = this.parseRequest(request);
        const { path, subdomain } = ctx;

        // 1. Performance: Exit early for static files
        if (this.isStaticAsset(path)) {
            return NextResponse.next();
        }

        const session = request.cookies.get('auth_session');
        const hasSession = !!session;

        // 2. Route based on Subdomain
        let response: NextResponse;

        if (subdomain === this.CONFIG.SUBDOMAINS.API) {
            // API Subdomain
            response = this.handleApiSubdomain(request, path);

        } else if (subdomain && subdomain !== this.CONFIG.SUBDOMAINS.WWW) {
            // Tenant Subdomain
            response = this.handleTenantSubdomain(request, path, subdomain, hasSession);

        } else {
            // Root Domain
            response = this.handleRootDomain(request, path, hasSession);
        }

        // 3. Inject Debug/Context Headers
        response.headers.set('x-url', request.url);
        response.headers.set('x-path', path);
        if (subdomain) {
            response.headers.set('x-subdomain', subdomain);
        }

        return response;
    }
}

// ============================================
// EXPORT
// ============================================

// The actual middleware function Next.js calls
export default async function middleware(request: NextRequest) {
    return AppMiddleware.execute(request);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};