#!/bin/bash

# Make a temporary copy of the original package.json
cp package.json package.original.json

# Modify package.json to remove mongodb-memory-server
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  if (pkg.devDependencies) {
    delete pkg.devDependencies['mongodb-memory-server'];
  }
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Run npm install with production flags and ignore scripts
npm install --production --ignore-scripts

# Restore the original package.json
mv package.original.json package.json
