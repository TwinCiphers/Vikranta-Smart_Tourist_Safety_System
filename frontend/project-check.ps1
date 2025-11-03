# ========================================
# VIKRANTA PROJECT COMPREHENSIVE CHECK
# ========================================

Write-Host "
=== 1. PROJECT STRUCTURE CHECK ===" -ForegroundColor Cyan
Write-Host "Checking critical files..." -ForegroundColor Yellow

$critical_files = @(
    'package.json',
    'truffle-config.js',
    'docker-compose.yml',
    'nginx.conf',
    'backend/server.js',
    'contracts/TouristRegistry.sol',
    'frontend/home.html',
    'frontend/portal.html',
    'frontend/dashboard.html',
    'frontend/authority-login.html',
    'frontend/authority-panel.html'
)

$missing = @()
foreach ($file in $critical_files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
        $missing += $file
    }
}

Write-Host "
=== 2. BACKEND STRUCTURE CHECK ===" -ForegroundColor Cyan
$backend_dirs = @('backend/routes', 'backend/middleware', 'backend/config', 'backend/utils', 'backend/services')
foreach ($dir in $backend_dirs) {
    if (Test-Path $dir) {
        $count = (Get-ChildItem $dir -File).Count
        Write-Host "[OK] $dir ($count files)" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $dir" -ForegroundColor Red
    }
}

Write-Host "
=== 3. FRONTEND STRUCTURE CHECK ===" -ForegroundColor Cyan
$frontend_dirs = @('frontend/css', 'frontend/js')
foreach ($dir in $frontend_dirs) {
    if (Test-Path $dir) {
        $count = (Get-ChildItem $dir -File).Count
        Write-Host "[OK] $dir ($count files)" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $dir" -ForegroundColor Red
    }
}

Write-Host "
=== 4. DEPENDENCIES CHECK ===" -ForegroundColor Cyan
if (Test-Path 'node_modules') {
    $modules_count = (Get-ChildItem 'node_modules' -Directory).Count
    Write-Host "[OK] node_modules installed ($modules_count packages)" -ForegroundColor Green
} else {
    Write-Host "[WARNING] node_modules not found - Run 'npm install'" -ForegroundColor Yellow
}

Write-Host "
=== 5. CONTRACTS CHECK ===" -ForegroundColor Cyan
if (Test-Path 'build/contracts') {
    $contracts = Get-ChildItem 'build/contracts' -Filter '*.json'
    Write-Host "[OK] Compiled contracts: $($contracts.Count)" -ForegroundColor Green
    foreach ($contract in $contracts) {
        Write-Host "  - $($contract.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "[WARNING] Contracts not compiled - Run 'truffle compile'" -ForegroundColor Yellow
}

Write-Host "
=== 6. DOCKER CHECK ===" -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "[OK] Docker installed" -ForegroundColor Green
    
    try {
        docker-compose --version | Out-Null
        Write-Host "[OK] Docker Compose installed" -ForegroundColor Green
    } catch {
        Write-Host "[WARNING] Docker Compose not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Docker not installed or not running" -ForegroundColor Yellow
}

Write-Host "
=== 7. SSL CERTIFICATES CHECK ===" -ForegroundColor Cyan
if (Test-Path 'ssl') {
    $ssl_files = @('certificate.crt', 'private.key', 'certificate.pfx')
    foreach ($file in $ssl_files) {
        if (Test-Path "ssl/$file") {
            $size = (Get-Item "ssl/$file").Length
            Write-Host "[OK] ssl/$file ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "[MISSING] ssl/$file" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[WARNING] SSL directory not found" -ForegroundColor Yellow
}

Write-Host "
=== 8. DOCUMENTATION CHECK ===" -ForegroundColor Cyan
if (Test-Path 'docs') {
    $docs = (Get-ChildItem 'docs' -File -Filter '*.md').Count
    Write-Host "[OK] Documentation files: $docs" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Docs directory not found" -ForegroundColor Yellow
}

Write-Host "
=== 9. CONFIGURATION FILES CHECK ===" -ForegroundColor Cyan
$config_files = @('.env', '.gitignore', 'README.md', 'QUICK_START.md')
foreach ($file in $config_files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Yellow
    }
}

Write-Host "
=== 10. RECENT IMPROVEMENTS CHECK ===" -ForegroundColor Cyan
if (Test-Path 'qr-improvements.txt') {
    Write-Host "[OK] QR code improvements documented" -ForegroundColor Green
}
if (Test-Path 'docs/PVC_CARD_IMPLEMENTATION.md') {
    Write-Host "[OK] PVC card implementation documented" -ForegroundColor Green
}

Write-Host "
=== SUMMARY ===" -ForegroundColor Cyan
if ($missing.Count -eq 0) {
    Write-Host "
 ALL CRITICAL FILES PRESENT!" -ForegroundColor Green
} else {
    Write-Host "
  Missing $($missing.Count) critical file(s):" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

Write-Host "
=== PROJECT STATUS ===" -ForegroundColor Cyan
Write-Host "Repository: Vikranta-Blockchain_ID_Generation" -ForegroundColor White
Write-Host "Owner: TwinCiphers" -ForegroundColor White
Write-Host "Branch: main" -ForegroundColor White
Write-Host "Date: November 3, 2025" -ForegroundColor White

Write-Host "
========================================" -ForegroundColor Cyan
Write-Host "PROJECT CHECK COMPLETE" -ForegroundColor Green
Write-Host "========================================
" -ForegroundColor Cyan
