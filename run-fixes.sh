#!/bin/bash

# Script to run all fixes
echo "Running all fixes to resolve build issues..."

# Run the module fixer script
node fix-modules.js

# Run the build
echo "Starting the application with fixes applied..."
npm run start-no-sourcemaps