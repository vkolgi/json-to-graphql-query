import tsEslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
                tsconfigRootDir: '.',
                extraFileExtensions: ['.ts', '.tsx'],
            },
        },
        plugins: {
            '@typescript-eslint': tsEslint,
        },
        rules: {
            'comma-dangle': 'off',
            'sort-keys': 'off',
            'quote-props': ['error', 'as-needed'],
            'import/order': 'off',
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            eqeqeq: 'off',
            'brace-style': 'off',
            curly: 'off',
            'semi-style': 'off',
            'prefer-arrow/prefer-arrow-functions': 'off',
            quotes: ['error', 'single', { avoidEscape: true }],
            'for-in': 'off',
            '@typescript-eslint/naming-convention': 'off',
            'no-empty': 'off',
            'import/no-extraneous-dependencies': 'off',
            '@typescript-eslint/no-string-literal': 'off',
            'no-restricted-imports': 'off',
            'object-shorthand': 'off',
            '@typescript-eslint/explicit-member-accessibility': 'off',
            'prefer-ternary': 'off',
            'prefer-for-of': 'off',
            '@typescript-eslint/member-ordering': 'off',
            'prefer-object-spread': 'off',
            'eol-last': 'off',
            '@typescript-eslint/array-type': 'off',
        },
    },
];
