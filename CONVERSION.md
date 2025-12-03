# TypeScript to JavaScript Conversion

This document describes the TypeScript to JavaScript conversion process for the Climatee Weather Intelligence Platform.

## Overview

The repository has been successfully converted from TypeScript (.tsx/.ts) to JavaScript (.jsx) while maintaining all functionality. This conversion was done using automated Babel transpilation to strip type annotations.

## Conversion Details

### What Was Changed

1. **Source Files**
   - All `.tsx` files converted to `.jsx`
   - All `.ts` files converted to `.jsx` (all files use .jsx extension)
   - TypeScript type annotations removed
   - JSX syntax preserved
   - ES module imports/exports maintained

2. **Configuration**
   - TypeScript dependencies removed from `package.json`
   - `tsconfig.json` backed up to `tsconfig.json.backup`
   - ESLint configuration updated for JavaScript
   - Vite configuration converted to JavaScript

3. **Build System**
   - Build process now uses Vite without TypeScript compilation
   - Babel used for JSX transformation
   - No type checking during build

### Conversion Script

A conversion script is available at `scripts/convert-tsx-to-jsx.js` that can be used to convert TypeScript files to JavaScript.

**Usage:**
```bash
# Preview conversion (no changes made)
npm run convert:tsx

# Execute conversion (replaces .tsx/.ts with .jsx)
npm run convert:tsx:replace
```

**How it works:**
- Uses Babel with `@babel/preset-typescript` to strip types
- Uses `@babel/preset-react` for JSX transformation
- Preserves ES module syntax
- Converts all files to `.jsx` extension
- Automatically removes original TypeScript files when using `--replace`

## Running the Converted Project

### Install Dependencies

```bash
# Root dependencies (for conversion script)
npm install

# Frontend dependencies
cd frontend
npm install --legacy-peer-deps
```

### Build the Project

```bash
cd frontend
npm run build
```

### Run Development Server

```bash
cd frontend
npm run dev
```

### Lint Code

```bash
cd frontend
npm run lint
```

## Reverting the Conversion

If you need to revert to TypeScript:

1. **Restore TypeScript Configuration:**
   ```bash
   cd frontend
   mv tsconfig.json.backup tsconfig.json
   mv tsconfig.node.json.backup tsconfig.node.json
   ```

2. **Restore TypeScript Dependencies:**
   Edit `frontend/package.json` and add back:
   ```json
   {
     "devDependencies": {
       "typescript": "^5.2.2",
       "@types/react": "^18.2.43",
       "@types/react-dom": "^18.2.17",
       "@types/leaflet": "^1.9.8",
       "@typescript-eslint/eslint-plugin": "^6.14.0",
       "@typescript-eslint/parser": "^6.14.0"
     }
   }
   ```

3. **Manually Rename Files:**
   ```bash
   # In frontend/src directory
   find . -name "*.jsx" -exec sh -c 'mv "$0" "${0%.jsx}.tsx"' {} \;
   find . -name "*.js" -exec sh -c 'mv "$0" "${0%.js}.ts"' {} \;
   ```

4. **Restore ESLint Configuration:**
   Edit `frontend/.eslintrc.cjs` to use `@typescript-eslint/parser`

5. **Update Build Script:**
   Edit `frontend/package.json` scripts to include TypeScript compilation:
   ```json
   {
     "scripts": {
       "build": "tsc && vite build"
     }
   }
   ```

## Key Changes to Be Aware Of

1. **No Type Checking**: The project no longer has compile-time type checking. Runtime errors may occur where TypeScript would have caught issues.

2. **Babel Helpers**: Some files may contain Babel helper functions (like `_asyncToGenerator`) - this is normal and required for compatibility.

3. **JSX Runtime**: The project uses React's automatic JSX runtime, so explicit `React` imports are not needed in component files.

4. **Linting**: Some lint warnings about unused `React` imports may appear - these can be safely removed from files that use JSX.

## Files Modified

- All source files in `frontend/src/` (27 files converted)
- `frontend/package.json` - Dependencies updated
- `frontend/.eslintrc.cjs` - ESLint config for JavaScript
- `frontend/vite.config.js` - Vite config converted to JS
- `frontend/tsconfig.json` → `frontend/tsconfig.json.backup`
- Added `scripts/convert-tsx-to-jsx.js` - Conversion script
- Added `babel.config.json` - Babel configuration

## Testing

The converted code has been:
- ✅ Successfully built with Vite
- ✅ Linted (with expected warnings about unused React imports)
- ⚠️ Not runtime tested (would require running servers and API keys)

## Maintenance Notes

Going forward:
- Write new components in `.jsx` format
- Use PropTypes or JSDoc comments for documentation instead of TypeScript types
- Consider adding runtime validation for complex data structures
- ESLint will help catch common JavaScript errors

## Questions or Issues?

If you encounter any issues with the converted code, please check:
1. All dependencies are installed (`npm install --legacy-peer-deps`)
2. Node version is 18+ 
3. Build output in `dist/` folder is being generated correctly
4. No TypeScript files remain in `src/` directory
