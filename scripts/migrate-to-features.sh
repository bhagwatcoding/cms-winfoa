#!/bin/bash
# Bash Migration Script for WINFOA Restructure (Linux/Mac)
# Run this from project root: bash scripts/migrate-to-features.sh

echo "🚀 WINFOA Project Restructure - Starting..."
echo ""

# Create backup first
echo "📦 Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src "$BACKUP_DIR/"
echo "✅ Backup created at: $BACKUP_DIR"
echo ""

# Phase 1: Create new directory structure
echo "📁 Phase 1: Creating new directory structure..."

mkdir -p src/features/auth
mkdir -p src/features/account
mkdir -p src/features/api-management
mkdir -p src/features/admin
mkdir -p src/features/education
mkdir -p src/shared/components/ui
mkdir -p src/shared/lib/db/models
mkdir -p src/shared/lib/utils
mkdir -p src/shared/hooks
mkdir -p src/shared/types

echo "✅ Phase 1 Complete"
echo ""

# Phase 2: Move files
echo "📦 Phase 2: Moving files..."

# Move Auth
if [ -d "src/subdomain/auth" ]; then
    echo "  Moving Auth subdomain..."
    cp -r src/subdomain/auth/* src/features/auth/
    echo "  ✓ Auth moved to features/auth"
fi

# Move MyAccount
if [ -d "src/subdomain/myaccount" ]; then
    echo "  Moving MyAccount subdomain..."
    cp -r src/subdomain/myaccount/* src/features/account/
    echo "  ✓ MyAccount moved to features/account"
fi

# Move API
if [ -d "src/subdomain/api" ]; then
    echo "  Moving API subdomain..."
    cp -r src/subdomain/api/* src/features/api-management/
    echo "  ✓ API moved to features/api-management"
fi

# Move UMP
if [ -d "src/subdomain/ump" ]; then
    echo "  Moving UMP subdomain..."
    cp -r src/subdomain/ump/* src/features/admin/
    echo "  ✓ UMP moved to features/admin"
fi

# Move Education models
if [ -d "src/subdomain/education/models" ]; then
    echo "  Moving Education models..."
    cp -r src/subdomain/education/models/* src/shared/lib/db/models/
    echo "  ✓ Models moved to shared/lib/db/models"
fi

# Move UI components
if [ -d "src/components/ui" ]; then
    echo "  Moving UI components..."
    cp -r src/components/ui/* src/shared/components/ui/
    echo "  ✓ UI components moved to shared/components/ui"
fi

# Move lib files
if [ -d "src/lib" ]; then
    echo "  Moving lib files..."
    cp -r src/lib/* src/shared/lib/
    echo "  ✓ Lib files moved to shared/lib"
fi

echo "✅ Phase 2 Complete"
echo ""

# Phase 3: Update tsconfig.json
echo "⚙️  Phase 3: Updating tsconfig.json..."

cat > tsconfig.json << 'EOF'
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
EOF

echo "  ✓ tsconfig.json updated with new paths"
echo "✅ Phase 3 Complete"
echo ""

# Summary
echo "🎉 Migration Complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Run: npm run dev"
echo "  2. Check for import errors"
echo "  3. Update imports using find-replace"
echo "  4. Test all features"
echo ""
echo "⚠️  Old subdomain folder still exists for safety"
echo "   Delete 'src/subdomain' manually after verifying everything works"
echo ""
echo "📦 Backup location: $BACKUP_DIR"
echo ""
echo "✅ Done!"
