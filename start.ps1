# Nian Chat - Start Script
Write-Host "Starting Nian Chat..." -ForegroundColor Cyan

# Kill any processes already on our ports
foreach ($port in @(8063, 3000)) {
    $pids = (netstat -ano | Select-String ":$port\s.*LISTENING") -replace '.*LISTENING\s+', '' | ForEach-Object { $_.Trim() } | Select-Object -Unique
    foreach ($p in $pids) {
        if ($p -match '^\d+$') {
            Write-Host "Killing PID $p on port $port..." -ForegroundColor Yellow
            taskkill /PID $p /F 2>$null | Out-Null
        }
    }
}
Start-Sleep -Seconds 1

if (-not (Test-Path "backend")) { Write-Host "Error: backend directory not found!" -ForegroundColor Red; exit 1 }
if (-not (Test-Path "frontend")) { Write-Host "Error: frontend directory not found!" -ForegroundColor Red; exit 1 }

$modelFiles = Get-ChildItem -Path "backend" -Filter "*.gguf" -File
if ($modelFiles.Count -eq 0) { Write-Host "Warning: No .gguf model file found in backend/" -ForegroundColor Yellow }

$pythonCmd = if (Test-Path "$PSScriptRoot\venv\Scripts\python.exe") { "$PSScriptRoot\venv\Scripts\python.exe" } else { "python" }
$llamaCppLib = "$PSScriptRoot\venv\Lib\site-packages\llama_cpp\lib"
$env:PATH = "$llamaCppLib;$env:PATH"

Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = '$llamaCppLib;' + `$env:PATH; Set-Location '$PSScriptRoot\backend'; & '$pythonCmd' guff_server.py"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm start"

Write-Host ""
Write-Host "Backend API: http://localhost:8063" -ForegroundColor Cyan
Write-Host "Frontend UI: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs:    http://localhost:8063/docs" -ForegroundColor Cyan