# AuthService - Modular Architecture Guide 🏗️

## 🎯 Organized Structure

Authentication system ko **4 modular layers** mein organize kiya gaya hai:

```
src/shared/
├── lib/
│   ├── validations/
│   │   └── auth.validation.ts     // Zod schemas
│   ├── security/
│   │   └── auth.security.ts       // Security utilities
│   └── helpers/
│       └── auth.helpers.ts        // Helper functions
└── services/
    ├── auth.service.ts            // Main AuthService class
    └── session.service.ts         // SessionService class
```

## 📦 Layer 1: Validation (auth.validation.ts)

**Purpose**: Centralized input validation with Zod

### Schemas Available:
- `loginSchema` - Login validation
- `signupSchema` - Signup with strong password
- `changePasswordSchema` - Password change
- `resetPasswordSchema` - Password reset
- `forgotPasswordSchema` - Forgot password
- `verifyEmailSchema` - Email verification
- `updateProfileSchema` - Profile update

### Example:
```typescript
import { loginSchema } from '@/lib/validations/auth.validation';

const result = loginSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.errors[0].message);
}
```

### Password Requirements:
```typescript
signupSchema validates:
- Min 8 characters
- Max 100 characters  
- 1 uppercase letter (A-Z)
- 1 lowercase letter (a-z)
- 1 number (0-9)
- 1 special character (!@#$%^&*)
- Password === confirmPassword
```

## 📦 Layer 2: Security (auth.security.ts)

**Purpose**: Security utilities and cryptography

### Password Functions:
```typescript
import {
  hashPassword,
  verifyPassword,
  generateRandomPassword,
} from '@/lib/security/auth.security';

// Hash password
const hashed = await hashPassword('MyPass123!');

// Verify password
const isValid = await verifyPassword('MyPass123!', hashed);

// Generate random password
const random = generateRandomPassword(16);
```

### Token Functions:
```typescript
import {
  generateSecureToken,
  generateVerificationToken,
  generateResetToken,
} from '@/lib/security/auth.security';

const token = generateSecureToken(32); // 64 hex chars
const verifyToken = generateVerificationToken();
const resetToken = generateResetToken();
```

### Signature Functions:
```typescript
import {
  createSessionSignature,
  verifySessionSignature,
} from '@/lib/security/auth.security';

// Create HMAC SHA-256 signature
const signature = createSessionSignature(userId, sessionId, token);

// Verify (timing-safe)
const isValid = verifySessionSignature(userId, sessionId, token, signature);
```

### Encryption Functions:
```typescript
import {
  encryptData,
  decryptData,
} from '@/lib/security/auth.security';

// Encrypt sensitive data (AES-256-CBC)
const encrypted = encryptData('sensitive-info');

// Decrypt
const decrypted = decryptData(encrypted);
```

### Rate Limiting:
```typescript
import {
  checkRateLimit,
  clearRateLimit,
} from '@/lib/security/auth.security';

// Check rate limit
const result = checkRateLimit('user@email.com');
// {
//   allowed: boolean,
//   remainingAttempts: number,
//   retryAfter?: number (seconds)
// }

// Clear on success
clearRateLimit('user@email.com');
```

### Audit Logging:
```typescript
import {
  logSecurityEvent,
  createAuditLog,
} from '@/lib/security/auth.security';

logSecurityEvent({
  action: 'LOGIN_SUCCESS',
  userId: 'user123',
  email: 'user@email.com',
  ipAddress: '192.168.1.1',
  success: true,
});
```

## 📦 Layer 3: Helpers (auth.helpers.ts)

**Purpose**: Utility functions for common tasks

### Request Helpers:
```typescript
import {
  getRequestMetadata,
  parseUserAgent,
  getClientIp,
} from '@/lib/helpers/auth.helpers';

// Get request metadata
const metadata = await getRequestMetadata();
// { userAgent, ipAddress, referer, origin }

// Parse user agent
const deviceInfo = parseUserAgent(userAgent);
// { browser: 'Chrome', os: 'Windows', device: 'Desktop', isMobile: false }

// Get client IP
const ip = await getClientIp();
```

### User Data Helpers:
```typescript
import {
  toSafeUserData,
  maskEmail,
  maskPhone,
} from '@/lib/helpers/auth.helpers';

// Convert to safe data (remove password, etc)
const safeUser = toSafeUserData(user);

// Mask email for privacy
const masked = maskEmail('user@example.com');
// 'us***r@example.com'

// Mask phone
const maskedPhone = maskPhone('+1234567890');
// '***7890'
```

### Validation Helpers:
```typescript
import {
  isStrongPassword,
  validateEmail,
} from '@/lib/helpers/auth.helpers';

// Check password strength
const result = isStrongPassword('MyPass123!');
// {
//   isStrong: true,
//   score: 6,
//   feedback: []
// }

// Validate email
const emailCheck = validateEmail('user@tempmail.com');
// {
//   isValid: false,
//   errors: ['Disposable email addresses are not allowed']
// }
```

### Time Helpers:
```typescript
import {
  formatDuration,
  formatTimestamp,
  getRelativeTime,
} from '@/lib/helpers/auth.helpers';

formatDuration(3600000); // "1 hour"
formatTimestamp(new Date()); // "Jan 14, 2024, 01:30 PM"
getRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

### Response Helpers:
```typescript
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/helpers/auth.helpers';

// Error response
const error = createErrorResponse('Invalid credentials', 'AUTH_ERROR');
// { success: false, error: '...', code: '...', timestamp: '...' }

// Success response
const success = createSuccessResponse(data, 'Login successful');
// { success: true, data: {...}, message: '...', timestamp: '...' }
```

## 📦 Layer 4: AuthService (auth.service.ts)

**Purpose**: Main authentication service using all layers

### Available Methods:

### 1. **Login**
```typescript
import { AuthService } from '@/services/auth.service';

const result = await AuthService.login({
  email: 'user@example.com',
  password: 'MyPass123!',
  rememberMe: true,
});

if (result.success) {
  console.log(result.data);
  // {
  //   user: { id, name, email, role },
  //   session: { sessionId, signature, expiresAt }
  // }
}
```

### 2. Signup
```typescript
const result = await AuthService.signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'StrongPass123!',
  confirmPassword: 'StrongPass123!',
  role: 'user',
});
```

### 3. **Logout**
```typescript
await AuthService.logout();
```

### 4. **Logout All Devices**
```typescript
const result = await AuthService.logoutAllDevices();
// { success: true, data: { deletedCount: 3 } }
```

### 5. **Change Password**
```typescript
const result = await AuthService.changePassword({
  currentPassword: 'OldPass123!',
  newPassword: 'NewPass123!',
  confirmPassword: 'NewPass123!',
});
```

### 6. **Get Current Session**
```typescript
const result = await AuthService.getCurrentSession();
// {
//   user: { id, name, email, role, emailVerified },
//   session: { sessionId, signature, expiresAt, deviceInfo }
// }
```

### 7. **Get All Sessions**
```typescript
const result = await AuthService.getUserSessions();
// {
//   sessions: [
//     {
//       id, device, location, lastActive,
//       isCurrent, signature
//     }
//   ],
//   total: 3
// }
```

### 8. **Delete Session**
```typescript
await AuthService.deleteSession(sessionId);
```

### 9. **Verify Signature**
```typescript
const result = await AuthService.verifySignature(
  userId,
  sessionId,
  token,
  signature
);
// { success: true, data: { isValid: true } }
```

### 10. **Login with Redirect**
```typescript
// Auto redirects on success
await AuthService.loginWithRedirect(
  { email, password, rememberMe },
  '/dashboard'
);
```

## 🎯 Complete Usage Example

```typescript
'use client';

import { useState } from 'react';
import { AuthService } from '@/services/auth.service';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    const result = await AuthService.login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('rememberMe') === 'on',
    });

    if (result.success) {
      // Success! Auto-redirect or show message
      window.location.href = '/dashboard';
    } else {
      // Show error
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <label>
        <input type="checkbox" name="rememberMe" />
        Remember me (90 days)
      </label>
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## 🔒 Security Features

### 1. **HMAC SHA-256 Signatures**
- Every session has unique signature
- Prevents session tampering
- Timing-safe comparison

### 2. **Rate Limiting**
- 5 attempts per 15 minutes
- Auto-resets on success
- Prevents brute force attacks

### 3. **Password Security**
- Bcrypt hashing (12 rounds)
- Strong password validation
- No password reuse check

### 4. **Session Security**
- Max 5 devices per user
- Auto logout on password change
- IP & User Agent tracking

### 5. **Audit Logging**
- All auth events logged
- Security event tracking
- Timestamped entries

### 6. **Input Validation**
- Zod schema validation
- XSS prevention
- Disposable email blocking

## 📊 Response Format

All methods return consistent format:

```typescript
{
  success: boolean,
  error?: string,
  message?: string,
  data?: any,
  code?: string,        // Error code
  timestamp?: string,   // ISO timestamp
}
```

### Error Codes:
- `VALIDATION_ERROR` - Invalid input
- `RATE_LIMITED` - Too many attempts
- `INVALID_CREDENTIALS` - Wrong email/password
- `ACCOUNT_DEACTIVATED` - Account disabled
- `SESSION_LIMIT_EXCEEDED` - Too many devices
- `NOT_AUTHENTICATED` - No session
- `UNAUTHORIZED` - No permission
- `INTERNAL_ERROR` - Server error

## ✅ Benefits of Modular Architecture

### 1. **Separation of Concerns**
- Validation in one place
- Security utilities separate
- Helpers reusable
- Service orchestrates

### 2. **Maintainability**
- Easy to find code
- Clear organization
- Single responsibility
- Easy to test

### 3. **Reusability**
- Use validation anywhere
- Share security utils
- Common helpers
- DRY principle

### 4. **Scalability**
- Add features easily
- Extend without breaking
- Clear interfaces
- Modular growth

### 5. **Type Safety**
- Full TypeScript
- Zod validation
- Type exports
- Autocomplete

## 📚 File Summary

| File | Lines | Purpose | Exports |
|------|-------|---------|---------|
| `auth.validation.ts` | ~150 | Input validation | 7 schemas |
| `auth.security.ts` | ~400 | Security utils | 20+ functions |
| `auth.helpers.ts` | ~350 | Helper functions | 25+ functions |
| `auth.service.ts` | ~500 | Main service | AuthService class |

**Total: ~1400 lines of professional, organized code!** 🚀

## 🎉 Summary

✅ **4-Layer Architecture**:
1. Validation Layer
2. Security Layer
3. Helpers Layer
4. Service Layer

✅ **50+ Functions**
✅ **Type-Safe** (TypeScript + Zod)
✅ **Secure** (Encryption, Signatures, Rate Limiting)
✅ **Auditable** (Event Logging)
✅ **Maintainable** (Clear Organization)
✅ **Production-Ready**

**Enterprise-grade authentication system complete!** 🔐🏗️
