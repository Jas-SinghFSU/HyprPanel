module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    ignorePatterns: ['.eslintrc.js', 'types/**/*.ts', 'scripts/**/*.js'],
    env: {
        es6: true,
        browser: true,
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'import/extensions': ['off'],
        'import/no-unresolved': 'off',
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    },
};
