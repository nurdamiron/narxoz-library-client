#!/bin/bash

# Start React app without source maps
echo "Starting React app without source maps..."
GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true DISABLE_ESLINT_PLUGIN=true npm start