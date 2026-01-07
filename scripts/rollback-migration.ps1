# PowerShell Rollback Script
# Run if migration fails: .\scripts\rollback-migration.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupDir
)

Write-Host "⚠️  ROLLBACK: Restoring from backup..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $BackupDir)) {
    Write-Host "❌ Error: Backup directory not found: $BackupDir" -ForegroundColor Red
    exit 1
}

# Remove new structure
Write-Host "🗑️  Removing new structure..." -ForegroundColor Yellow
Remove-Item -Path "src/features" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/shared" -Recurse -Force -ErrorAction SilentlyContinue

# Restore backup
Write-Host "📦 Restoring from backup..." -ForegroundColor Yellow
Copy-Item -Path "$BackupDir/src/*" -Destination "src" -Recurse -Force

Write-Host "✅ Rollback Complete!" -ForegroundColor Green
Write-Host "   Original structure restored from: $BackupDir" -ForegroundColor Gray
