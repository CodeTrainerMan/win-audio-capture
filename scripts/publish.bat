@echo off
setlocal enabledelayedexpansion

REM Windows Audio Capture - Publish Script (Windows)
REM This script helps publish the package to GitHub and npm

echo 🚀 Starting publish process...

REM Check if we're on main branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo ❌ Error: Must be on main branch to publish
    exit /b 1
)

REM Check if there are uncommitted changes
for /f "tokens=*" %%i in ('git status --porcelain') do (
    echo ❌ Error: There are uncommitted changes. Please commit or stash them first.
    exit /b 1
)

REM Build the project
echo 📦 Building project...
call yarn build

REM Run tests
echo 🧪 Running tests...
call yarn test

REM Check if build was successful
if not exist "dist\index.js" (
    echo ❌ Error: Build failed - dist\index.js not found
    exit /b 1
)

echo ✅ Build successful

REM Get current version
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i
echo 📋 Current version: %CURRENT_VERSION%

REM Ask for new version
echo 📝 Enter new version (or press Enter to keep current):
set /p NEW_VERSION=

if "%NEW_VERSION%"=="" set NEW_VERSION=%CURRENT_VERSION%

REM Update version
echo 🔄 Updating version to %NEW_VERSION%...
call npm version %NEW_VERSION% --no-git-tag-version

REM Commit changes
echo 💾 Committing changes...
git add .
git commit -m "chore: prepare for release v%NEW_VERSION%"

REM Create git tag
echo 🏷️ Creating git tag...
git tag -a "v%NEW_VERSION%" -m "Release v%NEW_VERSION%"

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main
git push origin "v%NEW_VERSION%"

REM Publish to npm
echo 📦 Publishing to npm...
call npm publish

echo ✅ Successfully published v%NEW_VERSION% to GitHub and npm!
echo 🔗 GitHub: https://github.com/CodeTrainerMan/win-audio-capture
echo 📦 npm: https://www.npmjs.com/package/win-audio-capture

pause 