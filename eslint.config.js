import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        $: 'readonly',
        jQuery: 'readonly',
        bootstrap: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      eqeqeq: ['error', 'always'],
      'no-console': 'off',
    },
  },
];
