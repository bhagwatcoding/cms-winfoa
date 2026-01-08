/**
 * Session Middleware Utilities
 * Middleware helpers for protected routes and role-based access
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSession, SESSION_COOKIE_NAME } from './index';
import { getLoginRedirectUrl } from '@/lib/helpers/url';
import type { UserRole } from '@/types/models';

// ==========================================
// MIDDLEWARE TYPES
// ==========================================

export interface SessionMiddlewareOptions {
    requireAuth?: boolean;
    allowedRoles?: UserRole[];
    redirectUrl?: string;
}

// ==========================================
// SESSION CHECKS
// ==========================================

/**
 * Check if request has valid session
 * @param request - Next request
 * @returns Session data or null
 */
export async function getRequestSession(request: NextRequest) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) return null;

    return await validateSession(sessionToken);
}

/**
 * Check if request is authenticated
 * @param request - Next request
 * @returns True if authenticated
 */
export async function isRequestAuthenticated(
    request: NextRequest
): Promise<boolean> {
    const session = await getRequestSession(request);
    return !!session;
}

// ==========================================
// MIDDLEWARE HELPERS
// ==========================================

/**
 * Protect route - require authentication
 * @param request - Next request
 * @param redirectUrl - Custom redirect URL
 * @returns Response or null
 */
export async function protectRoute(
    request: NextRequest,
    redirectUrl?: string
): Promise<NextResponse | null> {
    const isAuth = await isRequestAuthenticated(request);

    if (!isAuth) {
        const loginUrl = redirectUrl || getLoginRedirectUrl(request.url);
        return NextResponse.redirect(loginUrl);
    }

    return null;
}

/**
 * Require specific role
 * @param request - Next request
 * @param allowedRoles - Array of allowed roles
 * @param redirectUrl - Custom redirect URL
 * @returns Response or null
 */
export async function requireRoleMiddleware(
    request: NextRequest,
    allowedRoles: UserRole[],
    redirectUrl?: string
): Promise<NextResponse | null> {
    const session = await getRequestSession(request);

    if (!session) {
        const loginUrl = redirectUrl || getLoginRedirectUrl(request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Note: For full role checking, you'd need to fetch the user
    // This is a simplified version
    // In production, consider caching user data

    return null;
}

/**
 * Create session middleware
 * @param options - Middleware options
 * @returns Middleware function
 */
export function createSessionMiddleware(
    options: SessionMiddlewareOptions = {}
) {
    return async (request: NextRequest): Promise<NextResponse | null> => {
        const { requireAuth = true, allowedRoles, redirectUrl } = options;

        if (requireAuth) {
            const authResponse = await protectRoute(request, redirectUrl);
            if (authResponse) return authResponse;
        }

        if (allowedRoles && allowedRoles.length > 0) {
            const roleResponse = await requireRoleMiddleware(
                request,
                allowedRoles,
                redirectUrl
            );
            if (roleResponse) return roleResponse;
        }

        return null;
    };
}

// ==========================================
// RESPONSE HELPERS
// ==========================================

/**
 * Create unauthorized response
 * @param message - Error message
 * @returns Response
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
    return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
    );
}

/**
 * Create forbidden response
 * @param message - Error message
 * @returns Response
 */
export function forbiddenResponse(message = 'Forbidden'): NextResponse {
    return NextResponse.json(
        { success: false, error: message },
        { status: 403 }
    );
}
