// lib/proxy/router.ts
import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "./config";
import { ProxyUtils } from "./utils";

export class AppRouter extends ProxyUtils {
  static async handle(
    req: NextRequest,
    subdomain: string | null,
  ): Promise<NextResponse> {
    const path = req.nextUrl.pathname;
    const PUBLIC_PATHS = CONFIG.PUBLIC_PATHS;
    const APP = CONFIG.SUBDOMAINS.APP as readonly string[];
    const AUTH = CONFIG.SUBDOMAINS.AUTH;
    const API = CONFIG.SUBDOMAINS.API;

    // 1. API Handling in if url not found then return 404 and {status: 404, message: "Not Found"}
    if (subdomain === API) {
      const apiUrl = this.buildUrl(req, `/api${path}`);   
      return NextResponse.rewrite(apiUrl);
    }

    // 2. Auth Subdomain Handling
    if (subdomain === AUTH) return NextResponse.rewrite(this.buildUrl(req, `/auth${path}`));

    // 3. Main App Subdomains (ump, provider, etc.)
    if (subdomain && APP.includes(subdomain)) {
      const isAuthed = this.isAuthenticated(req);
      const isPublic = PUBLIC_PATHS.has(path);

      // Force Login
      if (!isAuthed && !isPublic) {
        const loginUrl = this.buildUrl(req, "/login", "auth");
        loginUrl.searchParams.set("redirect", req.url);
        return NextResponse.redirect(loginUrl);
      }

      // Rewrite to specific folder (e.g., /provider/dashboard)
      return NextResponse.rewrite(this.buildUrl(req, `/${subdomain}${path}`));
    }

    // 4. Root Domain (Landing Page)
    if (!subdomain || subdomain === "www") return NextResponse.next();

    // 404 for unknown subdomains
    return new NextResponse(null, { status: 404 });
  }
}
