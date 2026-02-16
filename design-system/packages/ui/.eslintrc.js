/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/react.js'],
  overrides: [
    {
      files: ['src/components/**/*.tsx', 'src/components/**/*.ts'],
      rules: {
        'unicorn/filename-case': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: ['**/*.stories.tsx'] },
        ],
      },
    },
  ],
}
