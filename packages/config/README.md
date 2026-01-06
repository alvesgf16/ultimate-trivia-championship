# `@repo/config`

Collection of shared ESLint configurations for the monorepo.

## Available Configurations

### `@repo/config/base`

Basic ESLint configuration with recommended rules, Prettier, and Turbo plugin. Suitable for all packages.

### `@repo/config/strict`

Strict ESLint configuration with enhanced rules for imports, unused code, and code quality. Includes:

- Import organization and validation
- Unused imports detection
- SonarJS code quality rules
- TypeScript type checking

### `@repo/config/nestjs`

ESLint configuration tailored for NestJS applications. Extends `base` with:

- Node.js and Jest globals
- Strict TypeScript rules for backend development
- Import management with Node.js resolver
- Code quality and best practices rules

### `@repo/config/next-js`

ESLint configuration for Next.js applications. Includes:

- React and React Hooks support
- Next.js specific rules
- Accessibility checks
- Service worker globals

### `@repo/config/react-internal`

ESLint configuration for internal React libraries.

## Usage

Import the desired configuration in your ESLint config file:

```javascript
import { nestJsConfig } from '@repo/config/nestjs';
import { strictConfig } from '@repo/config/strict';
import { nextJsConfig } from '@repo/config/next-js';

export default [
  ...nestJsConfig,
  {
    // Your custom overrides
  },
];
```

### Important: Parser Options

When using configurations that require TypeScript type checking (strict, nestjs), you must specify explicit `tsconfig` paths:

```javascript
export default [
  ...nestJsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.build.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

This ensures proper performance and resolution in the monorepo.
