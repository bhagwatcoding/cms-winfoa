import { NextRequest } from "next/server";
import { ProxyHandler } from "@/shared/proxy";

export default async function proxy(request: NextRequest) {
  return ProxyHandler.execute(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
