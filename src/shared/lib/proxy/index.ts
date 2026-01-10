// lib/proxy/index.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './config';
import { RateLimiter } from './rate-limiter';
import { Security } from './security';
import { SubdomainRouter } from './subdomain';

export class ProxyHandler extends SubdomainRouter{
    static async execute(request: NextRequest): Promise<NextResponse> {
        const path = request.nextUrl.pathname;

        // Early exit for static assets
        if (this.isStaticPath(path)) {
            return NextResponse.next();
        }

        // =================================================================
        // SECURITY CHECKS
        // =================================================================

        // 1. Geo-blocking
        const geoAllowed = await Security.checkGeoBlocking(request);
        if (!geoAllowed) {
            return new NextResponse('Access denied', { status: 403 });
        }

        // 2. Bot detection
        const userAgent = request.headers.get('user-agent');
        const isBot = Security.isBot(userAgent);

        // 3. Rate limiting (skip for bots)
        if (!isBot) {
            const clientIP = Security.getClientIP(request);
            const { allowed, remaining } = RateLimiter.check(clientIP);

            if (!allowed) {
                const response = new NextResponse('Too many requests', {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil(CONFIG.RATE_LIMIT.BLOCK_DURATION_MS / 1000))
                    }
                });
                Security.applyHeaders(response);
                return response;
            }

            // Add rate limit headers
            request.headers.set('X-RateLimit-Limit', String(CONFIG.RATE_LIMIT.MAX_REQUESTS));
            request.headers.set('X-RateLimit-Remaining', String(remaining));
        }

        // =================================================================
        // ROUTING
        // =================================================================

        const hostname = request.headers.get('host') || '';
        const subdomain = this.getSubdomain(hostname);
        const authed = this.isAuthenticated(request);

        let response: NextResponse;
        switch (subdomain) {
            case 'provider': response = this.handleProvider(request, path, authed); break;
            case 'ump': response = this.handleUmp(request, path, authed); break;
            case 'skills': response = this.handleSkills(request, path, authed); break;
            case 'api': response = this.handleApi(request, path); break;
            case 'auth': response = this.handleAuth(request, path, authed); break;
            case 'myaccount': response = this.handleMyAccount(request, path, authed); break;
            case 'wallet': response = this.handleWallet(request, path, authed); break;
            case 'www': response = this.handleRoot(request, path); break;
            default: response = this.handleRoot(request, path);
        }

        // =================================================================
        // APPLY SECURITY HEADERS
        // =================================================================

        Security.applyHeaders(response);

        // =================================================================
        // DEBUG HEADERS (Development only)
        // =================================================================

        if (!CONFIG.IS_PROD) {
            response.headers.set('X-Subdomain', subdomain || 'root');
            response.headers.set('X-Path', path);
            response.headers.set('X-Authed', String(authed));
            response.headers.set('X-Client-IP', Security.getClientIP(request));
            response.headers.set('X-Is-Bot', String(isBot));
        }

        return response;
    }
}