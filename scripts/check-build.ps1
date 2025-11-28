# PowerShell script to check if build folder has all required files
# Run with: .\scripts\check-build.ps1

Write-Host "🔍 Checking Build Folder..." -ForegroundColor Cyan
Write-Host ""

$buildPath = Join-Path $PSScriptRoot "..\build"

if (-not (Test-Path $buildPath)) {
    Write-Host "❌ Build folder doesn't exist!" -ForegroundColor Red
    Write-Host "   Run: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Build folder exists" -ForegroundColor Green
Write-Host ""

$requiredFiles = @(
    @{ File = "index.html"; Description = "Main HTML file" },
    @{ File = "_redirects"; Description = "Netlify redirects" },
    @{ File = ".htaccess"; Description = "Apache redirects" },
    @{ File = "web.config"; Description = "IIS redirects" }
)

$allPresent = $true

foreach ($item in $requiredFiles) {
    $filePath = Join-Path $buildPath $item.File
    $exists = Test-Path $filePath
    
    if ($exists) {
        Write-Host "✅ $($item.File) - $($item.Description)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($item.File) - $($item.Description) - MISSING" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""

if ($allPresent) {
    Write-Host "✅ All required files are present in build folder!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Deploy the build\ folder to your hosting platform"
    Write-Host "   2. Ensure your hosting platform supports the redirect method"
    Write-Host "   3. Test routes: / and /publicaties"
} else {
    Write-Host "⚠️  Some files are missing!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solution:" -ForegroundColor Cyan
    Write-Host "   1. Delete the build folder: Remove-Item -Recurse -Force build"
    Write-Host "   2. Rebuild: npm run build"
    Write-Host "   3. Run this check again"
    exit 1
}

