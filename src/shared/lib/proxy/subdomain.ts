// lib/proxy/subdomain.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './config';
import { ProxyUtils } from './utils';

export class SubdomainRouter extends ProxyUtils{
    static handleProvider(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (!authed && !this.isPublicPath(path)) {
            const authUrl = this.buildAuthUrl(req);
            authUrl.searchParams.set('redirect', req.url);
            return NextResponse.redirect(authUrl);
        }
        return NextResponse.rewrite(this.buildUrl('/provider', path, req));
    }
    
    static handleUmp(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (!authed && !this.isPublicPath(path)) {
            const authUrl = this.buildAuthUrl(req);
            authUrl.searchParams.set('redirect', req.url);
            return NextResponse.redirect(authUrl);
        }
        return NextResponse.rewrite(this.buildUrl('/ump', path, req));
    }
    
    static handleSkills(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (path.startsWith('/api')) {
            return NextResponse.next();
        }
        
        if (!authed && !this.isPublicPath(path)) {
            const authUrl = this.buildAuthUrl(req);
            authUrl.searchParams.set('redirect', req.url);
            return NextResponse.redirect(authUrl);
        }
        return NextResponse.rewrite(this.buildUrl('/skills', path, req));
    }
    
    static handleApi(req: NextRequest, path: string): NextResponse {
        const apiPath = path.startsWith('/api') ? path : `/api${path}`;
        return NextResponse.rewrite(new URL(apiPath, req.url));
    }
    
    static handleAuth(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (authed && this.isPublicPath(path)) {
            const redirect = req.nextUrl.searchParams.get('redirect');
            
            if (redirect) {
                const rootDomain = CONFIG.ROOT_DOMAIN.replace(CONFIG.PORT_REGEX, '');
                if (redirect.includes(rootDomain)) {
                    return NextResponse.redirect(redirect);
                }
            }

            const url = new URL('/', req.url);
            url.hostname = CONFIG.ROOT_DOMAIN.replace(CONFIG.PORT_REGEX, '');
            return NextResponse.redirect(url);
        }
        
        const authPath = path === '/' ? '/login' : path;
        return NextResponse.rewrite(this.buildUrl('/auth', authPath, req));
    }
    
    static handleMyAccount(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (!authed) {
            const authUrl = this.buildAuthUrl(req);
            authUrl.searchParams.set('redirect', req.url);
            return NextResponse.redirect(authUrl);
        }
        return NextResponse.rewrite(this.buildUrl('/myaccount', path, req));
    }
    
    static handleWallet(req: NextRequest, path: string, authed: boolean): NextResponse {
        if (!authed) {
            const authUrl = this.buildAuthUrl(req);
            authUrl.searchParams.set('redirect', req.url);
            return NextResponse.redirect(authUrl);
        }
        return NextResponse.rewrite(this.buildUrl('/wallet', path, req));
    }
    
    static handleWww(req: NextRequest): NextResponse {
        const url = new URL(req.nextUrl.pathname + req.nextUrl.search, req.url);
        url.hostname = CONFIG.ROOT_DOMAIN.replace(CONFIG.PORT_REGEX, '');
        return NextResponse.redirect(url, 301);
    }
    
    static handleRoot(req: NextRequest, path: string): NextResponse {
        if (this.isPublicPath(path) || path.startsWith('/auth/')) {
            const cleanPath = path.startsWith('/auth/') ? path.replace('/auth', '') : path;
            const url = new URL(cleanPath, req.url);
            url.hostname = `auth.${CONFIG.ROOT_DOMAIN.replace(CONFIG.PORT_REGEX, '')}`;
            return NextResponse.redirect(url);
        }
        
        return NextResponse.next();
    }
}