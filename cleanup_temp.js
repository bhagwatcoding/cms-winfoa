const fs = require('fs');
const path = require('path');

const rules = [
    { src: 'src/app/provider', dest: 'src/app/god', description: 'Renaming Provider folder to God' },
    { src: 'src/app/developer', dest: 'src/app/(public)/developer', description: 'Moving Developer folder' },
    { src: 'src/app/education', dest: null, description: 'Removing legacy Education folder' },
    { src: 'src/middleware.backup.ts', dest: null, description: 'Removing backup middleware' },
    { src: 'src/proxy.ts', dest: null, description: 'Removing root proxy file' }
];

function runCleanup() {
    console.log('🚀 Starting Project Cleanup & Deduplication...\n');
    const rootDir = process.cwd();

    rules.forEach(rule => {
        const srcPath = path.resolve(rootDir, rule.src);

        if (!fs.existsSync(srcPath)) { return; }

        try {
            if (rule.dest === null) {
                const stats = fs.statSync(srcPath);
                if (stats.isDirectory()) {
                    fs.rmSync(srcPath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(srcPath);
                }
                console.log(`✅ DELETED: ${rule.src}`);
            } else {
                const destPath = path.resolve(rootDir, rule.dest);
                const destParent = path.dirname(destPath);
                if (!fs.existsSync(destParent)) fs.mkdirSync(destParent, { recursive: true });

                if (fs.existsSync(destPath)) {
                    // Since server is stopped, we can try to merge or rename old
                    const backupName = destPath + '_backup_' + Math.floor(Math.random() * 1000);
                    fs.renameSync(destPath, backupName);
                }

                fs.renameSync(srcPath, destPath);
                console.log(`✅ MOVED: ${rule.src} -> ${rule.dest}`);
            }
        } catch (error) {
            console.error(`❌ ERROR: ${error.message}`);
        }
    });
    console.log('\n✨ Cleanup Complete.');
}

runCleanup();
