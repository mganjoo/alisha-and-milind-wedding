module.exports = {
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    // When running in tests, typeface-* modules (CSS) should be mocked out
    "typeface-.+$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  testMatch: [
    "<rootDir>/stories/**/__tests__/**/*.[jt]s?(x)",
    "<rootDir>/stories/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  setupFiles: [`<rootDir>/jest-setup.js`],
  setupFilesAfterEnv: [`<rootDir>/jest-stories-post-setup.js`],
}
