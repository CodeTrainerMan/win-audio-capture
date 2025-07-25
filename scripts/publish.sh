#!/bin/bash

# Windows Audio Capture - Publish Script
# This script helps publish the package to GitHub and npm

set -e

echo "🚀 Starting publish process..."

# Check if we're on main branch
if [[ $(git branch --show-current) != "main" ]]; then
    echo "❌ Error: Must be on main branch to publish"
    exit 1
fi

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Build the project
echo "📦 Building project..."
yarn build

# Run tests
echo "🧪 Running tests..."
yarn test

# Check if build was successful
if [ ! -f "dist/index.js" ]; then
    echo "❌ Error: Build failed - dist/index.js not found"
    exit 1
fi

echo "✅ Build successful"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Ask for new version
echo "📝 Enter new version (or press Enter to keep current):"
read -r NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    NEW_VERSION=$CURRENT_VERSION
fi

# Update version
echo "🔄 Updating version to $NEW_VERSION..."
npm version $NEW_VERSION --no-git-tag-version

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "chore: prepare for release v$NEW_VERSION"

# Create git tag
echo "🏷️ Creating git tag..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
git push origin "v$NEW_VERSION"

# Publish to npm
echo "📦 Publishing to npm..."
npm publish

echo "✅ Successfully published v$NEW_VERSION to GitHub and npm!"
echo "🔗 GitHub: https://github.com/CodeTrainerMan/win-audio-capture"
echo "📦 npm: https://www.npmjs.com/package/win-audio-capture" 