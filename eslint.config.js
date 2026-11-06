import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Readability rules: every if/else gets braces, no nested ternaries, no comma-operator tricks.
      curly: ['error', 'all'],
      'no-multi-assign': 'error',
      'no-else-return': 'error',
      'max-params': ['error', 4],
      'no-implicit-coercion': ['error', { allow: ['!!'] }],
      'no-nested-ternary': 'error',
      'no-sequences': 'error',
      'no-param-reassign': 'error',
      eqeqeq: ['error', 'always'],
      complexity: ['error', 10],
      'max-depth': ['error', 3],
    },
  },
  {
    // Test helpers export render utilities alongside components; fast refresh doesn't apply to them.
    files: ['src/test/**', '**/*.test.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
);
