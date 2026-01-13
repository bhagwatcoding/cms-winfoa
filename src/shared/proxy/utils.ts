// lib/proxy/utils.ts
import { NextRequest } from "next/server";
import { CONFIG } from "./config";

export class ProxyUtils {
  static parseSubdomain(hostname: string): string | null {
    const root = CONFIG.ROOT_DOMAIN.replace(/:3000$/, "");
    const host = hostname.replace(/:3000$/, "");

    if (host === root) return null;

    // Check if it ends with root domain
    if (!host.endsWith(`.${root}`)) return null;

    return host.replace(`.${root}`, "");
  }

  static isStaticAsset(path: string): boolean {
    return CONFIG.ASSETS.some((prefix) => path.startsWith(prefix));
  }

  static isAuthenticated(req: NextRequest): boolean {
    return !!req.cookies.get(CONFIG.AUTH_COOKIE);
  }

  // URL Factory
  static buildUrl(req: NextRequest, path: string, subdomain?: string): URL {
    const url = new URL(path, req.url);
    const root = CONFIG.ROOT_DOMAIN.replace(/:3000$/, "");
    url.hostname = subdomain ? `${subdomain}.${root}` :  root;
    return url;
  }
}
