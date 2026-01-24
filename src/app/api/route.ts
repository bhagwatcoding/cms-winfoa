import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Winfoa Platform API",
    version: "2.0.0",
    description: "Complete multi-subdomain web development platform API",
    platform: {
      name: "Winfoa",
      architecture: "Multi-Subdomain Full-Stack Application",
      technology: "Next.js 16 + TypeScript + MongoDB",
      subdomains: 6,
    },
    subdomains: {
      auth: {
        url: "http://auth.localhost:3000",
        description: "Authentication Portal",
        endpoints: [
          "POST /api/auth/login",
          "POST /api/auth/register",
          "POST /api/auth/logout",
          "POST /api/auth/forgot-password",
          "POST /api/auth/reset-password",
          "GET /api/auth/session",
          "POST /api/auth/refresh",
        ],
      },
      ump: {
        url: "http://ump.localhost:3000",
        description: "User Management Platform",
        endpoints: [
          "GET /api/users",
          "POST /api/users",
          "PUT /api/users/:id",
          "DELETE /api/users/:id",
          "GET /api/roles",
          "POST /api/roles",
          "GET /api/permissions",
          "POST /api/permissions/assign",
        ],
      },
      myaccount: {
        url: "http://myaccount.localhost:3000",
        description: "Personal Account Management",
        endpoints: [
          "GET /api/profile",
          "PUT /api/profile",
          "GET /api/security",
          "PUT /api/security/password",
          "GET /api/notifications",
          "PUT /api/notifications/settings",
          "GET /api/privacy",
          "PUT /api/privacy/settings",
        ],
      },
      god: {
        url: "http://god.localhost:3000",
        description: "Super Admin Control Panel",
        endpoints: [
          "GET /api/god/analytics",
          "GET /api/god/users",
          "GET /api/god/system",
        ],
      },
    },
  });
}
