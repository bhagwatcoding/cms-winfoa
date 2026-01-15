# Refactoring Migration Script
# This document lists commands to find files that need updates

## Find files importing from old validation files

### 1. Find imports from auth.validation
```bash
grep -r "validations/auth.validation" src/ --include="*.ts" --include="*.tsx"
```

### 2. Find imports from wallet.validation
```bash
grep -r "validations/wallet.validation" src/ --include="*.ts" --include="*.tsx"
```

### 3. Find imports from utils validation
```bash
grep -r "validations/utils" src/ --include="*.ts" --include="*.tsx"
```

### 4. Find imports from settings.validation
```bash
grep -r "validations/settings.validation" src/ --include="*.ts" --include="*.tsx"
```

### 5. Find imports from account.validation
```bash
grep -r "validations/account.validation" src/ --include="*.ts" --include="*.tsx"
```

### 6. Find imports from admin.validation
```bash
grep -r "validations/admin.validation" src/ --include="*.ts" --include="*.tsx"
```

## Find files with inline schemas

### 7. Find inline z.object schemas
```bash
grep -r "const.*Schema = z\.object" src/ --include="*.ts" --include="*.tsx"
```

### 8. Find inline export schemas
```bash
grep -r "export const.*Schema = z\.object" src/ --include="*.ts" --include="*.tsx"
```

## Find files with inline interfaces

### 9. Find inline interfaces in actions
```bash
grep -r "^interface " src/shared/actions/ --include="*.ts"
```

### 10. Find inline interfaces in app directory
```bash
grep -r "^interface " src/app/ --include="*.ts" --include="*.tsx"
```

### 11. Find inline interfaces in features
```bash
grep -r "^interface " src/features/ --include="*.ts" --include="*.tsx"
```

## Update Commands

### Replace imports (example)
```bash
# This is just an example pattern, adjust file paths as needed
# Windows PowerShell:
(Get-Content file.ts) -replace "from '@/shared/lib/utils/validations/auth.validation'", "from '@/shared/lib/utils/schemas'" | Set-Content file.ts
```

## Verification Commands

### Check TypeScript errors
```bash
npx tsc --noEmit
```

### Build the project
```bash
npm run build
```

### Run linter
```bash
npm run lint
```
