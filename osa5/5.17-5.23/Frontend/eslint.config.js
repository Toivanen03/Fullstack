// @ts-nocheck

import { fixupConfigRules } from '@eslint/compat'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  ...compat.extends('.eslintrc.cjs'),
  {
    ignores: [
      '**/dist',
      '**/.eslintrc.cjs',
      '**/.eslint.config.js',
      '**/vite.config.js'],
  }, ...fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  )), {
    plugins: {
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: '18.2',
      },
    },

    rules: {
      indent: ['error', 2],
      'linebreak-style': [0],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],

      'arrow-spacing': ['error', {
        before: true,
        after: true,
      }],

      'no-console': 0,
      'no-unused-vars': 0,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 'off',

      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
      }],
    },
  }]