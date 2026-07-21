module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: ['eslint:recommended', 'plugin:cypress/recommended'],
  plugins: ['cypress'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'cypress/no-unnecessary-waiting': 'warn',
  },
  ignorePatterns: ['node_modules/', 'cypress/reports/', 'cypress/videos/', 'cypress/screenshots/'],
};
