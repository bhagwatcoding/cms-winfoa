# Project Refactoring Plan: Schema, Validation & Interface Organization

## Current Issues
1. **Duplicate schemas** exist in both `src/shared/lib/utils/schemas/` and `src/shared/lib/utils/validations/`
2. **Inline interfaces** are defined directly in action files (e.g., `signup.ts` has `SignupData` interface)
3. **Inline schemas** are defined in component/action files (e.g., `wallet/actions.ts` has wallet schemas)
4. **No centralized interface file** - the `interface/` directory is currently empty
5. **Inconsistent imports** - some files import from schemas, others from validations

## Target Structure

### 1. Schemas (`src/shared/lib/utils/schemas/*.schema.ts`)
**Purpose:** Zod validation schemas
**Location:** `src/shared/lib/utils/schemas/`
**Files to create/consolidate:**
- `auth.schema.ts` - Authentication schemas (login, signup, forgot-password, reset-password, change-password)
- `user.schema.ts` - User management schemas
- `wallet.schema.ts` - Wallet transaction schemas (recharge, transfer, withdrawal, bill-payment)
- `notification.schema.ts` - Notification schemas
- `transaction.schema.ts` - Transaction schemas
- `api-key.schema.ts` - API key schemas
- `academy/` - Academy-related schemas
  - `student.schema.ts`
  - `course.schema.ts`
  - `employee.schema.ts`
  - `result.schema.ts`
  - `certificate.schema.ts`
  - `admit-card.schema.ts`

### 2. Validations (`src/shared/lib/utils/validations/validation.ts`)
**Purpose:** Validation utility functions ONLY (not schemas)
**Location:** `src/shared/lib/utils/validations/validation.ts`
**Contents:**
- `validateSchema()` - Synchronous validation
- `validateSchemaAsync()` - Async validation
- `safeParseWithDefault()` - Safe parsing with defaults
- `getFirstErrorMessage()` - Error message extraction
- `groupErrorsByField()` - Field error grouping
- `formatValidationErrors()` - Error formatting
- Helper types: `ValidationError`, `ValidationResult<T>`

### 3. Interfaces (`src/shared/lib/utils/interface/interface.ts`)
**Purpose:** TypeScript interfaces for data structures
**Location:** `src/shared/lib/utils/interface/interface.ts`
**Contents:**
- Auth interfaces (SignupData, LoginData, SessionData, etc.)
- User interfaces (UserData, UserProfile, etc.)
- Wallet interfaces (WalletRecharge, WalletTransfer, etc.)
- Transaction interfaces
- Notification interfaces
- All other domain-specific interfaces

## Migration Steps

### Step 1: Consolidate Schemas
1. Remove duplicate schemas from `validations/*.validation.ts`
2. Keep only schemas in `schemas/*.schema.ts`
3. Ensure all schemas export their inferred types: `export type XInput = z.infer<typeof xSchema>`

### Step 2: Create Central Interface File
1. Create `src/shared/lib/utils/interface/interface.ts`
2. Extract all inline interfaces from:
   - `src/shared/actions/auth/signup.ts` (SignupData)
   - `src/app/wallet/actions.ts` (wallet types)
   - Other action files with inline interfaces
3. Organize interfaces by domain (Auth, User, Wallet, etc.)

### Step 3: Consolidate Validation Utils
1. Keep only helper functions in `validations/validation.ts`
2. Remove schemas from validation files
3. Ensure validation utils import schemas from `schemas/`

### Step 4: Update All Imports
1. Update all files importing schemas to use `@/shared/lib/utils/schemas/`
2. Update all files with inline interfaces to import from `@/shared/lib/utils/interface/interface`
3. Update validation imports to use `@/shared/lib/utils/validations/validation`

### Step 5: Create Index Exports
1. Create/update `src/shared/lib/utils/schemas/index.ts` - Export all schemas
2. Create `src/shared/lib/utils/interface/index.ts` - Export all interfaces
3. Create/update `src/shared/lib/utils/validations/index.ts` - Export validation utils

## Impact Analysis

### Files with Inline Schemas (Need to be moved to schemas/)
1. `src/app/wallet/actions.ts` - rechargeSchema, transferSchema, withdrawalSchema, billPaymentSchema
2. Other action files may have inline schemas

### Files with Inline Interfaces (Need to be moved to interface.ts)
1. `src/shared/actions/auth/signup.ts` - SignupData
2. `src/app/wallet/actions.ts` - wallet-related interfaces
3. Multiple component files with inline interfaces

### Files with Duplicate Schemas (Need consolidation)
1. `src/shared/lib/utils/schemas/auth.ts` vs `src/shared/lib/utils/validations/auth.validation.ts`
2. Similar duplication may exist for other domains

## Expected Benefits
1. ✅ Single source of truth for schemas
2. ✅ Single source of truth for interfaces
3. ✅ Clear separation of concerns
4. ✅ Easier maintenance and updates
5. ✅ Better code discoverability
6. ✅ Reduced duplication
7. ✅ Consistent import patterns

## Naming Convention
- Schemas: `*.schema.ts` - e.g., `auth.schema.ts`
- Interfaces: `interface.ts` or domain-specific like `auth.interface.ts`
- Validations: `validation.ts` for utility functions only
