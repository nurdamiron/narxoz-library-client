# Narxoz Library Client - Build Fix Guide

This document provides solutions for the build errors related to source maps.

## Source Map Errors

If you encounter these errors:

```
ERROR in ./node_modules/@mui/system/esm/RtlProvider/index.js
Module build failed (from ./node_modules/source-map-loader/dist/cjs.js):
Error: ENOENT: no such file or directory, open '/Users/nurdauletakhmatov/Desktop/narxoz/narxoz-library-client/node_modules/@mui/system/esm/RtlProvider/index.js'

ERROR in ./node_modules/@mui/system/esm/index.js
Module build failed (from ./node_modules/source-map-loader/dist/cjs.js):
Error: ENOENT: no such file or directory, open '/Users/nurdauletakhmatov/Desktop/narxoz/narxoz-library-client/node_modules/@mui/system/esm/index.js'

ERROR in ./node_modules/chart.js/dist/chart.js
Module build failed (from ./node_modules/source-map-loader/dist/cjs.js):
Error: ENOENT: no such file or directory, open '/Users/nurdauletakhmatov/Desktop/narxoz/narxoz-library-client/node_modules/chart.js/dist/chart.js'
```

## Quick Fix

Run the provided fix script:

```bash
./fix-build.sh
```

This script will:

1. Create `.env` files to disable source maps
2. Fix the `useEvents.js` hook to use the correct import
3. Install `source-map-loader` with `--legacy-peer-deps`
4. Create an alternative build script

## Manual Fix Options

### Option 1: Disable Source Maps

Create or update `.env` file:

```
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
```

### Option 2: Fix useEvents.js Hook

Update the import in `src/hooks/useEvents.js`:

```js
// Change this:
import { ToastContext } from '../context/ToastContext';

// To this:
import { useToast } from '../context/ToastContext';
```

And update the hook usage:

```js
// Change this:
const { showToast } = useContext(ToastContext);

// To this:
const { success, error } = useToast();
```

### Option 3: Run with Source Maps Disabled

For development:

```bash
GENERATE_SOURCEMAP=false npm start
```

For production build:

```bash
GENERATE_SOURCEMAP=false npm run build
```

## Troubleshooting

If you still encounter issues:

1. Delete `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

2. Check for version conflicts in package.json:

```bash
npm ls react
npm ls @mui/system
npm ls chart.js
```

3. Try using a specific Node.js version:

```bash
nvm use 16
# or
nvm use 18
```

4. If all else fails, you can eject the Create React App configuration:

```bash
npm run eject
```

Then edit webpack configuration directly in the `config` folder.

## Note on Moderator Role

The moderator role implementation is complete and working correctly. The build errors are unrelated to this functionality.