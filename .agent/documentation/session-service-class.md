# SessionService Class - Complete Guide

## 🎯 Class-Based Architecture

Session service ab modern **class-based architecture** mein convert ho gaya hai!

## 📦 New Structure

### SessionService Class
All functions ab `SessionService` class ke **static methods** hain.

```typescript
export class SessionService {
  // Session Management
  static async create(userId, userAgent?, ipAddress?): Promise<ISession>
  static async setCookie(token, expiresAt): Promise<void>
  static async delete(token): Promise<void>
  static async logout(): Promise<void>
  static async extend(token): Promise<ISession | null>
  static async cleanupExpired(): Promise<number>
  
  // Session Validation (Cached)
  static async getToken(): Promise<string | null>
  static validate(token): Promise<ISession | null> // Cached
  static getCurrent(): Promise<ISession | null> // Cached
  
  // User Retrieval (Cached)
  static getCurrentUser(): Promise<IUser | null> // Cached
  static async getCurrentUserId(): Promise<string | null>
  
  // Authentication
  static async isAuthenticated(): Promise<boolean>
  static async requireAuth(): Promise<IUser>
  static async requireRole(allowedRoles): Promise<IUser>
  static async hasRole(role): Promise<boolean>
  static async hasAnyRole(roles): Promise<boolean>
  
  // Middleware
  static async getFromRequest(request): Promise<ISession | null>
  static async isRequestAuthenticated(request): Promise<boolean>
  static async protectRoute(request, redirectUrl?): Promise<NextResponse | null>
  static async requireRoleMiddleware(request, allowedRoles, redirectUrl?): Promise<NextResponse | null>
  static createMiddleware(options): Middleware
  
  // Response Helpers
  static unauthorizedResponse(message?): NextResponse
  static forbiddenResponse(message?): NextResponse
}
```

## 🎨 Function Name Updates

### Before → After

| Old Name | New Name | Category |
|----------|----------|----------|
| `createSession` | `SessionService.create` | Session |
| `setSessionCookie` | `SessionService.setCookie` | Session |
| `deleteSession` | `SessionService.delete` | Session |
| `logout` | `SessionService.logout` | Session |
| `extendSession` | `SessionService.extend` | Session |
| `cleanupExpiredSessions` | `SessionService.cleanupExpired` | Session |
| `getSessionToken` | `SessionService.getToken` | Validation |
| `validateSession` | `SessionService.validate` | Validation |
| `getCurrentSession` | `SessionService.getCurrent` | Validation |
| `getCurrentUser` | `SessionService.getCurrentUser` | User |
| `getCurrentUserId` | `SessionService.getCurrentUserId` | User |
| `isAuthenticated` | `SessionService.isAuthenticated` | Auth |
| `requireAuth` | `SessionService.requireAuth` | Auth |
| `requireRole` | `SessionService.requireRole` | Auth |
| `hasRole` | `SessionService.hasRole` | Auth |
| `hasAnyRole` | `SessionService.hasAnyRole` | Auth |
| `getRequestSession` | `SessionService.getFromRequest` | Middleware |
| `isRequestAuthenticated` | `SessionService.isRequestAuthenticated` | Middleware |
| `protectRoute` | `SessionService.protectRoute` | Middleware |
| `requireRoleMiddleware` | `SessionService.requireRoleMiddleware` | Middleware |
| `createSessionMiddleware` | `SessionService.createMiddleware` | Middleware |
| `unauthorizedResponse` | `SessionService.unauthorizedResponse` | Response |
| `forbiddenResponse` | `SessionService.forbiddenResponse` | Response |

## 💡 Usage Examples

### ✅ New Way (Class-Based)

```typescript
import { SessionService } from '@/services/session.service';

// Create session
const session = await SessionService.create(userId, userAgent, ipAddress);
await SessionService.setCookie(session.token, session.expiresAt);

// Get current user
const user = await SessionService.getCurrentUser();

// Require authentication
const user = await SessionService.requireAuth();

// Check role
const isAdmin = await SessionService.hasRole('admin');

// Logout
await SessionService.logout();

// Middleware
const response = await SessionService.protectRoute(request);

// Response helpers
return SessionService.unauthorizedResponse('Please login');
```

### ✅ Backwards Compatible (Old Function Names Still Work!)

```typescript
// Individual function exports bhi available hain
import { 
  getCurrentUser, 
  requireAuth, 
  protectRoute,
  logout 
} from '@/services/session.service';

const user = await getCurrentUser();
await requireAuth();
await protectRoute(request);
await logout();
```

## 🎯 Usage Patterns

### 1. Server Component
```typescript
import { SessionService } from '@/services/session.service';

export default async function ProfilePage() {
  const user = await SessionService.getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <div>Welcome {user.name}</div>;
}
```

### 2. Server Action
```typescript
'use server';

import { SessionService } from '@/services/session.service';

export async function deleteUserAction(userId: string) {
  // Require admin role
  await SessionService.requireRole(['admin']);
  
  // Admin-only logic
  await User.findByIdAndDelete(userId);
  
  return { success: true };
}
```

### 3. API Route
```typescript
import { SessionService } from '@/services/session.service';

export async function GET() {
  const user = await SessionService.getCurrentUser();
  
  if (!user) {
    return SessionService.unauthorizedResponse('Please login');
  }
  
  return Response.json({ user });
}
```

### 4. Middleware
```typescript
import { SessionService } from '@/services/session.service';

export async function middleware(request: NextRequest) {
  // Protect route
  const response = await SessionService.protectRoute(request);
  if (response) return response;
  
  // Get session
  const session = await SessionService.getFromRequest(request);
  console.log('User:', session?.userId);
  
  return NextResponse.next();
}
```

### 5. Login Flow
```typescript
import { SessionService } from '@/services/session.service';

export async function login(email: string, password: string) {
  // Verify credentials
  const user = await User.findOne({ email });
  if (!user || !await verifyPassword(password, user.password)) {
    throw new Error('Invalid credentials');
  }
  
  // Create session
  const session = await SessionService.create(
    user._id.toString(),
    request.headers.get('user-agent'),
    request.headers.get('x-forwarded-for')
  );
  
  // Set cookie
  await SessionService.setCookie(session.token, session.expiresAt);
  
  return { success: true };
}
```

### 6. Logout Flow
```typescript
import { SessionService } from '@/services/session.service';

export async function logoutAction() {
  await SessionService.logout();
  redirect('/login');
}
```

### 7. Protected Page
```typescript
import { SessionService } from '@/services/session.service';

export default async function AdminPage() {
  // Require admin role (throws if not admin)
  const user = await SessionService.requireRole(['admin']);
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user.name}</p>
    </div>
  );
}
```

### 8. Conditional Rendering
```typescript
import { SessionService } from '@/services/session.service';

export default async function HomePage() {
  const user = await SessionService.getCurrentUser();
  const isAdmin = await SessionService.hasRole('admin');
  
  return (
    <div>
      {user ? (
        <p>Welcome {user.name}</p>
      ) : (
        <Link href="/login">Login</Link>
      )}
      
      {isAdmin && (
        <Link href="/admin">Admin Panel</Link>
      )}
    </div>
  );
}
```

## ✅ Benefits

### 1. **Organized Code**
All session methods grouped in one class.

### 2. **Clear Naming**
- `SessionService.create` instead of `createSession`
- `SessionService.getCurrent` instead of `getCurrentSession`
- More consistent and readable

### 3. **Static Methods**
No need to instantiate the class - direct usage:
```typescript
SessionService.getCurrentUser()
```

### 4. **Backwards Compatible**
Old function exports still work for gradual migration.

### 5. **Easy to Find**
All session-related code in one place with autocomplete.

### 6. **Type Safe**
Full TypeScript support with IntelliSense.

## 🔧 Private Constants

Internal constants ab class private members hain:
```typescript
private static readonly COOKIE_NAME = SESSION.COOKIE_NAME;
private static readonly MAX_AGE = SESSION.DURATION * 1000;
```

## 📊 Class Features

### Static Initialization Block
```typescript
static {
  validateSecretStrength(); // Runs on class load
}
```

### Cached Methods
```typescript
static validate = cache(...);
static getCurrent = cache(...);
static getCurrentUser = cache(...);
```

### Method Binding
Backwards compatible exports properly bound:
```typescript
export const getCurrentUser = SessionService.getCurrentUser;
```

## 🎯 Migration Guide

### For New Code
```typescript
// Use class-based approach
import { SessionService } from '@/services/session.service';
await SessionService.getCurrentUser();
```

### For Existing Code
```typescript
// Old imports still work
import { getCurrentUser } from '@/services/session.service';
await getCurrentUser();

// Or gradually migrate to class
import { SessionService } from '@/services/session.service';
await SessionService.getCurrentUser();
```

## 📚 Related Documentation

- **Config Implementation**: `.agent/documentation/config-implementation.md`
- **Session Consolidation**: `.agent/documentation/session-consolidation.md`
- **Session Model Alignment**: `.agent/documentation/session-model-alignment.md`

## ✅ Summary

**SessionService** class provides:
- ✅ Clean, organized API
- ✅ Better naming conventions
- ✅ Static methods (no instantiation needed)
- ✅ Backwards compatible
- ✅ TypeScript autocomplete
- ✅ Cached performance
- ✅ All session logic in one place

**Status**: Class-based architecture implemented! 🚀
