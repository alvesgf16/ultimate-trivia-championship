import { nextJsConfig } from '@repo/config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['eslint.config.js'],
  },
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
