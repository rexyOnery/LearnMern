import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
      ],
      'react/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': 'off'
    }
  }
];
