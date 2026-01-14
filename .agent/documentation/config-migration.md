# Config Migration Guide

## 📋 Overview

Successfully migrated from scattered constants (`src/shared/lib/constants`) to a centralized, validated configuration system (`src/config`).

## ✅ New Config Structure

```
src/config/
├── index.ts          # Central export
├── env.ts            # Environment validation (Zod)
├── site.ts           # Site & multi-tenancy config
├── auth.ts           # Session & security config
├── db.ts             # Database configuration
└── limits.ts         # Upload, pagination, rate limits
```

## 🎯 Key Improvements

### 1. **Environment Validation**
- ✅ Uses Zod to validate env variables at startup
- ✅ App fails fast with clear error messages if config is invalid
- ✅ Type-safe access to environment variables

### 2. **Multi-Tenancy Support**
- ✅ Proper cookie domain handling (`.localhost` in dev, `.winfoa.com` in prod)
- ✅ Reserved subdomain list
- ✅ Centralized tenant configuration

### 3. **Security**
- ✅ Session secrets validated (minimum 32 characters)
- ✅ HttpOnly cookies configured properly
- ✅ Bcrypt rounds configurable
- ✅ Rate limiting configured

### 4. **Type Safety**
- ✅ All config objects use `as const` for literal types
- ✅ Immutable configuration with `Object.freeze()`
- ✅ No more runtime errors from missing env vars

## 📦 What Was Migrated

### Files Updated:
1. ✅ `src/shared/lib/db.ts` - Now uses `DB` from config
2. ✅ `src/shared/lib/auth/session.ts` - Uses `SESSION` and `TENANCY`
3. ✅ `src/shared/proxy/config.ts` - Uses `SESSION`, `TENANCY`, `RATE_LIMIT`
4. ✅ `.env.local` - Added `NEXT_PUBLIC_ROOT_DOMAIN`

### Configuration Mapping:

| Old Constant | New Config Path | Notes |
|-------------|----------------|-------|
| `MONGODB_URI` | `DB.URI` | From env validation |
| `MONGODB_NAME` | `DB.NAME` | Now: "winfoa_core" |
| `SESSION_COOKIE_NAME` | `SESSION.COOKIE_NAME` | Now: "w_sid" (obscured) |
| `SESSION_MAX_AGE` | `SESSION.DURATION` | In seconds (30 days) |
| `SESSION_SECRET` | `SESSION.SECRET` | Validated (min 32 chars) |
| `ROOT_DOMAIN` | `TENANCY.ROOT_DOMAIN` | From `NEXT_PUBLIC_ROOT_DOMAIN` |
| `IS_PRODUCTION` | `env.NODE_ENV === "production"` | Validated enum |

## 🔧 How to Use

### Import from config:
```typescript
import { SESSION, DB, TENANCY, env } from '@/config';

// Access configuration
const cookieName = SESSION.COOKIE_NAME;
const dbUri = DB.URI;
const isProduction = env.NODE_ENV === 'production';
```

### Set Session Cookie:
```typescript
import { SESSION } from '@/config';

cookies().set(SESSION.COOKIE_NAME, token, SESSION.COOKIE_OPTIONS);
```

## ⚠️ Breaking Changes

### Cookie Name Changed:
- **Old**: `auth_session`
- **New**: `w_sid` (more secure, obscured name)

**Action Required**: Users will need to log in again after deployment.

### Cookie Domain Strategy:
- **Dev**: `undefined` (localhost handles cookies differently)
- **Prod**: `.winfoa.com` (allows cross-subdomain SSO)

## 📝 Environment Variables Required

```bash
# Required
NODE_ENV=development|production|test
MONGODB_URI=mongodb://localhost:27017/winfoa
SESSION_SECRET=<minimum 32 characters>
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Next Steps

### Files Still Using Old Constants (To Migrate):

Found 40+ files using `SESSION_COOKIE_NAME` directly:
- `src/features/auth/services/session.service.ts`
- `src/app/api/auth/token/route.ts`
- `src/shared/lib/session/index.ts`
- `src/shared/lib/auth.ts`
- And more...

### Migration Strategy:

1. **Phase 1** (✅ Complete):
   - Core database connection
   - Main session management
   - Proxy configuration

2. **Phase 2** (Next):
   - Update all auth-related services
   - Update API routes
   - Update features

3. **Phase 3** (Future):
   - Deprecate old constants entirely
   - Remove `src/shared/lib/constants/app.ts`

## 🧪 Testing Checklist

- [ ] Dev server starts without env errors
- [ ] Login creates session with new cookie name
- [ ] Session persists across page refreshes
- [ ] Subdomain routing works correctly
- [ ] Database connection successful
- [ ] Cookie domain set correctly (dev vs prod)

## 📚 Resources

- Config location: `src/config/`
- TypeScript path alias: `@/config`
- Zod validation: `src/config/env.ts`
- Multi-tenancy docs: `src/config/site.ts` (comments)
