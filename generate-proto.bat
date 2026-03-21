@echo off
setlocal enabledelayedexpansion

:: Define paths relative to the script location
set "BASE_DIR=%~dp0"
set "PROTO_DIR=%BASE_DIR%proto-schema"
set "FRONTEND_DIR=%BASE_DIR%frontend"
set "FRONTEND_OUT=%FRONTEND_DIR%\src\generated"
set "TS_PLUGIN=%FRONTEND_DIR%\node_modules\.bin\protoc-gen-ts_proto.cmd"

echo 🚀 Starting Protobuf compilation for Windows...

:: 1. Clean and recreate frontend generated directory
if exist "%FRONTEND_OUT%" rd /s /q "%FRONTEND_OUT%"
mkdir "%FRONTEND_OUT%"

:: 2. Generate TypeScript for Next.js
echo 📦 Generating TypeScript for Next.js...
:: We wrap the plugin path in quotes in case your Windows username or path has spaces
protoc --plugin=protoc-gen-ts_proto="%TS_PLUGIN%" ^
    --ts_proto_out="%FRONTEND_OUT%" ^
    --proto_path="%PROTO_DIR%" ^
    --ts_proto_opt=esModuleInterop=true,outputJsonMethods=true,useOptionals=all ^
    "%PROTO_DIR%\*.proto"

:: 3. Generate Kotlin for Spring Boot
:: echo ☕ Generating Kotlin for Spring Boot...
:: cd /d "%BASE_DIR%backend"
:: call gradlew.bat generateProto
:: cd /d "%BASE_DIR%"

echo.
echo ✅ Compilation complete!
echo Files generated in: %FRONTEND_OUT%
echo.
pause