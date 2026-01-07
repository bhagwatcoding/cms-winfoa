# 👤 MyAccount Subdomain Implementation Guide

**Status:** 🔴 Not Implemented (0%)  
**Priority:** 🟡 High  
**Timeline:** Week 3-4

---

## 📋 Overview

The MyAccount subdomain provides users with a comprehensive account management interface including:
- Profile management
- Security settings
- Password changes
- Email preferences
- Notification settings
- Activity logs
- Connected sessions
- API key management

---

## 🎯 Implementation Tasks

### Task 1: Setup Database Models

**Files to Create:**

```
src/subdomain/myaccount/models/
├── UserPreferences.ts
├── ActivityLog.ts
└── ApiKey.ts
```

#### 1.1 User Preferences Model

**File:** `src/subdomain/myaccount/models/UserPreferences.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId
  emailNotifications: {
    marketing: boolean
    updates: boolean
    security: boolean
    newsletter: boolean
  }
  pushNotifications: {
    enabled: boolean
    browser: boolean
    mobile: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    showEmail: boolean
    showActivity: boolean
  }
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  createdAt: Date
  updatedAt: Date
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    emailNotifications: {
      marketing: { type: Boolean, default: false },
      updates: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false }
    },
    pushNotifications: {
      enabled: { type: Boolean, default: false },
      browser: { type: Boolean, default: false },
      mobile: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
      },
      showEmail: { type: Boolean, default: false },
      showActivity: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  { timestamps: true }
)

export const UserPreferences = 
  mongoose.models.UserPreferences || 
  mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema)
```

#### 1.2 Activity Log Model

**File:** `src/subdomain/myaccount/models/ActivityLog.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId
  action: string
  resource: string
  details: any
  ipAddress: string
  userAgent: string
  timestamp: Date
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'password_change',
      'email_change',
      'profile_update',
      'settings_update',
      'account_delete',
      'api_key_created',
      'api_key_deleted'
    ]
  },
  resource: { type: String },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
})

// Index for querying user activity
ActivityLogSchema.index({ userId: 1, timestamp: -1 })

export const ActivityLog = 
  mongoose.models.ActivityLog || 
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
```

---

### Task 2: Create Services

**Files to Create:**

```
src/subdomain/myaccount/services/
├── profile.service.ts
├── settings.service.ts
├── activity.service.ts
└── index.ts
```

#### 2.1 Profile Service

**File:** `src/subdomain/myaccount/services/profile.service.ts`

```typescript
import { User } from '@/edu/models/User'
import { connectDB } from '@/lib/db/mongodb'
import { ActivityLog } from '../models/ActivityLog'

export class ProfileService {
  /**
   * Get user profile
   */
  static async getProfile(userId: string) {
    await connectDB()
    
    const user = await User.findById(userId)
      .select('-password')
      .lean()
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
  
  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: {
      firstName?: string
      lastName?: string
      phone?: string
      bio?: string
      avatar?: string
      location?: string
    }
  ) {
    await connectDB()
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password')
    
    // Log activity
    await ActivityLog.create({
      userId,
      action: 'profile_update',
      details: { fields: Object.keys(data) }
    })
    
    return user
  }
  
  /**
   * Change email
   */
  static async changeEmail(userId: string, newEmail: string) {
    await connectDB()
    
    // Check if email is already taken
    const existing = await User.findOne({ 
      email: newEmail,
      _id: { $ne: userId }
    })
    
    if (existing) {
      throw new Error('Email already in use')
    }
    
    // Update email and mark as unverified
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        email: newEmail,
        emailVerified: false
      },
      { new: true }
    ).select('-password')
    
    // Log activity
    await ActivityLog.create({
      userId,
      action: 'email_change',
      details: { newEmail }
    })
    
    // TODO: Send verification email
    
    return user
  }
  
  /**
   * Delete account
   */
  static async deleteAccount(userId: string) {
    await connectDB()
    
    // Log before deletion
    await ActivityLog.create({
      userId,
      action: 'account_delete'
    })
    
    // Soft delete or hard delete
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      deletedAt: new Date()
    })
    
    // Or hard delete:
    // await User.findByIdAndDelete(userId)
    
    return { success: true }
  }
}
```

#### 2.2 Settings Service

**File:** `src/subdomain/myaccount/services/settings.service.ts`

```typescript
import bcrypt from 'bcryptjs'
import { User } from '@/edu/models/User'
import { UserPreferences } from '../models/UserPreferences'
import { ActivityLog } from '../models/ActivityLog'
import { connectDB } from '@/lib/db/mongodb'

export class SettingsService {
  /**
   * Get user preferences
   */
  static async getPreferences(userId: string) {
    await connectDB()
    
    let prefs = await UserPreferences.findOne({ userId })
    
    // Create default if doesn't exist
    if (!prefs) {
      prefs = await UserPreferences.create({ userId })
    }
    
    return prefs
  }
  
  /**
   * Update preferences
   */
  static async updatePreferences(userId: string, data: any) {
    await connectDB()
    
    const prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    )
    
    await ActivityLog.create({
      userId,
      action: 'settings_update',
      details: { updated: Object.keys(data) }
    })
    
    return prefs
  }
  
  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    await connectDB()
    
    const user = await User.findById(userId).select('+password')
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      throw new Error('Current password is incorrect')
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password
    user.password = hashedPassword
    await user.save()
    
    // Log activity
    await ActivityLog.create({
      userId,
      action: 'password_change'
    })
    
    return { success: true }
  }
}
```

---

### Task 3: Create Server Actions

**Files to Create:**

```
src/subdomain/myaccount/actions/
├── profile.ts
├── settings.ts
└── activity.ts
```

#### 3.1 Profile Actions

**File:** `src/subdomain/myaccount/actions/profile.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { ProfileService } from '../services/profile.service'
import { SessionService } from '@/auth/services/session.service'

export async function getProfile() {
  try {
    const session = await SessionService.getCurrentSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }
    
    const profile = await ProfileService.getProfile(session.userId)
    return { success: true, data: profile }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const session = await SessionService.getCurrentSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string
    }
    
    const profile = await ProfileService.updateProfile(session.userId, data)
    
    revalidatePath('/myaccount/profile')
    
    return { success: true, data: profile }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

---

### Task 4: Create UI Components

**Files to Create:**

```
src/subdomain/myaccount/components/
├── profile/
│   ├── profile-form.tsx
│   ├── avatar-upload.tsx
│   └── delete-account-dialog.tsx
├── security/
│   ├── change-password-form.tsx
│   ├── two-factor-setup.tsx
│   └── active-sessions.tsx
├── settings/
│   ├── notification-settings.tsx
│   ├── privacy-settings.tsx
│   └── appearance-settings.tsx
└── activity/
    └── activity-log-table.tsx
```

#### 4.1 Profile Form

**File:** `src/subdomain/myaccount/components/profile/profile-form.tsx`

```typescript
'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/myaccount/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  initialData: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    bio?: string
    location?: string
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={initialData.firstName}
            required
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={initialData.lastName}
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
          defaultValue={initialData.email}
          disabled
        />
        <p className="text-xs text-muted-foreground mt-1">
          Contact support to change your email
        </p>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={initialData.phone}
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initialData.bio}
          disabled={isPending}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={initialData.location}
          disabled={isPending}
          placeholder="City, Country"
        />
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-lg">
          Profile updated successfully!
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
```

#### 4.2 Change Password Form

**File:** `src/subdomain/myaccount/components/security/change-password-form.tsx`

```typescript
'use client'

import { useActionState } from 'react'
import { changePassword } from '@/myaccount/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, null)

  return (
    <form action={formAction} className="space-y-6 max-w-md">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must be at least 8 characters
        </p>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={isPending}
        />
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-lg">
          Password changed successfully!
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  )
}
```

---

## 📦 Pages to Create

**Files to Create in `src/app/myaccount/`:**

```
src/app/myaccount/
├── layout.tsx
├── page.tsx (Dashboard)
├── profile/
│   └── page.tsx
├── security/
│   └── page.tsx
├── settings/
│   └── page.tsx
└── activity/
    └── page.tsx
```

---

## 🧪 Testing Checklist

- [ ] Profile update works correctly
- [ ] Avatar upload and display works
- [ ] Password change validates correctly
- [ ] Email change sends verification
- [ ] Notification preferences save
- [ ] Privacy settings work
- [ ] Activity log displays correctly
- [ ] Session management works
- [ ] Account deletion confirmation
- [ ] All forms validate properly

---

## 🎯 Success Criteria

✅ Complete profile management  
✅ Working password change  
✅ Email preferences functional  
✅ Activity log tracking  
✅ Session management  
✅ Modern, responsive UI  
✅ Proper error handling  
✅ Data validation

---

**Last Updated:** 2026-01-07
