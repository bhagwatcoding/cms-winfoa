# 🔐 Auth Subdomain Implementation Guide

**Status:** 🟡 Partially Implemented (30%)  
**Priority:** 🔴 Critical  
**Timeline:** Week 1-2

---

## 📋 Current Status

### ✅ Completed
- `actions/login.ts` - Login server action
- `actions/logout.ts` - Logout server action
- `actions/signup.ts` - Signup server action

### ⚠️ Missing
- UI Components (0/8)
- Services (0/4)
- Models (0/3)
- Utilities (0/5)
- OAuth Integration
- Email Verification
- 2FA (Two-Factor Authentication)

---

## 🎯 Implementation Tasks

### Task 1: Create Auth Components (Priority: HIGH)

**Files to Create:**

```
src/subdomain/auth/components/
├── forms/
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   ├── forgot-password-form.tsx
│   └── reset-password-form.tsx
├── oauth/
│   ├── oauth-buttons.tsx
│   └── oauth-callback.tsx
└── ui/
    ├── auth-layout.tsx
    └── auth-error.tsx
```

#### 1.1 Login Form Component

**File:** `src/subdomain/auth/components/forms/login-form.tsx`

```typescript
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/auth/actions/login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OAuthButtons } from '../oauth/oauth-buttons'

export function LoginForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
        </div>

        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {state.error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButtons />

      <div className="text-center text-sm">
        <a 
          href="/auth/forgot-password" 
          className="text-primary hover:underline"
        >
          Forgot password?
        </a>
        {' · '}
        <a 
          href="/auth/signup" 
          className="text-primary hover:underline"
        >
          Create account
        </a>
      </div>
    </div>
  )
}
```

#### 1.2 Signup Form Component

**File:** `src/subdomain/auth/components/forms/signup-form.tsx`

```typescript
'use client'

import { useActionState } from 'react'
import { signupAction } from '@/auth/actions/signup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null)

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">
          Get started with your free account
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" name="terms" required />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>
          </label>
        </div>

        {state?.error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 text-sm text-green-500 bg-green-50 rounded-lg">
            Account created! Check your email to verify.
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <a href="/auth/login" className="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </div>
  )
}
```

---

### Task 2: Create Auth Services (Priority: HIGH)

**Files to Create:**

```
src/subdomain/auth/services/
├── auth.service.ts
├── session.service.ts
├── email.service.ts
└── index.ts
```

#### 2.1 Auth Service

**File:** `src/subdomain/auth/services/auth.service.ts`

```typescript
import bcrypt from 'bcryptjs'
import { User } from '@/edu/models/User'
import { Session } from '@/edu/models/Session'
import { connectDB } from '@/lib/db/mongodb'

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async authenticate(email: string, password: string) {
    await connectDB()
    
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      throw new Error('Invalid credentials')
    }
    
    if (!user.isActive) {
      throw new Error('Account is disabled')
    }
    
    if (!user.emailVerified) {
      throw new Error('Please verify your email first')
    }
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()
    
    return user
  }
  
  /**
   * Register new user
   */
  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
  }) {
    await connectDB()
    
    // Check if user exists
    const existing = await User.findOne({ email: data.email })
    if (existing) {
      throw new Error('Email already registered')
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    // Create user
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'user',
      emailVerified: false,
      isActive: true
    })
    
    // Send verification email
    await this.sendVerificationEmail(user)
    
    return user
  }
  
  /**
   * Send verification email
   */
  static async sendVerificationEmail(user: any) {
    // TODO: Implement email sending
    const token = this.generateVerificationToken()
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`
    
    console.log(`Verification URL for ${user.email}: ${url}`)
    
    // Store token in database
    // Send email
  }
  
  /**
   * Verify email
   */
  static async verifyEmail(token: string) {
    // TODO: Implement token verification
    await connectDB()
    
    // Find user by token
    // Update emailVerified = true
    // Delete token
  }
  
  /**
   * Generate verification token
   */
  private static generateVerificationToken(): string {
    return crypto.randomUUID()
  }
  
  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string) {
    await connectDB()
    
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists
      return { success: true }
    }
    
    // Generate reset token
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600000) // 1 hour
    
    // Save token (use PasswordResetToken model)
    // Send reset email
    
    return { success: true }
  }
}
```

#### 2.2 Session Service

**File:** `src/subdomain/auth/services/session.service.ts`

```typescript
import { cookies } from 'next/headers'
import { Session } from '@/edu/models/Session'
import { connectDB } from '@/lib/db/mongodb'

const SESSION_COOKIE_NAME = 'session_id'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export class SessionService {
  /**
   * Create new session
   */
  static async createSession(userId: string, metadata?: any) {
    await connectDB()
    
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)
    
    await Session.create({
      userId,
      sessionToken,
      expiresAt,
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress
    })
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })
    
    return sessionToken
  }
  
  /**
   * Get current session
   */
  static async getCurrentSession() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    if (!sessionToken) {
      return null
    }
    
    await connectDB()
    
    const session = await Session.findOne({
      sessionToken,
      expiresAt: { $gt: new Date() }
    }).populate('userId')
    
    return session
  }
  
  /**
   * Delete session
   */
  static async deleteSession(sessionToken?: string) {
    const cookieStore = await cookies()
    
    if (!sessionToken) {
      sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
    }
    
    if (sessionToken) {
      await connectDB()
      await Session.deleteOne({ sessionToken })
    }
    
    // Clear cookie
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
  
  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions() {
    await connectDB()
    await Session.deleteMany({
      expiresAt: { $lt: new Date() }
    })
  }
}
```

---

### Task 3: Add OAuth Integration (Priority: MEDIUM)

**Files to Create:**

```
src/subdomain/auth/lib/
├── oauth/
│   ├── google.ts
│   ├── github.ts
│   └── providers.ts
└── constants.ts
```

#### 3.1 OAuth Provider Configuration

**File:** `src/subdomain/auth/lib/oauth/providers.ts`

```typescript
export const oauthProviders = {
  google: {
    name: 'Google',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile'
  },
  github: {
    name: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scope: 'read:user user:email'
  }
}

export type OAuthProvider = keyof typeof oauthProviders
```

---

### Task 4: Update Actions (Priority: HIGH)

#### 4.1 Update Login Action

**File:** `src/subdomain/auth/actions/login.ts`

```typescript
'use server'

import { redirect } from 'next/navigation'
import { AuthService } from '../services/auth.service'
import { SessionService } from '../services/session.service'

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Validate
    if (!email || !password) {
      return { error: 'Please provide email and password' }
    }
    
    // Authenticate
    const user = await AuthService.authenticate(email, password)
    
    // Create session
    await SessionService.createSession(user._id.toString())
    
    // Redirect based on role
    if (user.role === 'admin') {
      redirect('/god/dashboard')
    } else if (user.role === 'center') {
      redirect('/education/dashboard')
    } else {
      redirect('/myaccount/dashboard')
    }
    
  } catch (error: any) {
    return { error: error.message || 'Login failed' }
  }
}
```

---

## 📦 Dependencies to Install

```bash
npm install bcryptjs @types/bcryptjs
npm install nodemailer @types/nodemailer
npm install jose  # For JWT if needed
```

---

## 🧪 Testing Checklist

- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Signup creates new user
- [ ] Email verification sends email
- [ ] Password reset works
- [ ] Session persists across page reloads
- [ ] Logout clears session
- [ ] OAuth login works (Google)
- [ ] OAuth login works (GitHub)
- [ ] 2FA setup and verification

---

## 🎯 Success Criteria

✅ All auth components created  
✅ Login/signup/logout fully functional  
✅ Email verification implemented  
✅ Password reset working  
✅ OAuth integration (Google + GitHub)  
✅ Session management robust  
✅ Error handling comprehensive  
✅ UI/UX polished and responsive

---

**Last Updated:** 2026-01-07
