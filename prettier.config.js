module.exports = {
  arrowParens: "always",
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  overrides: [
    {
      // TODO: this is temporary due to lerna/npm v7 issue
      // https://github.com/lerna/lerna/issues/2845
      files: ["**/package-lock.json"],
      options: {
        tabWidth: 4,
        useTabs: true,
      },
    },
  ],
}
