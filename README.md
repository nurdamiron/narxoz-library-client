# Narxoz Library Client

This is the client application for the Narxoz Library system. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Build Issues Solution

If you encounter source map errors, please see [BUILD_FIX.md](./BUILD_FIX.md) for solutions.

## Quick Start

To run the application without source map errors:

```bash
./start-no-sourcemaps.sh
```

Or manually:

```bash
GENERATE_SOURCEMAP=false npm start
```

## Moderator Role

The moderator role has been fully implemented in the system. For details, see [MODERATOR_ROLE.md](../MODERATOR_ROLE.md).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `./fix-build.sh`

Fixes source map errors and provides alternative build methods.

### `./start-no-sourcemaps.sh`

Starts the development server without source maps to avoid build errors.

## Fixing Build Errors

If you encounter build errors, try one of these approaches:

1. Run the fix script:

```bash
./fix-build.sh
```

2. Start without source maps:

```bash
./start-no-sourcemaps.sh
```

3. Use environment variables:

```bash
GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true npm start
```

## Features

- Book catalog browsing
- Admin panel for managing books, users, and borrows
- User account management
- Bookmarking and borrowing books
- Event management and registration
- Multi-language support (Kazakh, Russian, English)
- Moderator role implementation

## Technologies Used

- React.js
- Material UI
- React Router
- i18next for internationalization
- Context API for state management

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).