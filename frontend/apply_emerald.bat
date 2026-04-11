@echo off
setlocal enabledelayedexpansion

echo =======================================
echo    EMERALD THEME TRANSFORMER (FIXED)
echo =======================================

:: 1. Check for Drag and Drop
set "target_dir=%~1"

:: 2. Prompt if no path provided
if "%target_dir%"=="" (
    echo.
    set /p "target_dir=Enter the folder path (or press Enter for current directory): "
)

:: 3. Default to current
if "%target_dir%"=="" set "target_dir=."

:: 4. Verify Path
if not exist "%target_dir%" (
    echo.
    echo [ERROR] The directory "%target_dir%" does not exist.
    pause
    exit /b
)

echo.
echo Target: %target_dir%
echo Handling brackets and special paths...
echo ---------------------------------------

:: Use -LiteralPath to fix the [id] error
powershell -Command ^
    "$files = Get-ChildItem -Path '%target_dir%' -Filter *.tsx -Recurse;" ^
    "foreach ($file in $files) {" ^
        "$content = Get-Content -LiteralPath $file.FullName;" ^
        "$content = $content -replace 'text-emerald-50', 'text-emerald-800';" ^
        "$content = $content -replace 'text-emerald-100', 'text-emerald-700';" ^
        "$content = $content -replace '/30', '';" ^
        "$content = $content -replace '/300', '';" ^
        "$content = $content -replace 'text-slate-900', 'text-slate-950';" ^
        "$content = $content -replace 'bg-emerald-50/30', 'bg-emerald-50';" ^
        "$content | Set-Content -LiteralPath $file.FullName;" ^
        "Write-Host ('Sharpened: ' + $file.Name) -ForegroundColor Green" ^
    "}"

echo -----------------------------------------------
echo Done! Text is now high-contrast and readable.
pause