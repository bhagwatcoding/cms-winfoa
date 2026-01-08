/**
 * PROJECT CLEANUP & DEDUPLICATION SCRIPT
 * 
 * This script analyzes the project structure and removes known duplicates/legacy folders.
 * It is designed to be run from the project root: `node project_cleanup.js`
 */

const fs = require('fs');
const path = require('path');

const OPERATIONS = [
    // 1. Rename 'provider' to 'god' (Subdomain consistency)
    {
        type: 'MOVE',
        src: 'src/app/provider',
        dest: 'src/app/god',
        msg: 'Renaming src/app/provider -> src/app/god'
    },
    // 2. Move 'developer' to '(public)' (Organization)
    {
        type: 'MOVE',
        src: 'src/app/developer',
        dest: 'src/app/(public)/developer',
        msg: 'Moving src/app/developer -> src/app/(public)/developer'
    },
    // 3. Remove 'education' (Superseded by 'skills')
    {
        type: 'DELETE',
        src: 'src/app/education',
        msg: 'Removing legacy src/app/education'
    },
    // 4. Clean up root proxy files (Superseded by shared/lib/proxy)
    {
        type: 'DELETE',
        src: 'src/proxy.ts',
        msg: 'Removing redundant src/proxy.ts'
    },
    {
        type: 'DELETE',
        src: 'src/middleware.backup.ts',
        msg: 'Removing backup middleware'
    }
];

function execute() {
    console.log('Starting Project Deduplication...');
    let changes = 0;

    OPERATIONS.forEach(op => {
        const srcPath = path.resolve(process.cwd(), op.src);

        if (!fs.existsSync(srcPath)) {
            // console.log(`Skipping: ${op.src} not found.`);
            return;
        }

        try {
            if (op.type === 'DELETE') {
                const stats = fs.statSync(srcPath);
                if (stats.isDirectory()) {
                    fs.rmSync(srcPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(srcPath);
                }
                console.log(`[OK] ${op.msg}`);
                changes++;
            }
            else if (op.type === 'MOVE') {
                const destPath = path.resolve(process.cwd(), op.dest);
                const destParent = path.dirname(destPath);

                if (!fs.existsSync(destParent)) fs.mkdirSync(destParent, { recursive: true });

                if (fs.existsSync(destPath)) {
                    console.log(`[WARN] Target ${op.dest} exists. Backing it up...`);
                    fs.renameSync(destPath, destPath + '_backup_' + Date.now());
                }

                fs.renameSync(srcPath, destPath);
                console.log(`[OK] ${op.msg}`);
                changes++;
            }
        } catch (e) {
            console.error(`[ERR] Failed to ${op.msg}: ${e.message}`);
        }
    });

    if (changes === 0) {
        console.log('Project is already clean! No changes needed.');
    } else {
        console.log(`Cleanup complete. ${changes} operations performed.`);
    }
}

execute();
