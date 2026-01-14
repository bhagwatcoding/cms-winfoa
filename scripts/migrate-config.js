#!/usr/bin/env node

/**
 * Migration Script: Old Constants → New Config
 * 
 * This script helps identify files that still use old constants
 * and need to be migrated to the new @/config structure
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for (old constants)
const OLD_PATTERNS = [
    'SESSION_COOKIE_NAME',
    'SESSION_MAX_AGE',
    'SESSION_SECRET',
    'MONGODB_URI',
    'MONGODB_NAME',
    'ROOT_DOMAIN',
    'IS_PRODUCTION',
    'IS_DEVELOPMENT',
    'from "@/lib/constants"',
    'from \'@/lib/constants\'',
    'process.env.SESSION_COOKIE_NAME',
    'process.env.SESSION_MAX_AGE',
    'process.env.MONGODB_URI',
];

// Suggested replacements
const REPLACEMENTS = {
    'SESSION_COOKIE_NAME': 'SESSION.COOKIE_NAME',
    'SESSION_MAX_AGE': 'SESSION.DURATION * 1000',
    'SESSION_SECRET': 'SESSION.SECRET',
    'MONGODB_URI': 'DB.URI',
    'MONGODB_NAME': 'DB.NAME',
    'ROOT_DOMAIN': 'TENANCY.ROOT_DOMAIN',
    'IS_PRODUCTION': 'env.NODE_ENV === "production"',
    'IS_DEVELOPMENT': 'env.NODE_ENV === "development"',
    'from "@/lib/constants"': 'from "@/config"',
    'from \'@/lib/constants\'': 'from \'@/config\'',
};

console.log('🔍 Scanning for files using old constants...\n');
console.log('Files that need migration:\n');

// Files already migrated (skip these)
const MIGRATED_FILES = [
    'src/shared/lib/db.ts',
    'src/shared/lib/auth/session.ts',
    'src/shared/proxy/config.ts',
];

// Scan src directory for TypeScript files
function scanDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        const relativePath = fullPath.replace(process.cwd() + path.sep, '').replace(/\\/g, '/');

        if (file.isDirectory()) {
            // Skip node_modules, .next, etc.
            if (!['node_modules', '.next', 'out', 'build', 'dist', '.git'].includes(file.name)) {
                scanDirectory(fullPath);
            }
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            // Skip migrated files
            if (MIGRATED_FILES.includes(relativePath)) return;

            const content = fs.readFileSync(fullPath, 'utf-8');
            const foundPatterns = [];

            OLD_PATTERNS.forEach(pattern => {
                if (content.includes(pattern)) {
                    foundPatterns.push(pattern);
                }
            });

            if (foundPatterns.length > 0) {
                console.log(`📄 ${relativePath}`);
                foundPatterns.forEach(pattern => {
                    const suggestion = REPLACEMENTS[pattern];
                    if (suggestion) {
                        console.log(`   ⚠️  ${pattern} → ${suggestion}`);
                    } else {
                        console.log(`   ⚠️  ${pattern}`);
                    }
                });
                console.log('');
            }
        }
    });
}

// Start scanning from src directory
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
    scanDirectory(srcPath);
} else {
    console.error('❌ src directory not found');
    process.exit(1);
}

console.log('\n✅ Scan complete!');
console.log('\n📝 Migration Steps:');
console.log('1. Update imports: import { SESSION, DB, TENANCY, env } from "@/config"');
console.log('2. Replace constants with new config values (see suggestions above)');
console.log('3. Test the file after migration');
console.log('4. Commit changes');
console.log('\n💡 Tip: Use search & replace in your editor for faster migration\n');
