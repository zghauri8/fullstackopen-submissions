module.exports = {
  env: { es2021: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: { version: 'detect' },
  },
};