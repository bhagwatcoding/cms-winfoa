# Remaining Files to Update

## Files Importing from `validations/utils`

These files need to update their imports from:
```typescript
import { validateSchema } from '@/shared/lib/utils/validations/utils';
```

To:
```typescript
import { validateSchema } from '@/shared/lib/utils/validations';
```

### List of Files:
1.  ✅ `src/app/wallet/actions.ts` - DONE
2. `src/shared/types/api/responses.ts` - Update ValidationError import
3. `src/shared/lib/helpers/auth.helpers.ts` - Update import path
4. `src/shared/actions/users/index.ts`
5. `src/shared/actions/ump/users.ts`
6. `src/shared/actions/skills/admit-cards.ts`
7. `src/shared/actions/skills/courses.ts`
8. `src/shared/actions/skills/employees.ts`
9. `src/shared/actions/skills/results.ts`
10. `src/shared/actions/skills/students.ts`
11. `src/shared/actions/skills/transactions.ts`
12. `src/shared/actions/skills/notifications.ts`
13. `src/shared/actions/skills/certificates.ts`
14. `src/shared/actions/myaccount/profile.ts`
15. `src/shared/actions/developer/api-keys.ts`
16. `src/shared/actions/auth/login.ts`
17. `src/features/api-management/actions/apikey.ts`
18. `src/features/admin/actions/user-registry.ts`
19. `src/features/account/actions/settings.ts`
20. `src/features/account/actions/profile.ts`

## Files Importing from `validations/auth.validation`

This file needs to update imports from:
```typescript
import { loginSchema, ... } from '@/shared/lib/utils/validations/auth.validation';
```

To:
```typescript
import { loginSchema, ... } from '@/shared/lib/utils/schemas';
```

### List of Files:
1. ✅ `src/shared/services/auth.service.ts` - DONE

## Quick Fix Script

For PowerShell (Windows):

### 1. Update validations/utils imports
```powershell
# Navigate to project root
cd c:\webapps\next\winfoa

# Update imports from validations/utils.ts to validations/
$files = @(
    "src\shared\types\api\responses.ts",
    "src\shared\lib\helpers\auth.helpers.ts",
    "src\shared\actions\users\index.ts",
    "src\shared\actions\ump\users.ts",
    "src\shared\actions\skills\admit-cards.ts",
    "src\shared\actions\skills\courses.ts",
    "src\shared\actions\skills\employees.ts",
    "src\shared\actions\skills\results.ts",
    "src\shared\actions\skills\students.ts",
    "src\shared\actions\skills\transactions.ts",
    "src\shared\actions\skills\notifications.ts",
    "src\shared\actions\skills\certificates.ts",
    "src\shared\actions\myaccount\profile.ts",
    "src\shared\actions\developer\api-keys.ts",
    "src\shared\actions\auth\login.ts",
    "src\features\api-management\actions\apikey.ts",
    "src\features\admin\actions\user-registry.ts",
    "src\features\account\actions\settings.ts",
    "src\features\account\actions\profile.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        (Get-Content $file -Raw) `
            -replace "@/shared/lib/utils/validations/utils'", "@/shared/lib/utils/validations'" `
            -replace '@/shared/lib/utils/validations/utils"', '@/shared/lib/utils/validations"' `
            -replace "@/shared/lib/utils/validations/utils\.validation'", "@/shared/lib/utils/validations'" `
            -replace '@/shared/lib/utils/validations/utils\.validation"', '@/shared/lib/utils/validations"' `
            | Set-Content $file
        Write-Host "Updated: $file"
    }
}
```

### 2. Manual Import Path Summary

After running the script, verify these import patterns are correct:

#### ✅ For Validation Utilities:
```typescript
import { validateSchema, ValidationError } from '@/shared/lib/utils/validations';
```

#### ✅ For All Schemas:
```typescript
import { loginSchema, signupSchema, createUserSchema } from '@/shared/lib/utils/schemas';
```

#### ✅ For All Interfaces:
```typescript
import type { SignupData, UserData } from '@/shared/lib/utils/interface';
```

## Summary of Changes Needed

### Pattern 1: Replace utils validation imports
- Old: `@/shared/lib/utils/validations/utils`
- Old: `@/shared/lib/utils/validations/utils.validation`
- New: `@/shared/lib/utils/validations`

### Pattern 2: Replace auth validation imports
- Old: `@/shared/lib/utils/validations/auth.validation`
- New: `@/shared/lib/utils/schemas` (for schemas and types)

### Pattern 3: Add interface imports where needed
- Add: `import type { InterfaceName } from '@/shared/lib/utils/interface';`

## Verification

After all updates, run:
```bash
npm run build
```

Or manually check TypeScript:
```bash
npx tsc --noEmit
```
