module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:cypress/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  plugins: ["no-only-tests"],
  rules: {
    "cypress/assertion-before-screenshot": "warn",
    "no-only-tests/no-only-tests": "error",
    "react/jsx-key": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "warn",
    "import/default": "off",
    "import/order": ["error", { alphabetize: { order: "asc" } }],
  },
}
