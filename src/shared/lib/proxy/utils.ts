// lib/proxy/utils.ts
import { NextRequest } from 'next/server';
import { CONFIG, SubdomainType } from './config';

export class ProxyUtils {
    static getSubdomain(hostname: string): SubdomainType {
        const cleanHost = CONFIG.PORT_REGEX.test(hostname) 
            ? hostname.slice(0, -5) 
            : hostname;
        
        const cleanRoot = CONFIG.PORT_REGEX.test(CONFIG.ROOT_DOMAIN)
            ? CONFIG.ROOT_DOMAIN.slice(0, -5)
            : CONFIG.ROOT_DOMAIN;
        
        if (cleanHost === cleanRoot) return null;
        
        const match = cleanHost.match(CONFIG.SUBDOMAIN_REGEX);
        if (!match || match[2] !== cleanRoot) return null;
        
        const subdomain = match[1];
        
        return CONFIG.VALID_SUBDOMAINS.has(subdomain) 
            ? subdomain as SubdomainType 
            : null;
    }
    
    static isStaticPath(path: string): boolean {
        if (path[0] !== '/') return false;
        
        for (const prefix of CONFIG.STATIC_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }
    
    static isPublicPath(path: string): boolean {
        return CONFIG.PUBLIC_PATHS.has(path);
    }
    
    static isAuthenticated(request: NextRequest): boolean {
        const cookie = request.cookies.get(CONFIG.AUTH_COOKIE);
        return !!(cookie?.value);
    }
    
    static buildUrl(base: string, path: string, request: NextRequest): URL {
        const fullPath = path === '/' ? '' : path;
        return new URL(`${base}${fullPath}`, request.url);
    }
    
    static buildAuthUrl(request: NextRequest, path: string = '/login'): URL {
        const url = new URL(path, request.url);
        url.hostname = `auth.${CONFIG.ROOT_DOMAIN.replace(CONFIG.PORT_REGEX, '')}`;
        return url;
    }
}
