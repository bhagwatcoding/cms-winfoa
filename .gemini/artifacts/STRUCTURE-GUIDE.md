# Project Structure - Visual Guide

## 🏗️ New Organization Structure

```
src/shared/lib/utils/
│
├── schemas/                          # ✅ All Zod Schemas Here
│   ├── index.ts                      # Exports all schemas
│   ├── auth.ts                       # ✅ Login, signup, password schemas
│   ├── user.ts                       # ✅ User CRUD schemas
│   ├── wallet.schema.ts              # ✅ NEW: Wallet schemas
│   ├── settings.schema.ts            # ✅ NEW: Settings schemas
│   ├── account.schema.ts             # ✅ NEW: Account schemas
│   ├── admin.schema.ts               # ✅ NEW: Admin schemas
│   ├── transaction.ts                # ✅ Transaction schemas
│   ├── notification.ts               # ✅ Notification schemas
│   ├── api-key.ts                    # ✅ API key schemas
│   └── academy/                      # ✅ Academy schemas
│       ├── student.ts
│       ├── course.ts
│       ├── employee.ts
│       ├── result.ts
│       ├── certificate.ts
│       └── admit-card.ts
│
├── validations/                      # ✅ Only Utility Functions
│   ├── index.ts                      # Exports validation utilities
│   └── validation.ts                 # ✅ NEW: All validation helpers
│       ├── validateSchema()
│       ├── validateSchemaAsync()
│       ├── getFirstErrorMessage()
│       └── ... more utilities
│
└── interface/                        # ✅ All TypeScript Interfaces
    ├── index.ts                      # Exports all interfaces
    └── interface.ts                  # ✅ NEW: Centralized interfaces
        ├── Auth interfaces
        ├── User interfaces
        ├── Wallet interfaces
        ├── Transaction interfaces
        ├── Notification interfaces
        ├── Settings interfaces
        ├── Academy interfaces
        └── Common response interfaces
```

## 📝 Import Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Your Application Files                │
│  (actions/, features/, app/, components/, etc.)         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ imports from ↓
                  │
    ┌─────────────┴──────────────┬──────────────────────┐
    │                            │                      │
    ▼                            ▼                      ▼
┌─────────┐              ┌────────────┐        ┌──────────┐
│ SCHEMAS │              │ VALIDATIONS│        │INTERFACES│
└─────────┘              └────────────┘        └──────────┘
    │                            │                      │
    │ Zod schemas                │ Helper functions     │ TypeScript types
    │                            │                      │
    │ - loginSchema              │ - validateSchema()   │ - SignupData
    │ - rechargeSchema           │ - ValidationError    │ - UserData
    │ - createUserSchema         │ - getFirstError()    │ - WalletData
    │ - ...                      │ - ...                │ - ...
    │                            │                      │
┌───┴────────────────────────────┴──────────────────────┴────┐
│          src/shared/lib/utils/                             │
│  ├── schemas/                                              │
│  ├── validations/                                          │
│  └── interface/                                            │
└────────────────────────────────────────────────────────────┘
```

## 🎯 Usage Examples

### Example 1: Auth Action File

```typescript
// ✅ CORRECT WAY
import { validateSchema } from '@/shared/lib/utils/validations';
import { loginSchema } from '@/shared/lib/utils/schemas';
import type { LoginData } from '@/shared/lib/utils/interface';

export async function loginAction(data: LoginData) {
    const validation = validateSchema(loginSchema, data);
    if (!validation.success) {
        return { error: validation.errors };
    }
    // ... login logic
}
```

```typescript
// ❌ OLD WAY (Don't use)
import { validateSchema } from '@/shared/lib/utils/validations/utils';
import { loginSchema } from '@/shared/lib/utils/validations/auth.validation';

interface LoginData { ... } // inline definition

export async function loginAction(data: LoginData) {
    // ...
}
```

### Example 2: Wallet Action File

```typescript
// ✅ CORRECT WAY
import { validateSchema } from '@/shared/lib/utils/validations';
import { rechargeSchema, transferSchema } from '@/shared/lib/utils/schemas';
import type { WalletRechargeData } from '@/shared/lib/utils/interface';

export async function rechargeWallet(data: WalletRechargeData) {
    const validation = validateSchema(rechargeSchema, data);
    // ...
}
```

```typescript
// ❌ OLD WAY (Don't use)
import { z } from 'zod';

const rechargeSchema = z.object({ ... }); // inline schema

export async function rechargeWallet(amount: number) {
    // ...
}
```

### Example 3: User Service File

```typescript
// ✅ CORRECT WAY
import { validateSchema } from '@/shared/lib/utils/validations';
import { createUserSchema, updateUserSchema } from '@/shared/lib/utils/schemas';
import type { UserData } from '@/shared/lib/utils/interface';

class UserService {
    async createUser(data: UserData) {
        const validation = validateSchema(createUserSchema, data);
        // ...
    }
}
```

## 📊 Migration Path

```
OLD STRUCTURE (Before)          →          NEW STRUCTURE (After)
─────────────────────────────────────────────────────────────────

Inline schemas everywhere       →      schemas/*.schema.ts
Inline interfaces everywhere    →      interface/interface.ts
validations/utils.ts            →      validations/validation.ts
validations/auth.validation.ts  →      schemas/auth.ts
validations/wallet.validation.ts →     schemas/wallet.schema.ts

                    ↓
        SINGLE SOURCE OF TRUTH
                    ↓
    ┌─────────────────────────────┐
    │  schemas/    (Zod schemas) │
    │  validations/ (Utilities)   │
    │  interface/   (TypeScript)  │
    └─────────────────────────────┘
```

## ✨ Benefits

```
┌──────────────────┐
│  BEFORE          │
└──────────────────┘
- Duplicated schemas in multiple files
- Inline interfaces scattered everywhere
- Mixed validation code with schemas
- Hard to find specific schema
- Inconsistent import patterns

↓ AFTER REFACTORING ↓

┌──────────────────┐
│  AFTER           │
└──────────────────┘
✅ Single source of truth
✅ Clear separation (schemas/validations/interfaces)
✅ Easy to discover and maintain
✅ Consistent import patterns
✅ No duplication
✅ Better TypeScript support
```

## 🔍 How to Find Things

**Need a schema?**
→ Look in `schemas/*.schema.ts` or `schemas/auth.ts`, etc.

**Need a validation utility?**
→ Look in `validations/validation.ts`

**Need an interface/type?**
→ Look in `interface/interface.ts`

**Need everything from one domain?**
→ Import from index:
```typescript
import { loginSchema, signupSchema } from '@/shared/lib/utils/schemas';
```

## 📋 Quick Checklist

- [x] Create schemas/ files
- [x] Create validations/validation.ts
- [x] Create interface/interface.ts
- [x] Create index.ts files
- [x] Update example files
- [ ] Update remaining 20 files
- [ ] Delete old duplicate files
- [ ] Run build check
- [ ] Test application

---

**Remember:** 
- Schemas go in `schemas/`
- Validation utilities go in `validations/`
- Interfaces go in `interface/`
- Always import from these locations!
