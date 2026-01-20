// proxy.ts - Next.js 16 Proxy Entry Point
import { NextRequest } from "next/server";
import { ProxyHandler } from "@/shared/proxy";

export async function proxy(request: NextRequest) {
  return ProxyHandler.execute(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
