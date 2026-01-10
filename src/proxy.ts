// proxy.ts - Next.js 16 Proxy Entry Point
// export const runtime = process.env.NEXT_RUNTIME?.toString();

import { NextResponse } from 'next/server';
// import { ProxyHandler } from '@/lib/proxy';

export default async function proxy(): Promise<NextResponse> {
    // return await ProxyHandler.execute(request);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)',
    ],
};