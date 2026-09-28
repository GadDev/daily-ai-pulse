export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'coverage/**', 'playwright-report/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    files: ['docs/reference-layouts/app.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
      },
    },
  },
  {
    files: ['docs/reference-layouts/validate.mjs'],
    languageOptions: {
      globals: {
        URL: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
];
