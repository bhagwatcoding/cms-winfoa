# 🚀 MIGRATION GUIDE - Full Restructure

**Created:** 2026-01-07 20:01 IST  
**Status:** Ready to Execute  
**Scripts Created:** 3

---

## 📦 **WHAT WAS CREATED**

### **Migration Scripts:**

1. **`scripts/migrate-to-features.ps1`** (PowerShell - Windows)
2. **`scripts/migrate-to-features.sh`** (Bash - Linux/Mac)
3. **`scripts/rollback-migration.ps1`** (Rollback if needed)

---

## 🎯 **BEFORE YOU RUN**

### **Prerequisites:**

✅ **Commit your current code:**
```bash
git add .
git commit -m "Before restructure - working state"
```

✅ **Close dev server** (Ctrl+C if running)

✅ **Read this entire guide first!**

---

## 🚀 **HOW TO RUN**

### **On Windows (PowerShell):**

```powershell
# 1. Open PowerShell in project root
cd c:\webapps\next\winfoa

# 2. Allow script execution (if needed)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 3. Run migration script
.\scripts\migrate-to-features.ps1
```

### **On Linux/Mac (Bash):**

```bash
# 1. Navigate to project root
cd /path/to/winfoa

# 2. Make script executable
chmod +x scripts/migrate-to-features.sh

# 3. Run migration script
bash scripts/migrate-to-features.sh
```

---

## 📋 **WHAT THE SCRIPT DOES**

### **Phase 1: Backup** (Auto)
- Creates timestamped backup folder
- Copies entire `src/` directory
- Safe fallback if anything goes wrong

### **Phase 2: Create Structure** (Auto)
```
src/
├── features/           ← NEW
│   ├── auth/
│   ├── account/
│   ├── api-management/
│   ├── admin/
│   └── education/
│
└── shared/            ← NEW
    ├── components/
    ├── lib/
    ├── hooks/
    └── types/
```

### **Phase 3: Move Files** (Auto)
- Copies all files to new locations
- Preserves original (safe!)
- Organizes by feature

### **Phase 4: Update Config** (Auto)
- Updates `tsconfig.json`
- Adds new path aliases
- Enables clean imports

---

## ⚠️ **AFTER RUNNING SCRIPT**

### **Step 1: Check for Errors**

```bash
# Start dev server
npm run dev
```

**If errors appear:**
- Read error messages
- Most will be import path issues
- Easy to fix!

---

### **Step 2: Update Imports**

**Find & Replace Pattern:**

```typescript
// OLD → NEW
'@/subdomain/auth/' → '@/auth/'
'@/subdomain/myaccount/' → '@/account/'
'@/subdomain/api/' → '@/api-mgmt/'
'@/subdomain/ump/' → '@/admin/'
'@/edu/models/' → '@/models/'
```

**VS Code Find & Replace:**
1. Press `Ctrl+Shift+H`
2. Enable regex mode
3. Find: `@/subdomain/auth/`
4. Replace: `@/auth/`
5. Replace All

---

### **Step 3: Delete Old Folders** (After verification only!)

```bash
# Only after everything works!
rm -rf src/subdomain
rm -rf src/components (if empty)
rm -rf src/lib (if empty)
```

---

## 🔄 **IF SOMETHING GOES WRONG**

### **Rollback Option 1: Use Script**

```powershell
# Windows
.\scripts\rollback-migration.ps1 -BackupDir "backup_YYYYMMDD_HHMMSS"

# Linux/Mac
cp -r backup_*/src/* src/
```

### **Rollback Option 2: Git**

```bash
# If you committed before
git reset --hard HEAD
```

---

## ✅ **VERIFICATION CHECKLIST**

After migration, verify:

- [ ] Dev server starts without errors
- [ ] Landing page loads
- [ ] Auth pages work
- [ ] MyAccount pages work
- [ ] API pages work
- [ ] UMP pages work
- [ ] All imports resolve
- [ ] No TypeScript errors

---

## 📊 **EXPECTED RESULTS**

### **Before:**
```
src/subdomain/
├── auth/
├── myaccount/
├── api/
└── ump/
```

### **After:**
```
src/
├── features/
│   ├── auth/
│   ├── account/
│   ├── api-management/
│   └── admin/
└── shared/
    ├── components/
    ├── lib/
    └── models/
```

---

## 🎯 **IMPORT EXAMPLES**

### **After Migration:**

```typescript
// Clean, consistent imports
import { User } from '@/models'
import { AuthService } from '@/auth/services'
import { ProfileForm } from '@/account/components/profile'
import { Button } from '@/ui'
import { ApiKeyService } from '@/api-mgmt/services'
```

---

## ⏱️ **TIME ESTIMATE**

**Script execution:** 1-2 minutes  
**Import updates:** 20-30 minutes  
**Testing:** 15-20 minutes  
**Total:** ~40-50 minutes

---

## 💡 **TIPS**

### **1. Do It in Steps**

Don't rush! Take your time with find-replace.

### **2. Test Frequently**

Check dev server after each major change.

### **3. Keep Backup**

Don't delete backup folder until 100% sure.

### **4. Use Git**

Commit after successful migration.

---

## 🚨 **COMMON ISSUES & FIXES**

### **Issue 1: Import Errors**

**Error:** `Cannot find module '@/subdomain/auth'`

**Fix:**
```typescript
// Change
import { AuthService } from '@/subdomain/auth/services'
// To
import { AuthService } from '@/auth/services'
```

### **Issue 2: Model Not Found**

**Error:** `Cannot find module '@/edu/models/User'`

**Fix:**
```typescript
// Change
import User from '@/edu/models/User'
// To
import { User } from '@/models'
```

### **Issue 3: UI Components**

**Error:** `Cannot find module '@/components/ui/button'`

**Fix:**
```typescript
// Change
import { Button } from '@/components/ui/button'
// To
import { Button } from '@/ui'
```

---

## 📝 **POST-MIGRATION TASKS**

### **1. Update Documentation**

Update any docs mentioning old paths.

### **2. Create .gitignore Entry**

```
# .gitignore
backup_*/
```

### **3. Clean Up**

After 100% verification:
```bash
rm -rf src/subdomain
rm -rf backup_*
```

---

## ✅ **WHEN DONE**

### **Commit Changes:**

```bash
git add .
git commit -m "feat: restructure to feature-based architecture

- Moved subdomains to src/features/
- Created shared/ directory
- Updated all imports
- Improved code organization"
```

---

## 🎉 **SUCCESS CRITERIA**

Migration is successful when:

✅ No TypeScript errors  
✅ Dev server runs  
✅ All pages load  
✅ All features work  
✅ Imports are clean  
✅ Structure is logical  

---

## 📞 **NEED HELP?**

### **If Stuck:**

1. Check `IMPORT_STANDARDS.md`
2. Review error messages
3. Use rollback script
4. Restore from git

---

## 🎯 **READY?**

**Before running:**
- [ ] Read entire guide
- [ ] Commit current code
- [ ] Close dev server
- [ ] Backup manually (optional)

**Then run the script!**

```powershell
# Windows
.\scripts\migrate-to-features.ps1

# Linux/Mac
bash scripts/migrate-to-features.sh
```

---

**Good luck! The script makes it safe and easy!** 🚀

**Backup is automatic, rollback is available!** ✅
