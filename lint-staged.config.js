export default {
  '**/*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix --max-warnings 0 --no-warn-ignored',
    () => 'turbo run type-check',
  ],
  '**/*.{js,jsx,mjs}': ['prettier --write'],
  '**/*.{json,md,yml,yaml}': ['prettier --write'],
};
