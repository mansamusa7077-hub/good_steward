@echo off
setlocal
set "AGENT_DIR=%~dp0"
set "SCAN_TARGET=%~1"
if "%SCAN_TARGET%"=="" set "SCAN_TARGET=%CD%"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required.
  echo Download it from https://nodejs.org/
  pause
  exit /b 3
)

echo Good Steward Cyber Guardian
echo Read-only scan target: %SCAN_TARGET%
echo.
node "%AGENT_DIR%dist\index.js" --target "%SCAN_TARGET%" --output "%SCAN_TARGET%\.good-steward\evidence-ledger.json"
set "RESULT=%ERRORLEVEL%"
echo.
echo Report: %SCAN_TARGET%\.good-steward\evidence-ledger.json
pause
exit /b %RESULT%
