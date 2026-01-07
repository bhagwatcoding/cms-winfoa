import { NextRequest } from 'next/server';
import { SubdomainProxy } from './shared/lib/proxy';

// Next.js 16 proxy function (named export required)
export async function proxy(request: NextRequest) {
    return await SubdomainProxy.execute(request);
}

// Proxy configuration
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