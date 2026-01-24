/**
 * URL Helper Functions for Subdomain-Based Routing
 * Generates correct URLs for multi-tenant subdomain architecture
 */
import { env } from "@/config/env";
import { SUBDOMAIN_TYPES, type SubDomainType } from "@/core/constants/subdomains";

export type { SubDomainType };

/**
 * Generate a full subdomain URL
 * 
 * @param subdomain - The subdomain identifier
 * @param path - The path to append (default: '/')
 * @returns Full URL with subdomain
 * 
 * @example
 * // Development
 * getSubdomainUrl('auth', '/login')
 * // → http://auth.localhost:3000/login
 * 
 * // Production
 * getSubdomainUrl('god', '/dashboard')
 * // → https://god.yourdomain.com/dashboard
 */
export function getSubdomainUrl(
    subdomain: SubDomainType | string,
    path: string = '/'
): string {
    const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
    const protocol = env.NODE_ENV === 'production' ? 'https' : 'http';

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Handle root/www subdomain
    if (subdomain === 'www' || subdomain === 'root') {
        return `${protocol}://${rootDomain}${normalizedPath}`;
    }

    // Extract domain and port
    const [domain, port] = rootDomain.split(':');
    const portSuffix = port ? `:${port}` : '';

    // Build subdomain URL
    return `${protocol}://${subdomain}.${domain}${portSuffix}${normalizedPath}`;
}

/**
 * Get auth subdomain URL (shortcut)
 * 
 * @param path - Path to append
 * @returns Auth subdomain URL
 */
export function getAuthUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.AUTH, path);
}

/**
 * Get god panel URL (shortcut)
 * 
 * @param path - Path to append
 * @returns God subdomain URL
 */
export function getGodUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.GOD, path);
}

/**
 * Get UMP URL (shortcut)
 * 
 * @param path - Path to append
 * @returns UMP subdomain URL
 */
export function getUmpUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.UMP, path);
}

/**
 * Get MyAccount URL (shortcut)
 * 
 * @param path - Path to append
 * @returns MyAccount subdomain URL
 */
export function getMyAccountUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.MYACCOUNT, path);
}

/**
 * Get Wallet URL (shortcut)
 * 
 * @param path - Path to append
 * @returns Wallet subdomain URL
 */
export function getWalletUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.WALLET, path);
}

/**
 * Get API URL (shortcut)
 * 
 * @param path - Path to append
 * @returns API subdomain URL
 */
export function getApiUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.API, path);
}

/**
 * Get root domain URL (shortcut)
 * 
 * @param path - Path to append
 * @returns Root domain URL
 */
export function getRootUrl(path: string = '/'): string {
    return getSubdomainUrl(SUBDOMAIN_TYPES.ROOT, path);
}

/**
 * Get current subdomain from hostname
 * 
 * @param hostname - The hostname to parse
 * @returns Current subdomain or null
 */
export function getCurrentSubdomain(hostname: string): SubDomainType | null {
    const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;

    // Clean hostname and root domain (remove port)
    const cleanHost = hostname.replace(/:\d+$/, '');
    const cleanRoot = rootDomain.replace(/:\d+$/, '');

    // If exact match, no subdomain
    if (cleanHost === cleanRoot) {
        return null;
    }

    // Extract subdomain
    if (cleanHost.endsWith(`.${cleanRoot}`)) {
        const subdomain = cleanHost.replace(`.${cleanRoot}`, '');

        // Validate subdomain against known types
        const validSubdomains = Object.values(SUBDOMAIN_TYPES);
        if (validSubdomains.includes(subdomain as SubDomainType)) {
            return subdomain as SubDomainType;
        }
    }

    return null;
}

/**
 * Build login redirect URL with return path
 * 
 * @param returnUrl - URL to return to after login
 * @returns Auth login URL with redirect param
 */
export function getLoginRedirectUrl(returnUrl: string): string {
    const loginPath = `/login?redirect=${encodeURIComponent(returnUrl)}`;
    return getAuthUrl(loginPath);
}

/**
 * Build role-based dashboard URL
 * 
 * @param role - User role
 * @returns Dashboard URL for the role
 */
export function getDashboardUrlForRole(
    role: string
): string {
    switch (role) {
        case 'super-admin':
            return getGodUrl('/');
        case 'admin':
            return getUmpUrl('/');
        case 'user':
            return getMyAccountUrl('/');
        default:
            return getMyAccountUrl('/');
    }
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
    return env.NODE_ENV === 'production';
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
    return env.NODE_ENV === 'development';
}
