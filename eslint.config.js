module.exports = require('@antfu/eslint-config').default({
  rules: {
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
  },
})
