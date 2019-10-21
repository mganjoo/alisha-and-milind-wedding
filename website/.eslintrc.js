module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:cypress/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  rules: {
    "cypress/assertion-before-screenshot": "warn",
    "react/jsx-key": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "warn",
  },
}
