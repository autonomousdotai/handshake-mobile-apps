module.exports = {
  "extends": ["airbnb", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "plugins": ["react", "prettier", "import", "babel"],
  "env": {
    "node": true,
    "browser": true
  },
  "rules": {
    "require-jsdoc": 0,
    "max-len": "off",
    "quotes": [
      "error",
      "single",
      {
        "allowTemplateLiterals": true
      }
    ],
    "class-methods-use-this": "off",
    "object-curly-spacing": ["error", "always"],
    "react/jsx-uses-vars": [2],
    "react/sort-comp": [2],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prefer-stateless-function": "off",
    "react/forbid-prop-types": "off",
    "react/no-danger": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "import/no-unresolved": "off", // TODO[1]:
    "import/extensions": "off" // TODO[1]:
  },
  "settings": {
    // "import/resolver": "webpack" // TODO[1]:
  }
}
