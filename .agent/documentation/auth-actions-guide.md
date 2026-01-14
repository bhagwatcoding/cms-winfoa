# Authentication Actions - Professional Implementation 🔐

## 🎯 Features

### ✅ **Session with Signature**
Every session includes:
- `userId` - User ID
- `sessionId` - Unique session ID  
- `token` - Session token
- `signature` - HMAC SHA-256 signature for security
- `deviceInfo` - Browser, OS, Device, IP

### ✅ **Security Features**
- Rate limiting (5 attempts per 15 minutes)
- Password hashing (bcrypt with 12 rounds)
- Session signatures for tampering detection
- Session limits (max 5 devices)
- Account status checks
- Email verification support

### ✅ **Professional Validation**
- Zod schema validation
- Strong password requirements
- Input sanitization
- Error handling

## 📦 Available Actions

### 1. Login Action
```typescript
import { loginAction } from '@/actions/auth.actions';

const result = await loginAction(
  'user@example.com',
  'password123',
  true // rememberMe
);

if (result.success) {
  console.log(result.data);
  // {
  //   user: { id, name, email, role },
  //   session: { sessionId, signature, expiresAt }
  // }
}
```

**Returns:**
```typescript
{
  success: true,
  message: "Login successful",
  data: {
    user: {
      id: "abc123",
      name: "John Doe",
      email: "john@example.com",
      role: "user"
    },
    session: {
      sessionId: "xyz789",
      signature: "hmac_sha256_signature",
      expiresAt: "2024-02-14T10:00:00Z"
    }
  }
}
```

### 2. Signup Action
```typescript
import { signupAction } from '@/actions/auth.actions';

const result = await signupAction({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'StrongPass123',
  confirmPassword: 'StrongPass123',
  role: 'user',
});
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### 3. Logout Action
```typescript
import { logoutAction } from '@/actions/auth.actions';

await logoutAction();
```

### 4. Logout All Devices
```typescript
import { logoutAllDevicesAction } from '@/actions/auth.actions';

const result = await logoutAllDevicesAction();
// { success: true, message: "Logged out from 3 devices" }
```

### 5. Change Password
```typescript
import { changePasswordAction } from '@/actions/auth.actions';

const result = await changePasswordAction({
  currentPassword: 'OldPass123',
  newPassword: 'NewStrongPass123',
  confirmPassword: 'NewStrongPass123',
});

// Auto logs out from other devices for security
```

### 6. Get Current Session
```typescript
import { getCurrentSessionAction } from '@/actions/auth.actions';

const result = await getCurrentSessionAction();

console.log(result.data);
// {
//   user: { id, name, email, role, emailVerified },
//   session: { sessionId, signature, expiresAt, deviceInfo }
// }
```

### 7. Get All Sessions
```typescript
import { getUserSessionsAction } from '@/actions/auth.actions';

const result = await getUserSessionsAction();

console.log(result.data);
// {
//   sessions: [
//     {
//       id: "session1",
//       device: "Desktop - Chrome",
//       location: "192.168.1.1",
//       lastActive: "2024-01-14T10:00:00Z",
//       isCurrent: true,
//       signature: "hmac_signature"
//     }
//   ],
//   total: 3
// }
```

### 8. Delete Specific Session
```typescript
import { deleteSessionAction } from '@/actions/auth.actions';

await deleteSessionAction('session_id_here');
```

### 9. Verify Session Signature
```typescript
import { verifySessionSignatureAction } from '@/actions/auth.actions';

const result = await verifySessionSignatureAction(
  userId,
  sessionId,
  token,
  signature
);

if (result.success && result.data.isValid) {
  console.log('Signature is valid');
}
```

### 10. Login with Redirect
```typescript
import { loginWithRedirectAction } from '@/actions/auth.actions';

// Auto redirects on success
await loginWithRedirectAction(
  'user@example.com',
  'password',
  true, // rememberMe
  '/dashboard'
);
```

## 🎯 Real-World Usage Examples

### 1. Login Form
```typescript
'use client';

import { useState } from 'react';
import { loginAction } from '@/actions/auth.actions';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') === 'on';

    const result = await loginAction(email, password, rememberMe);

    if (result.success) {
      // Redirect or update UI
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
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

### 2. Signup Form
```typescript
'use client';

import { signupAction } from '@/actions/auth.actions';

export default function SignupForm() {
  async function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = await signupAction(data);

    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      alert(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="name" placeholder="Full Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### 3. Active Sessions Page
```typescript
import { getUserSessionsAction, deleteSessionAction } from '@/actions/auth.actions';

export default async function ActiveSessionsPage() {
  const result = await getUserSessionsAction();

  if (!result.success) {
    return <div>Error loading sessions</div>;
  }

  async function handleDeleteSession(sessionId: string) {
    'use server';
    await deleteSessionAction(sessionId);
    revalidatePath('/settings/sessions');
  }

  return (
    <div>
      <h1>Active Devices ({result.data.total})</h1>
      {result.data.sessions.map((session) => (
        <div key={session.id}>
          <h3>{session.device}</h3>
          <p>Location: {session.location}</p>
          <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
          <p>Signature: {session.signature.slice(0, 16)}...</p>
          
          {session.isCurrent ? (
            <span>Current Device</span>
          ) : (
            <form action={() => handleDeleteSession(session.id)}>
              <button type="submit">Logout Device</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4. Change Password Form
```typescript
'use client';

import { changePasswordAction } from '@/actions/auth.actions';

export default function ChangePasswordForm() {
  async function handleSubmit(formData: FormData) {
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = await changePasswordAction(data);

    if (result.success) {
      alert(result.message);
      window.location.href = '/login';
    } else {
      alert(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input 
        type="password" 
        name="currentPassword" 
        placeholder="Current Password" 
        required 
      />
      <input 
        type="password" 
        name="newPassword" 
        placeholder="New Password (min 8 chars, 1 uppercase, 1 number)" 
        required 
      />
      <input 
        type="password" 
        name="confirmPassword" 
        placeholder="Confirm New Password" 
        required 
      />
      <button type="submit">Change Password</button>
      <p className="note">You will be logged out from all other devices</p>
    </form>
  );
}
```

### 5. Protected Route
```typescript
import { getCurrentSessionAction } from '@/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await getCurrentSessionAction();

  if (!session.success) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome {session.data.user.name}!</h1>
      <p>Session ID: {session.data.session.sessionId}</p>
      <p>Signature: {session.data.session.signature.slice(0, 32)}...</p>
      <p>Expires: {new Date(session.data.session.expiresAt).toLocaleString()}</p>
    </div>
  );
}
```

## 🔒 Security Features Explained

### 1. Session Signature
```typescript
// Created using HMAC SHA-256
const signature = crypto
  .createHmac('sha256', SESSION_SECRET)
  .update(`${userId}:${sessionId}:${token}`)
  .digest('hex');

// Prevents:
// - Session tampering
// - Token forgery
// - Man-in-the-middle attacks
```

### 2. Rate Limiting
```typescript
// Prevents brute force attacks
// Max 5 attempts per 15 minutes
// Automatically resets on success
```

### 3. Password Security
```typescript
// - Bcrypt hashing (12 rounds)
// - Strong password requirements
// - Password confirmation
// - Secure comparison
```

### 4. Session Limits
```typescript
// Max 5 active sessions per user
// Prevents account sharing
// Forces device management
```

## 📊 Action Response Format

All actions return consistent format:

```typescript
interface AuthActionResult {
  success: boolean;
  error?: string;      // If failed
  message?: string;    // Success message
  data?: any;          // Result data
}
```

## ✅ Best Practices

1. **Always check `result.success`** before proceeding
2. **Handle errors gracefully** with user-friendly messages
3. **Use signature verification** for critical operations
4. **Implement rate limiting** on client side too
5. **Log security events** for audit trail
6. **Redirect after successful auth** to prevent back button issues
7. **Clear sensitive data** from memory after use
8. **Use HTTPS** in production always

## 🎯 Summary

**Total Actions: 10**

- ✅ Professional validation with Zod
- ✅ Session signatures (HMAC SHA-256)
- ✅ Rate limiting (5 attempts/15 min)
- ✅ Password hashing (bcrypt)
- ✅ Session management (CRUD)
- ✅ Multi-device support
- ✅ Security checks
- ✅ Type-safe responses
- ✅ Error handling
- ✅ Production-ready

**Authentication actions are enterprise-grade and production-ready!** 🚀🔐
