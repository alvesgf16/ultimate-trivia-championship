import { strictConfig } from '@repo/config/strict';

/**
 * Root ESLint configuration for the monorepo.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  ...strictConfig,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
