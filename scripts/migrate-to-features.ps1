# PowerShell Migration Script for WINFOA Restructure
# Run this from project root: .\scripts\migrate-to-features.ps1

Write-Host "🚀 WINFOA Project Restructure - Starting..." -ForegroundColor Cyan
Write-Host ""

# Create backup first
Write-Host "📦 Creating backup..." -ForegroundColor Yellow
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Copy-Item -Path "src" -Destination "$backupDir/src" -Recurse -Force
Write-Host "✅ Backup created at: $backupDir" -ForegroundColor Green
Write-Host ""

# Phase 1: Create new directory structure
Write-Host "📁 Phase 1: Creating new directory structure..." -ForegroundColor Cyan

$directories = @(
    "src/features",
    "src/features/auth",
    "src/features/account", 
    "src/features/api-management",
    "src/features/admin",
    "src/features/education",
    "src/shared",
    "src/shared/components",
    "src/shared/components/ui",
    "src/shared/lib",
    "src/shared/lib/db",
    "src/shared/lib/db/models",
    "src/shared/lib/utils",
    "src/shared/hooks",
    "src/shared/types"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  ✓ Created: $dir" -ForegroundColor Gray
}

Write-Host "✅ Phase 1 Complete" -ForegroundColor Green
Write-Host ""

# Phase 2: Move files
Write-Host "📦 Phase 2: Moving files..." -ForegroundColor Cyan

# Move Auth
if (Test-Path "src/subdomain/auth") {
    Write-Host "  Moving Auth subdomain..." -ForegroundColor Yellow
    Copy-Item -Path "src/subdomain/auth/*" -Destination "src/features/auth" -Recurse -Force
    Write-Host "  ✓ Auth moved to features/auth" -ForegroundColor Gray
}

# Move MyAccount
if (Test-Path "src/subdomain/myaccount") {
    Write-Host "  Moving MyAccount subdomain..." -ForegroundColor Yellow
    Copy-Item -Path "src/subdomain/myaccount/*" -Destination "src/features/account" -Recurse -Force
    Write-Host "  ✓ MyAccount moved to features/account" -ForegroundColor Gray
}

# Move API
if (Test-Path "src/subdomain/api") {
    Write-Host "  Moving API subdomain..." -ForegroundColor Yellow
    Copy-Item -Path "src/subdomain/api/*" -Destination "src/features/api-management" -Recurse -Force
    Write-Host "  ✓ API moved to features/api-management" -ForegroundColor Gray
}

# Move UMP
if (Test-Path "src/subdomain/ump") {
    Write-Host "  Moving UMP subdomain..." -ForegroundColor Yellow
    Copy-Item -Path "src/subdomain/ump/*" -Destination "src/features/admin" -Recurse -Force
    Write-Host "  ✓ UMP moved to features/admin" -ForegroundColor Gray
}

# Move Education models
if (Test-Path "src/subdomain/education/models") {
    Write-Host "  Moving Education models..." -ForegroundColor Yellow
    Copy-Item -Path "src/subdomain/education/models/*" -Destination "src/shared/lib/db/models" -Recurse -Force
    Write-Host "  ✓ Models moved to shared/lib/db/models" -ForegroundColor Gray
}

# Move UI components
if (Test-Path "src/components/ui") {
    Write-Host "  Moving UI components..." -ForegroundColor Yellow
    Copy-Item -Path "src/components/ui/*" -Destination "src/shared/components/ui" -Recurse -Force
    Write-Host "  ✓ UI components moved to shared/components/ui" -ForegroundColor Gray
}

# Move lib files
if (Test-Path "src/lib") {
    Write-Host "  Moving lib files..." -ForegroundColor Yellow
    Copy-Item -Path "src/lib/*" -Destination "src/shared/lib" -Recurse -Force
    Write-Host "  ✓ Lib files moved to shared/lib" -ForegroundColor Gray
}

Write-Host "✅ Phase 2 Complete" -ForegroundColor Green
Write-Host ""

# Phase 3: Update tsconfig.json
Write-Host "⚙️  Phase 3: Updating tsconfig.json..." -ForegroundColor Cyan

$tsconfigContent = @"
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/auth/*": ["./src/features/auth/*"],
      "@/account/*": ["./src/features/account/*"],
      "@/api-mgmt/*": ["./src/features/api-management/*"],
      "@/admin/*": ["./src/features/admin/*"],
      "@/edu/*": ["./src/features/education/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/components/*": ["./src/shared/components/*"],
      "@/ui/*": ["./src/shared/components/ui/*"],
      "@/lib/*": ["./src/shared/lib/*"],
      "@/models/*": ["./src/shared/lib/db/models/*"],
      "@/hooks/*": ["./src/shared/hooks/*"],
      "@/types/*": ["./src/shared/types/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
"@

Set-Content -Path "tsconfig.json" -Value $tsconfigContent
Write-Host "  ✓ tsconfig.json updated with new paths" -ForegroundColor Gray
Write-Host "✅ Phase 3 Complete" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "🎉 Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Check for import errors" -ForegroundColor White
Write-Host "  3. Update imports using find-replace" -ForegroundColor White
Write-Host "  4. Test all features" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Old subdomain folder still exists for safety" -ForegroundColor Yellow
Write-Host "   Delete 'src/subdomain' manually after verifying everything works" -ForegroundColor Yellow
Write-Host ""
Write-Host "📦 Backup location: $backupDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
