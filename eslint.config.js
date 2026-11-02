import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      curly: ['error', 'all'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionExpression',
          message: 'Use an arrow function unless dynamic this or generator semantics are required.',
        },
      ],
    },
  },
  prettier,
]);
