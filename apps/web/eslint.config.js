import { nextJsConfig } from '@repo/config/next-js';
import { strictConfig } from '@repo/config/strict';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...strictConfig,
  ...nextJsConfig,
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
];
