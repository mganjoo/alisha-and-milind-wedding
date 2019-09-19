module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [`react-app`, `plugin:cypress/recommended`],
  rules: {
    "cypress/assertion-before-screenshot": 1,
  },
}
