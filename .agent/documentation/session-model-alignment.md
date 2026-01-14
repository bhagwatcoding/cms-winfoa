# Session Model Alignment Guide

## ✅ Fixed: Config Now Matches Database Schema

### Issue Identified
The initial config implementation didn't align with the actual Session model in the database.

### Session Model Schema (`src/shared/lib/db/models/core/Session.ts`)

```typescript
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;              // ⚠️ NOT sessionToken
  expiresAt: Date;           // ⚠️ NOT expires
  userAgent?: string;
  ipAddress?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    isMobile?: boolean;
    device?: string;
  };
  isActive: boolean;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Field Name Mapping

| Purpose | Correct Field Name | ❌ Wrong Name |
|---------|-------------------|---------------|
| Session Token | `token` | ~~sessionToken~~ |
| Expiration | `expiresAt` | ~~expires~~ |
| User Reference | `userId` | ✅ Correct |
| Active Status | `isActive` | ✅ Correct |
| Last Access | `lastAccessedAt` | ✅ Correct |

## 🔧 Files Updated to Match Schema

### 1. `src/shared/lib/auth/session.ts`

#### Creating Session
```typescript
// ✅ CORRECT - Matches DB Schema
await Session.create({
  userId,
  token: hashedToken,           // NOT sessionToken
  expiresAt: expires,           // NOT expires
  userAgent,
  ipAddress,
  deviceInfo: parseUserAgent(userAgent),
  isActive: true,
  lastAccessedAt: new Date(),
});
```

#### Finding Session
```typescript
// ✅ CORRECT
const session = await Session.findOne({
  token: hashedToken,           // NOT sessionToken
  isActive: true,
  expiresAt: { $gt: new Date() }, // NOT expires
}).populate("userId");
```

#### Updating Session
```typescript
// ✅ CORRECT
await Session.findOneAndUpdate(
  { 
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  },
  {
    expiresAt: newExpires,
    lastAccessedAt: new Date(),
  }
);
```

### 2. `src/config/db.ts`

Added `SESSION_FIELDS` mapping for reference:

```typescript
export const DB = {
  // ... other config
  
  SESSION_FIELDS: {
    TOKEN: "token",           // NOT sessionToken
    EXPIRES_AT: "expiresAt",  // NOT expires
    USER_ID: "userId",
    IS_ACTIVE: "isActive",
    LAST_ACCESSED: "lastAccessedAt",
  }
} as const;
```

## 📊 Database Collections

Updated `DB.COLLECTIONS` to match actual models:

```typescript
COLLECTIONS: {
  // Core
  USERS: "users",
  SESSIONS: "sessions",
  ROLES: "roles",
  
  // Wallet
  TRANSACTIONS: "transactions",
  
  // Academy
  COURSES: "courses",
  STUDENTS: "students",
  CERTIFICATES: "certificates",
  RESULTS: "results",
  
  // Admin
  AUDIT_LOGS: "audit_logs",
}
```

## 🎯 Why This Matters

### Before (Incorrect)
```typescript
// ❌ Would cause database errors
await Session.create({
  sessionToken: hashedToken,  // Field doesn't exist in schema!
  expires: new Date(),        // Field doesn't exist in schema!
});

// Result: Database error, session not created
```

### After (Correct)
```typescript
// ✅ Matches schema exactly
await Session.create({
  token: hashedToken,    // ✅ Correct field name
  expiresAt: new Date(), // ✅ Correct field name
});

// Result: Session created successfully
```

## 🔍 How to Verify

### Check Session Model
```bash
# View the actual model
code src/shared/lib/db/models/core/Session.ts
```

### Test Session Creation
```typescript
import Session from '@/models';

// This should work now
const session = await Session.create({
  userId: user._id,
  token: "hashed_token_here",
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  isActive: true,
  lastAccessedAt: new Date(),
});

console.log('Session created:', session);
```

### Check Database Indexes
Your Session model has these indexes:
```typescript
SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ expiresAt: 1 });
SessionSchema.index({ lastAccessedAt: -1 });

// Auto-cleanup expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

## ⚠️ Migration Note

If you had any sessions created with the wrong field names, they would need to be cleared:

```typescript
// Optional: Clear old invalid sessions
await Session.deleteMany({
  $or: [
    { sessionToken: { $exists: true } },  // Old incorrect field
    { expires: { $exists: true } },       // Old incorrect field
  ]
});
```

But since this is a new deployment, no migration needed!

## 📚 Reference

- **Session Model**: `src/shared/lib/db/models/core/Session.ts`
- **Session Service**: `src/shared/lib/auth/session.ts`
- **DB Config**: `src/config/db.ts`
- **Collection Names**: `DB.COLLECTIONS`
- **Field Mapping**: `DB.SESSION_FIELDS`

## ✅ Checklist

- [x] Session model field names verified
- [x] Session service updated to use correct fields
- [x] DB config updated with field mapping
- [x] Collection names match database
- [x] All queries use correct field names
- [x] Documentation updated
