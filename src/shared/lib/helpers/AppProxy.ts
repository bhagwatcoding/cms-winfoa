import { NextRequest, NextResponse } from 'next/server';

type SubdomainType = 'api' | 'app' | 'root' | string;

interface RequestContext {
    domain: string;
    subdomain: SubdomainType | null;
    path: string;
    searchParams: string;
    host: string;
    url: URL;
}

export class AppProxy {
    private static readonly CONFIG = {
        ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000',
        PATHS: {
            AUTH: ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'],
            PUBLIC_ASSETS: ['/favicon.ico', '/_next', '/images', '/public'],
            API_PREFIX: '/api',
        },
        SUBDOMAINS: { API: 'api', WWW: 'www' },
        REWRITES: { TENANT_ROOT: '/center' }
    } as const;

    private static parseRequest(request: NextRequest): RequestContext {
        const url = request.nextUrl;
        const host = request.headers.get('host') || '';
        const cleanHost = host.replace(`:3000`, '');
        const cleanRoot = this.CONFIG.ROOT_DOMAIN.replace(`:3000`, '');
        let subdomain: string | null = null;
        if (cleanHost !== cleanRoot && cleanHost.endsWith(`.${cleanRoot}`)) {
            subdomain = cleanHost.replace(`.${cleanRoot}`, '');
        }
        return { domain: this.CONFIG.ROOT_DOMAIN, subdomain, path: url.pathname, searchParams: url.search, host, url };
    }

    private static isStaticAsset(path: string): boolean {
        return this.CONFIG.PATHS.PUBLIC_ASSETS.some(p => path.startsWith(p));
    }

    private static isAuthRoute(path: string): boolean {
        return this.CONFIG.PATHS.AUTH.some(p => path.startsWith(p));
    }

    private static handleApiSubdomain(req: NextRequest, path: string): NextResponse {
        const newPath = path.startsWith('/api') ? path : `/api${path}`;
        return NextResponse.rewrite(new URL(newPath, req.url));
    }

    private static handleTenantSubdomain(req: NextRequest, path: string, subdomain: string, hasSession: boolean): NextResponse {
        const isApi = path.startsWith(this.CONFIG.PATHS.API_PREFIX);
        const isAuth = this.isAuthRoute(path);
        if (!isApi && !isAuth && !hasSession) {
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('from', subdomain);
            return NextResponse.redirect(loginUrl);
        }
        if (isApi) return NextResponse.rewrite(new URL(path, req.url));
        return NextResponse.rewrite(new URL(`${this.CONFIG.REWRITES.TENANT_ROOT}${path === '/' ? '' : path}`, req.url));
    }

    private static handleRootDomain(req: NextRequest, path: string, hasSession: boolean): NextResponse {
        if (this.isAuthRoute(path) && hasSession) return NextResponse.redirect(new URL('/', req.url));
        return NextResponse.next();
    }

    public static async execute(request: NextRequest): Promise<NextResponse> {
        const ctx = this.parseRequest(request);
        const { path, subdomain } = ctx;
        if (this.isStaticAsset(path)) return NextResponse.next();

        const hasSession = !!request.cookies.get('auth_session');
        let response: NextResponse;

        if (subdomain === this.CONFIG.SUBDOMAINS.API) response = this.handleApiSubdomain(request, path);
        else if (subdomain && subdomain !== this.CONFIG.SUBDOMAINS.WWW) response = this.handleTenantSubdomain(request, path, subdomain, hasSession);
        else response = this.handleRootDomain(request, path, hasSession);

        response.headers.set('x-url', request.url);
        response.headers.set('x-path', path);
        if (subdomain) response.headers.set('x-subdomain', subdomain);
        return response;
    }
}

// export default async function middleware(request: NextRequest) { return AppMiddleware.execute(request); }
// export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };