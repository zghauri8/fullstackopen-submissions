module.exports = {
env: { node: true, es2021: true },
parser: '@typescript-eslint/parser',
parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
plugins: ['@typescript-eslint'],
extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
rules: {
'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
},
};