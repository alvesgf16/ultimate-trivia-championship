export default {
  '**/*.{ts,tsx,js,jsx,mjs}': [
    'prettier --write',
    'eslint --fix --max-warnings 0 --no-warn-ignored',
    () => 'turbo run type-check',
  ],
  '**/*.{json,md,yml,yaml}': ['prettier --write'],
};
