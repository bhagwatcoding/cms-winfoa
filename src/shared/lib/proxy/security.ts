// lib/proxy/security.ts
import { NextRequest, NextResponse } from 'next/server';
import { geolocation } from '@vercel/functions';
import { CONFIG } from './config';

export class Security {
    static applyHeaders(response: NextResponse): void {
        // Apply security headers
        Object.entries(CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        
        // Apply CSP
        response.headers.set('Content-Security-Policy', CONFIG.CSP);
    }
    
    static async checkGeoBlocking(request: NextRequest): Promise<boolean> {
        if (!CONFIG.IS_PROD || CONFIG.BLOCKED_COUNTRIES.size === 0) {
            return true; // Allow
        }
        
        try {
            const geo = geolocation(request);
            if (geo?.country && CONFIG.BLOCKED_COUNTRIES.has(geo.country)) {
                return false; // Block
            }
        } catch {
            // Geolocation not available, allow
        }
        
        return true; // Allow by default
    }
    
    static isBot(userAgent: string | null): boolean {
        if (!userAgent) return false;
        return CONFIG.BOT_REGEX.test(userAgent);
    }

    static getClientIP(request: NextRequest): string {
        // Try x-forwarded-for header
        const forwardedFor = request.headers.get('x-forwarded-for');
        if (forwardedFor) {
            const ip = forwardedFor.split(',')[0].trim();
            if (ip) return ip;
        }

        // Try x-real-ip header
        const realIp = request.headers.get('x-real-ip');
        if (realIp) return realIp;

        // Otherwise fallback to localhost
        return '127.0.0.1';
    }

    
    static validateRedirectUrl(redirectUrl: string, rootDomain: string): boolean {
        try {
            const url = new URL(redirectUrl);
            return url.hostname.endsWith(rootDomain);
        } catch {
            return false;
        }
    }
}