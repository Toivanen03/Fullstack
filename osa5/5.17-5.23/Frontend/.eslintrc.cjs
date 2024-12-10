module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'plugin:vitest-globals/recommended',
  ],
  'env': {
    "vitest-globals/env": true
  },
  rules: {
    'eqeqeq': 'error',
  },
}
