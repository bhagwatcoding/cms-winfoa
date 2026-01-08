/**
 * URL Helper Functions for Subdomain-Based Routing
 * Generates correct URLs for multi-tenant subdomain architecture
 */

export type SubdomainType = 'auth' | 'god' | 'ump' | 'skills' | 'myaccount' | 'api' | 'www' | 'root';

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
    subdomain: SubdomainType,
    path: string = '/'
): string {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

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
 * 
 * @example
 * getAuthUrl('/login')
 * // → http://auth.localhost:3000/login
 */
export function getAuthUrl(path: string = '/'): string {
    return getSubdomainUrl('auth', path);
}

/**
 * Get god panel URL (shortcut)
 * 
 * @param path - Path to append
 * @returns God subdomain URL
 */
export function getGodUrl(path: string = '/'): string {
    return getSubdomainUrl('god', path);
}

/**
 * Get UMP URL (shortcut)
 * 
 * @param path - Path to append
 * @returns UMP subdomain URL
 */
export function getUmpUrl(path: string = '/'): string {
    return getSubdomainUrl('ump', path);
}

/**
 * Get Skills portal URL (shortcut)
 * 
 * @param path - Path to append
 * @returns Skills subdomain URL
 */
export function getSkillsUrl(path: string = '/'): string {
    return getSubdomainUrl('skills', path);
}

/**
 * Get MyAccount URL (shortcut)
 * 
 * @param path - Path to append
 * @returns MyAccount subdomain URL
 */
export function getMyAccountUrl(path: string = '/'): string {
    return getSubdomainUrl('myaccount', path);
}

/**
 * Get API URL (shortcut)
 * 
 * @param path - Path to append
 * @returns API subdomain URL
 */
export function getApiUrl(path: string = '/'): string {
    return getSubdomainUrl('api', path);
}

/**
 * Get root domain URL (shortcut)
 * 
 * @param path - Path to append
 * @returns Root domain URL
 */
export function getRootUrl(path: string = '/'): string {
    return getSubdomainUrl('root', path);
}

/**
 * Get current subdomain from hostname
 * 
 * @param hostname - The hostname to parse
 * @returns Current subdomain or null
 * 
 * @example
 * getCurrentSubdomain('god.localhost:3000')
 * // → 'god'
 * 
 * getCurrentSubdomain('localhost:3000')
 * // → null
 */
export function getCurrentSubdomain(hostname: string): SubdomainType | null {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

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

        // Validate subdomain
        const validSubdomains: SubdomainType[] = ['auth', 'god', 'ump', 'skills', 'myaccount', 'api', 'www'];
        if (validSubdomains.includes(subdomain as SubdomainType)) {
            return subdomain as SubdomainType;
        }
    }

    return null;
}

/**
 * Build login redirect URL with return path
 * 
 * @param returnUrl - URL to return to after login
 * @returns Auth login URL with redirect param
 * 
 * @example
 * getLoginRedirectUrl('http://god.localhost:3000/dashboard')
 * // → http://auth.localhost:3000/login?redirect=http%3A%2F%2Fgod.localhost%3A3000%2Fdashboard
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
    role: 'super-admin' | 'admin' | 'staff' | 'student' | 'user' | 'center'
): string {
    switch (role) {
        case 'super-admin':
            return getGodUrl('/');
        case 'admin':
        case 'staff':
            return getUmpUrl('/');
        case 'student':
            return getSkillsUrl('/');
        case 'center':
            return getSkillsUrl('/center');
        case 'user':
        default:
            return getMyAccountUrl('/');
    }
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Get full API endpoint URL
 * 
 * @param endpoint - API endpoint path (e.g., '/users', '/courses')
 * @returns Full API URL
 * 
 * @example
 * getApiEndpoint('/users')
 * // → http://api.localhost:3000/users
 */
export function getApiEndpoint(endpoint: string): string {
    return getApiUrl(endpoint);
}
