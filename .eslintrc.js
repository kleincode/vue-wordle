module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
