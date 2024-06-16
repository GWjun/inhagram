module.exports = {
  extends: [
    'next/core-web-vitals',
    '@titicaca/eslint-config-triple',
    '@titicaca/eslint-config-triple/requiring-type-checking',
    '@titicaca/eslint-config-triple/frontend',
    '@titicaca/eslint-config-triple/prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
            message: 'React를 import할 필요가 없습니다.',
          },
        ],
      },
    ],
    curly: ['error', 'multi'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next/*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '#store/*',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '#pages/*',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '#components/*',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
