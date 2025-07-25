#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Version update types
const VERSION_TYPES = {
  patch: 'patch',  // 1.0.0 -> 1.0.1
  minor: 'minor',  // 1.0.0 -> 1.1.0
  major: 'major'   // 1.0.0 -> 2.0.0
};

function updateVersion(type = 'patch') {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const currentVersion = package.version;
  const versionParts = currentVersion.split('.').map(Number);
  
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${versionParts[0] + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;
      break;
  }
  
  package.version = newVersion;
  
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');
  
  console.log(`✅ Version updated: ${currentVersion} -> ${newVersion}`);
  console.log(`📦 Package will be published as: win-audio-capture@${newVersion}`);
  
  return newVersion;
}

function showUsage() {
  console.log(`
🚀 Version Management Script

Usage:
  node scripts/version.js [type]

Types:
  patch  - Increment patch version (1.0.0 -> 1.0.1) [default]
  minor  - Increment minor version (1.0.0 -> 1.1.0)
  major  - Increment major version (1.0.0 -> 2.0.0)

Examples:
  node scripts/version.js          # 1.0.0 -> 1.0.1
  node scripts/version.js minor    # 1.0.0 -> 1.1.0
  node scripts/version.js major    # 1.0.0 -> 2.0.0

After updating version:
  1. Commit changes: git add . && git commit -m "Bump version to v[new-version]"
  2. Push to GitHub: git push origin main
  3. GitHub Actions will automatically publish to npm
  `);
}

// Main execution
const type = process.argv[2] || 'patch';

if (['help', '-h', '--help'].includes(type)) {
  showUsage();
  process.exit(0);
}

if (!VERSION_TYPES[type]) {
  console.error(`❌ Invalid version type: ${type}`);
  console.error(`Valid types: ${Object.keys(VERSION_TYPES).join(', ')}`);
  process.exit(1);
}

try {
  const newVersion = updateVersion(type);
  console.log(`
🎯 Next Steps:
1. git add .
2. git commit -m "Bump version to v${newVersion}"
3. git push origin main
4. GitHub Actions will automatically publish to npm
  `);
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
} 