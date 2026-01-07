# 🎯 Import Path Standards - WINFOA Project

**Updated:** 2026-01-07  
**Status:** ✅ Standardized

---

## 📋 **STANDARDIZED IMPORT PATTERNS**

### **1. Subdomain Imports**

```typescript
// Auth subdomain
import { AuthService, SessionService } from '@/auth/services'
import { LoginForm, SignupForm } from '@/auth/components/forms'
import { loginAction } from '@/auth/actions'

// MyAccount subdomain  
import { ProfileService } from '@/my/services'
import { ProfileForm } from '@/my/components/profile'
import { getProfile } from '@/my/actions'

// API subdomain
import { ApiKeyService } from '@/api/services'
import { CreateApiKeyForm } from '@/api/components'

// UMP subdomain
import { UserIdService } from '@ump/services'
import { UserRegistry } from '@ump/models'

// Education subdomain
import { User } from '@/edu/models'
```

---

### **2. Shared Resources**

```typescript
// UI Components (Shadcn)
import { Button, Input, Label } from '@/components/ui'
import { Dialog, DialogContent } from '@/ui'

// Shared Components
import { Header, Footer } from '@/components'

// Database Models (Centralized)
import { User } from '@/models'
import type { IUser } from '@/models'

// Utilities
import connectDB from '@/lib/db'
import { cn } from '@/lib/utils'

// General shared
import { SomeSharedUtil } from '@/shared'
```

---

### **3. App Router Pages**

```typescript
// Use relative imports for co-located files
import { Metadata } from 'next'

// Use aliases for everything else
import { getProfile } from '@/my/actions'
import { User } from '@/models'
```

---

## ✅ **DO's - CORRECT PATTERNS**

### **✓ Use Barrel Exports**
```typescript
// GOOD ✅
import { User, UserPreferences } from '@/models'
import { ApiKey, ApiRequest } from '@/api/models'

// BAD ❌
import User from '@/subdomain/education/models/User'
import ApiKey from '@/subdomain/api/models/ApiKey'
```

### **✓ Consistent Aliases**
```typescript
// GOOD ✅
import { AuthService } from '@/auth/services'
import { ProfileService } from '@/my/services'
import { ApiKeyService } from '@/api/services'

// BAD ❌
import { AuthService } from '@/subdomain/auth/services/auth.service'
import { ProfileService } from '../../../subdomain/myaccount/services/profile.service'
```

### **✓ Type Imports**
```typescript
// GOOD ✅
import type { IUser, IApiKey } from '@/models'
import type { IUserPreferences } from '@/my/models'

// Also acceptable
import { type IUser } from '@/models'
```

---

## ❌ **DON'Ts - AVOID THESE**

### **✗ Deep Imports**
```typescript
// BAD ❌
import User from '@/subdomain/education/models/User.ts'
import { AuthService } from '@/subdomain/auth/services/auth.service.ts'

// GOOD ✅
import { User } from '@/models'
import { AuthService } from '@/auth/services'
```

### **✗ Relative Paths Across Features**
```typescript
// BAD ❌
import { User } from '../../../education/models/User'
import { AuthService } from '../../auth/services'

// GOOD ✅
import { User } from '@/models'
import { AuthService } from '@/auth/services'
```

### **✗ Mixed Patterns**
```typescript
// BAD ❌ - Inconsistent
import User from '@/edu/models/User'
import { ApiKey } from '@/api/models'
import SessionService from '@/subdomain/auth/services/session.service'

// GOOD ✅ - Consistent
import { User } from '@/models'
import { ApiKey } from '@/api/models'
import { SessionService } from '@/auth/services'
```

---

## 📁 **PATH ALIAS REFERENCE**

| Alias | Points To | Usage |
|-------|-----------|-------|
| `@/*` | `./src/*` | Fallback for any src file |
| `@/auth/*` | `./src/subdomain/auth/*` | Auth features |
| `@/my/*` | `./src/subdomain/myaccount/*` | MyAccount features |
| `@/api/*` | `./src/subdomain/api/*` | API management |
| `@/edu/*` | `./src/subdomain/education/*` | Education domain |
| `@ump/*` | `./src/subdomain/ump/*` | UMP admin |
| `@dev/*` | `./src/subdomain/developer/*` | Developer portal |
| `@/components/*` | `./src/components/*` | Shared components |
| `@/ui/*` | `./src/components/ui/*` | UI components (Shadcn) |
| `@/lib/*` | `./src/lib/*` | Utilities & libs |
| `@/models/*` | `./src/subdomain/education/models/*` | Database models |
| `@/shared/*` | `./src/shared/*` | Shared resources |

---

## 🎯 **MIGRATION GUIDE**

### **Step 1: Find & Replace**

Old Pattern → New Pattern:

```bash
# User model
'@/subdomain/education/models/User' → '@/models'
'@/edu/models/User' → '@/models'

# Auth services
'@/subdomain/auth/services/auth.service' → '@/auth/services'
'@/subdomain/auth/services/session.service' → '@/auth/services'

# MyAccount
'@/subdomain/myaccount/' → '@/my/'

# API
'@/subdomain/api/' → '@/api/'

# UMP
'@/subdomain/ump/' → '@ump/'
```

### **Step 2: Update Imports**

```typescript
// Before
import User from '@/subdomain/education/models/User'
import { AuthService } from '@/subdomain/auth/services/auth.service'
import { Button } from '@/components/ui/button'

// After
import { User } from '@/models'
import { AuthService } from '@/auth/services'
import { Button } from '@/ui'
```

### **Step 3: Verify**

```bash
# Check for old patterns
grep -r "@/subdomain/" src/

# Should return minimal results
```

---

## 💡 **BEST PRACTICES**

### **1. Use Barrel Exports**
Always export through `index.ts`:
```typescript
// services/index.ts
export { AuthService } from './auth.service'
export { SessionService } from './session.service'

// Usage
import { AuthService, SessionService } from '@/auth/services'
```

### **2. Group Related Imports**
```typescript
// Group by source
import { User, Session } from '@/models'
import { AuthService } from '@/auth/services'
import { Button, Input } from '@/ui'
import { cn } from '@/lib/utils'
```

### **3. Prefer Named Exports**
```typescript
// GOOD ✅
export { MyComponent }
import { MyComponent } from '@/components'

// AVOID (unless necessary)
export default MyComponent
import MyComponent from '@/components/MyComponent'
```

---

## 🚀 **QUICK REFERENCE**

### **Common Imports:**

```typescript
// Models
import { User } from '@/models'
import type { IUser } from '@/models'

// Services
import { AuthService } from '@/auth/services'
import { ProfileService } from '@/my/services'
import { ApiKeyService } from '@/api/services'

// Components
import { Button, Input } from '@/ui'
import { LoginForm } from '@/auth/components/forms'

// Actions
import { loginAction } from '@/auth/actions'
import { getProfile } from '@/my/actions'

// Utils
import connectDB from '@/lib/db'
```

---

## ✅ **CHECKLIST**

Before committing code:

- [ ] All imports use path aliases
- [ ] No deep relative imports (`../../../`)
- [ ] Using barrel exports from index.ts
- [ ] Consistent pattern across files
- [ ] Type imports use `type` keyword
- [ ] No `.ts` or `.tsx` extensions in imports

---

**Last Updated:** 2026-01-07  
**Version:** 1.0  
**Status:** ✅ Active Standard
