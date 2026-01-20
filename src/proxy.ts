import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Define your God Subdomain
  // For localhost, we often use "god.localhost:3000"
  const isGodDomain = hostname.startsWith("god.");

  // 🛡️ SECURITY: Protect God Routes
  // If someone tries to access /admin paths but isn't on the god subdomain, block them.
  console.log(isGodDomain);
  if (url.pathname.startsWith("/admin") && !isGodDomain) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Pass the "isGod" flag as a header to Server Components (Optional but useful)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-god-mode", isGodDomain ? "true" : "false");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// // middleware.ts
// import { NextResponse } from "next/server";
// import { config as domainConfig, SUBDOMAIN_CONFIG } from "@/config";

// export function middleware(req) {
//   const hostname = req.headers.get("host");
//   const subdomain = hostname.split(".")[0]; // e.g. "god" from god.winfoa.com

//   // 1. Check if public
//   if (domainConfig.isPublic(subdomain)) {
//     return NextResponse.next();
//   }

//   // 2. Mocking getting user role from session
//   const userRole = "student"; // fetch this from your auth session

//   // 3. Check Access
//   if (!domainConfig.hasAccess(userRole, subdomain)) {
//     // Redirect unauthorized users to their main dashboard
//     const newUrl = new URL("http://myaccount.localhost:300");
//     return NextResponse.redirect(newUrl);
//   }

//   return NextResponse.next();
// }
