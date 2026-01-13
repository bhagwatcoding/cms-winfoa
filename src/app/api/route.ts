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
      subdomains: 8,
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
      academy: {
        url: "http://academy.localhost:3000",
        description: "Learning Academy Platform",
        endpoints: [
          "GET /api/courses",
          "POST /api/courses",
          "GET /api/students",
          "POST /api/students",
          "GET /api/certificates",
          "POST /api/certificates/generate",
          "GET /api/exams",
          "POST /api/exams/submit",
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
      provider: {
        url: "http://provider.localhost:3000",
        description: "Service Provider Portal",
        endpoints: [
          "GET /api/services",
          "POST /api/services",
          "GET /api/clients",
          "POST /api/clients",
          "GET /api/contracts",
          "POST /api/contracts",
          "GET /api/billing",
          "POST /api/billing/invoice",
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
      wallet: {
        url: "http://wallet.localhost:3000",
        description: "Digital Wallet & Payments",
        endpoints: [
          "GET /api/wallet/balance",
          "POST /api/wallet/recharge",
          "POST /api/wallet/transfer",
          "GET /api/wallet/transactions",
          "POST /api/wallet/pay-bill",
          "GET /api/wallet/payment-methods",
          "POST /api/wallet/add-payment-method",
        ],
      },
      developer: {
        url: "http://developer.localhost:3000",
        description: "Developer Tools & Documentation",
        endpoints: [
          "GET /api/dev/keys",
          "POST /api/dev/keys/generate",
          "DELETE /api/dev/keys/:id",
          "GET /api/dev/usage",
          "GET /api/dev/docs",
          "GET /api/dev/sdk",
          "POST /api/dev/test",
        ],
      },
      api: {
        url: "http://api.localhost:3000",
        description: "Central API Gateway",
        endpoints: [
          "GET /api",
          "GET /api/health",
          "GET /api/status",
          "GET /api/docs",
          "GET /api/endpoints",
          "POST /api/webhook",
        ],
      },
    },
    coreEndpoints: {
      health: {
        endpoint: "/api/health",
        method: "GET",
        description: "System health check",
      },
      status: {
        endpoint: "/api/status",
        method: "GET",
        description: "Platform operational status",
      },
      docs: {
        endpoint: "/api/docs",
        method: "GET",
        description: "Interactive API documentation",
      },
    },
    features: [
      "Multi-subdomain architecture",
      "Centralized authentication",
      "Role-based access control",
      "Digital wallet integration",
      "Course management system",
      "User administration",
      "Provider management",
      "Developer tools & APIs",
      "Real-time notifications",
      "Secure payment processing",
    ],
    authentication: {
      type: "JWT + Session",
      endpoints: {
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        refresh: "POST /api/auth/refresh",
      },
      headers: {
        authorization: "Bearer <token>",
        "content-type": "application/json",
      },
    },
    rateLimit: {
      authenticated: "1000 requests/hour",
      unauthenticated: "100 requests/hour",
      developer: "10000 requests/hour",
    },
    documentation: {
      interactive: "http://api.localhost:3000/docs",
      postman: "http://api.localhost:3000/postman",
      sdk: "http://developer.localhost:3000/sdk",
    },
    support: {
      email: "api-support@winfoa.com",
      docs: "http://developer.localhost:3000/support",
      status: "http://api.localhost:3000/status",
    },
    timestamp: new Date().toISOString(),
    status: "operational",
    uptime: "99.9%",
    environment: process.env.NODE_ENV || "development",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "This endpoint only supports GET requests",
      allowedMethods: ["GET"],
    },
    { status: 405 },
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "This endpoint only supports GET requests",
      allowedMethods: ["GET"],
    },
    { status: 405 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: "Method not allowed",
      message: "This endpoint only supports GET requests",
      allowedMethods: ["GET"],
    },
    { status: 405 },
  );
}
