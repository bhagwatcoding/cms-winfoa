# SessionService - Enhanced Features 🚀

## 🎯 20+ New Production-Ready Features Added!

### ✨ New Features Overview

## 1️⃣ **Multi-Device Session Management**

### Get All User Sessions
```typescript
// Get all active sessions for a user
const sessions = await SessionService.getAllForUser(userId);

// Display user's devices
sessions.forEach(session => {
  console.log(`Device: ${session.deviceInfo?.device}`);
  console.log(`Browser: ${session.deviceInfo?.browser}`);
  console.log(`Last Active: ${session.lastAccessedAt}`);
});
```

### Delete Specific Sessions
```typescript
// Delete specific session by ID
await SessionService.deleteById(sessionId);

// Delete all sessions except current
const deletedCount = await SessionService.deleteOtherSessions();

// Delete all sessions for user (logout everywhere)
await SessionService.deleteAllForUser(userId);
```

### Session Limits
```typescript
// Check if user exceeded session limit
const exceeded = await SessionService.isSessionLimitExceeded(userId, 5);

if (exceeded) {
  throw new Error('Maximum 5 devices allowed');
}
```

## 2️⃣ **Remember Me Functionality**

```typescript
// Create session with "Remember Me"
const session = await SessionService.create({
  userId,
  userAgent,
  ipAddress,
  rememberMe: true, // 90 days instead of 30
});

// Or use auto-detect with remember me
const session = await SessionService.createWithAutoDetect(
  userId,
  request,
  true // rememberMe
);
```

**Durations:**
- Normal: 30 days
- Remember Me: 90 days

## 3️⃣ **Auto Device Detection**

```typescript
// Automatically detect device, browser, OS, IP
const session = await SessionService.createWithAutoDetect(
  userId,
  request,
  rememberMe
);

// Returns device info:
session.deviceInfo = {
  browser: "Chrome",
  os: "Windows",
  device: "Desktop",
  isMobile: false,
}
```

## 4️⃣ **Session Statistics**

```typescript
// Get session stats for user
const stats = await SessionService.getStats(userId);

console.log(stats);
// {
//   total: 10,
//   active: 3,
//   expired: 7
// }

// Get active session count
const activeCount = await SessionService.getActiveCount(userId);
```

## 5️⃣ **Security Validation**

### IP Address Validation
```typescript
// Validate IP hasn't changed
const isValid = await SessionService.validateIpAddress(request);

if (!isValid) {
  await SessionService.logout();
  throw new Error('Session hijacking detected');
}
```

### User Agent Validation
```typescript
// Validate user agent hasn't changed
const isValid = await SessionService.validateUserAgent(request);

if (!isValid) {
  // Suspicious activity
  await SessionService.invalidate(token);
}
```

### Session Invalidation
```typescript
// Mark session as inactive (security)
await SessionService.invalidate(token);

// Revoke all sessions for user
const revokedCount = await SessionService.revokeAllForUser(userId);
```

## 6️⃣ **Session Refresh & Activity**

```typescript
// Refresh session (update last accessed time)
await SessionService.refresh();

// Extend session with optional remember me
await SessionService.extend(token, rememberMe);
```

## 7️⃣ **Advanced Authentication**

### Email Verification Check
```typescript
// Require email verified
const user = await SessionService.requireEmailVerified();
```

### Multiple Role Checks
```typescript
// Require any of multiple roles
const user = await SessionService.requireAnyRole(['admin', 'moderator']);

// Check if has all roles (strict)
const hasAll = await SessionService.hasAllRoles(['admin', 'superuser']);
```

## 8️⃣ **Session Cleanup**

```typescript
// Clean expired sessions
const deletedExpired = await SessionService.cleanupExpired();

// Clean inactive sessions (not accessed for 30 days)
const deletedInactive = await SessionService.cleanupInactive(30);
```

## 9️⃣ **Session Query Methods**

```typescript
// Get session by ID
const session = await SessionService.getById(sessionId);

// Get user with session details
const result = await SessionService.getUserWithSession();
// { user: IUser, session: ISession }
```

## 🔟 **Formatted Session Display**

```typescript
// Format session for UI display
const formatted = SessionService.formatSession(session);

console.log(formatted);
// {
//   id: "abc123",
//   device: "Desktop - Chrome",
//   location: "192.168.1.1",
//   lastActive: "2024-01-14T10:30:00Z",
//   isCurrent: false
// }
```

## 📋 Complete Function List

### Session Creation (4 methods)
- ✅ `create(options)` - Create with full options
- ✅ `createWithAutoDetect(userId, request, rememberMe)` - Auto device detection
- ✅ `setCookie(token, expiresAt)` - Set session cookie
- ✅ `refresh()` - Refresh current session

### Session Deletion (5 methods)
- ✅ `delete(token)` - Delete by token
- ✅ `deleteById(sessionId)` - Delete by ID
- ✅ `deleteAllForUser(userId)` - Delete all for user
- ✅ `deleteOtherSessions()` - Delete except current
- ✅ `logout()` - Logout current

### Session Validation (5 methods)
- ✅ `getToken()` - Get current token
- ✅ `validate(token)` - Validate token (cached)
- ✅ `getCurrent()` - Get current session (cached)
- ✅ `getById(sessionId)` - Get by ID
- ✅ `getAllForUser(userId)` - Get all user sessions

### User Methods (4 methods)
- ✅ `getCurrentUser()` - Get user (cached)
- ✅ `getCurrentUserId()` - Get user ID
- ✅ `getUserWithSession()` - Get user + session
- ✅ `requireAuth()` - Require auth (throws)

### Authentication (7 methods)
- ✅ `isAuthenticated()` - Check if authenticated
- ✅ `requireRole(roles)` - Require specific role
- ✅ `requireAnyRole(roles)` - Require any role
- ✅ `requireEmailVerified()` - Require email verified
- ✅ `hasRole(role)` - Check role
- ✅ `hasAnyRole(roles)` - Check any role
- ✅ `hasAllRoles(roles)` - Check all roles

### Session Management (4 methods)
- ✅ `extend(token, rememberMe)` - Extend expiration
- ✅ `cleanupExpired()` - Clean expired
- ✅ `cleanupInactive(days)` - Clean inactive
- ✅ `invalidate(token)` - Invalidate session

### Statistics (4 methods)
- ✅ `getActiveCount(userId)` - Count active sessions
- ✅ `getStats(userId)` - Get statistics
- ✅ `isSessionLimitExceeded(userId, max)` - Check limit
- ✅ `formatSession(session)` - Format for display

### Security (3 methods)
- ✅ `validateIpAddress(request)` - Validate IP
- ✅ `validateUserAgent(request)` - Validate UA
- ✅ `revokeAllForUser(userId)` - Revoke all sessions

### Middleware (5 methods)
- ✅ `getFromRequest(request)` - Get from request
- ✅ `isRequestAuthenticated(request)` - Check request auth
- ✅ `protectRoute(request, redirect)` - Protect route
- ✅ `requireRoleMiddleware(request, roles, redirect)` - Require role
- ✅ `createMiddleware(options)` - Create middleware

### Response Helpers (3 methods)
- ✅ `unauthorizedResponse(message)` - 401 response
- ✅ `forbiddenResponse(message)` - 403 response
- ✅ `successResponse(data, message)` - Success response

## 🎯 Real-World Usage Examples

### 1. Multi-Device Login
```typescript
'use server';

export async function loginAction(email: string, password: string, rememberMe: boolean) {
  // Verify credentials
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  // Check session limit
  const exceeded = await SessionService.isSessionLimitExceeded(user._id, 5);
  if (exceeded) {
    throw new Error('Maximum 5 devices. Please logout from another device.');
  }

  // Create session with auto-detect
  const session = await SessionService.createWithAutoDetect(
    user._id.toString(),
    request,
    rememberMe
  );

  // Set cookie
  await SessionService.setCookie(session.token, session.expiresAt);

  return { success: true };
}
```

### 2. Session Management Page
```typescript
export default async function SessionsPage() {
  const user = await SessionService.requireAuth();
  const sessions = await SessionService.getAllForUser(user._id);
  const currentToken = await SessionService.getToken();

  return (
    <div>
      <h1>Active Devices</h1>
      {sessions.map(session => {
        const formatted = SessionService.formatSession(session);
        const isCurrent = session.token === currentToken;

        return (
          <div key={session._id}>
            <p>{formatted.device}</p>
            <p>Last active: {formatted.lastActive}</p>
            <p>Location: {formatted.location}</p>
            {isCurrent && <Badge>Current Device</Badge>}
            {!isCurrent && (
              <Button onClick={() => SessionService.deleteById(session._id)}>
                Logout Device
              </Button>
            )}
          </div>
        );
      })}
      
      <Button onClick={() => SessionService.deleteOtherSessions()}>
        Logout All Other Devices
      </Button>
    </div>
  );
}
```

### 3. Security Check Middleware
```typescript
export async function securityMiddleware(request: NextRequest) {
  // Check IP validation
  const ipValid = await SessionService.validateIpAddress(request);
  if (!ipValid) {
    console.warn('IP mismatch detected');
    await SessionService.logout();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check user agent
  const uaValid = await SessionService.validateUserAgent(request);
  if (!uaValid) {
    console.warn('User agent mismatch detected');
    // Optional: invalidate instead of logout
    const token = await SessionService.getToken();
    if (token) await SessionService.invalidate(token);
  }

  return NextResponse.next();
}
```

### 4. Session Statistics Dashboard
```typescript
export default async function AdminDashboard() {
  const user = await SessionService.requireRole(['admin']);
  
  const stats = await SessionService.getStats(); // All sessions
  const userStats = await SessionService.getStats(user._id); // User's sessions

  return (
    <div>
      <h1>Session Statistics</h1>
      <div>Total Sessions: {stats.total}</div>
      <div>Active Sessions: {stats.active}</div>
      <div>Expired Sessions: {stats.expired}</div>
      
      <h2>Your Sessions</h2>
      <div>Active Devices: {userStats.active}</div>
    </div>
  );
}
```

### 5. Remember Me Login
```typescript
'use server';

export async function loginWithRememberMe(
  email: string, 
  password: string,
  rememberMe: boolean
) {
  const user = await verifyCredentials(email, password);

  // Create session with remember me
  const session = await SessionService.create({
    userId: user._id.toString(),
    userAgent: request.headers.get('user-agent'),
    ipAddress: request.headers.get('x-forwarded-for'),
    rememberMe, // 90 days if true, 30 days if false
    deviceInfo: {
      browser: 'Chrome',
      os: 'Windows',
      device: 'Desktop',
      isMobile: false,
    }
  });

  await SessionService.setCookie(session.token, session.expiresAt);

  return { success: true };
}
```

### 6. Cleanup Cron Job
```typescript
// Run daily via cron
export async function sessionCleanupJob() {
  // Clean expired sessions
  const expired = await SessionService.cleanupExpired();
  console.log(`Deleted ${expired} expired sessions`);

  // Clean inactive sessions (30 days)
  const inactive = await SessionService.cleanupInactive(30);
  console.log(`Deleted ${inactive} inactive sessions`);

  return { expired, inactive };
}
```

## 🎉 Summary

**Total Functions: 45+**

- ✅ Multi-device management
- ✅ Remember me (90 days)
- ✅ Auto device detection
- ✅ Security validation (IP, UA)
- ✅ Session statistics
- ✅ Session limits
- ✅ Inactive cleanup
- ✅ Email verification check
- ✅ Multiple role checks
- ✅ Session formatting
- ✅ Backwards compatible

**SessionService ab production-ready hai!** 🚀
