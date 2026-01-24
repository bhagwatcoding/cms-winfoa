# Copilot Instructions for Winfoa Platform

## Architecture Overview

**Multi-Subdomain Next.js Application** with 8 specialized subdomains (auth, myaccount, wallet, ump, god, api, etc.), each serving distinct business domains. Uses App Router, TypeScript, Tailwind CSS, MongoDB, and Next.js 16+.

### Key Architectural Decisions

- **Subdomain-based Routing**: Middleware (`src/middleware.ts`) detects subdomain from request and routes accordingly. Each subdomain has dedicated security config (auth requirements, rate limits, CSRF protection).
- **Role-Based Access Control (RBAC)**: Three roles defined in `src/config/subdomains.ts`: "god" (super-admin), "admin", "user". Check `SUBDOMAIN_ACCESS_BY_ROLE` mapping before modifying access control.
- **Monorepo Structure**: All subdomains live in single Next.js app, not separate packages. Features are organized in `src/features/{feature-name}/` with corresponding app routes in `src/app/{subdomain}/`.
- **DB-First Session Management**: Sessions stored in MongoDB (not JWT). See `src/core/auth.ts` for session creation/validation logic.

## Essential File References

| File | Purpose |
|------|---------|
| [src/middleware.ts](src/middleware.ts) | Subdomain detection, auth enforcement, security headers |
| [src/config/subdomains.ts](src/config/subdomains.ts) | Subdomain definitions, role mapping, access control |
| [src/core/auth.ts](src/core/auth.ts) | `createSession()`, `getSession()`, `requireAuth()`, password hashing |
| [src/core/api/api-handler.ts](src/core/api/api-handler.ts) | API route wrapper with DB connection, error handling |
| [src/config/env.ts](src/config/env.ts) | Environment validation (use for new env vars) |
| [src/features/{feature}/](src/features/) | Feature modules: auth, dashboard, wallet, etc. |

## Coding Patterns

### API Routes
Always wrap with `apiHandler()` for automatic DB connection + error handling:
```typescript
// src/app/api/users/route.ts
import { apiHandler } from '@/core/api';
export const GET = apiHandler(async (req) => {
  const users = await User.find();
  return ApiHelper.success(users);
});
```

### Authentication in Server Components
Use `requireAuth()` + `getCurrentUser()` at route level:
```typescript
import { requireAuth } from '@/core/auth';
export default async function Page() {
  const session = await requireAuth();
  // page is now protected
}
```

### Subdomain-Specific Routes
Routes in `src/app/{subdomain}/` are automatically routed by middleware. Add permission checks in middleware BEFORE route execution.

### Database Models
Models in `src/core/db/models/`. Use Mongoose. Always validate input with schemas in `src/config/validation.ts`.

## Development Workflows

| Task | Command | Notes |
|------|---------|-------|
| **Dev Server** | `npm run dev` | Turbo mode enabled; watches all subdomains |
| **Type Check** | `npm run type-check` | Required before commits |
| **Lint & Fix** | `npm run lint:fix` | ESLint + TypeScript rules |
| **Tests** | `npm run test` / `npm run test:watch` | Jest configured |
| **Build** | `npm run build:optimize` | Production build with optimizations |
| **Performance Audit** | `npm run perf:audit` | Bundle analysis + Lighthouse |
| **Pre-commit** | Husky runs `npm run pre-commit` | Linting + type-check + test:ci |

## Import Paths & Aliases

TypeScript path aliases (from `tsconfig.json`):
- `@/` → `src/` (root imports)
- Always use `@/` for absolute imports; avoid relative paths in large files

## Security & Rate Limiting

Each subdomain has security config in `middleware.ts`:
- **GOD** subdomain: "god" role required, 100 req/15min
- **WALLET** subdomain: CSRF protection enabled, 150 req/15min (stricter for payments)
- **AUTH** subdomain: Public but rate-limited to 50 req/15min

Session cookie is httpOnly + secure. Check `src/config/auth.ts` for session expiration (defaults to 24h).

## Common Tasks

### Add New API Endpoint
1. Create route in `src/app/api/{feature}/route.ts`
2. Wrap with `apiHandler()`, use `ApiHelper.success()` for responses
3. Add DB connection check inside handler

### Add Feature Across Subdomain
1. Create folder in `src/features/{feature}/`
2. Create corresponding routes in `src/app/{subdomain}/pages/`
3. Update middleware security config if new access control needed
4. Reference in feature's `index.ts` for clean exports

### Update Environment Variables
1. Add to `.env.local`
2. Update `src/config/env.ts` schema + validation
3. Use `env.VARIABLE_NAME` throughout codebase

### Modify Authentication Rules
1. Check `SUBDOMAIN_ACCESS_BY_ROLE` in `src/config/subdomains.ts`
2. Update middleware security config for rate limits/headers
3. Verify `requireAuth()` call in protected routes
