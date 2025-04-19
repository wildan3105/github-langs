module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier', // must come last
    ],
    rules: {
        'import/order': [
        'warn',
        {
            groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index']],
            'newlines-between': 'always',
        },
        ],
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    env: {
        node: true,
        es2021: true,
    },
};