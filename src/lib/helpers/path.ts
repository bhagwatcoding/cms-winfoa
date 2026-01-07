import { NextRequest } from "next/server";


export const path = <T extends NextRequest>(r: T) => {
    const { pathname } = r.nextUrl;
    const host = r.headers.get("host") || "";
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
    const subdomain = host.replace(`.${rootDomain}`, "");
    return {
        rootDomain,
        subdomain,
        url: r.nextUrl,
        name: pathname,
        host,
        start: (path: string) => pathname.startsWith(path),
        end: (path: string) => pathname.endsWith(path)
    }
}