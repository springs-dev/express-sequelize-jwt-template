module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:node/recommended",
    "plugin:prettier/recommended"
  ],
  "env": {
    "es6": true,
    "commonjs": true,
    "node": true
  },
  "plugins": [
    "prettier"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "impliedStrict": true
    }
  },
  "rules": {
    "import/prefer-default-export": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "complexity": [2, { "max": 8 }],
    "max-depth": [2, { "max": 3 }],
    "node/exports-style": [2, "module.exports"],
    "node/file-extension-in-import": [2, "never"],
    "prettier/prettier": ["error", require('./.prettierrc.js')],
    "func-names": ["error", "never"],
  }
};
