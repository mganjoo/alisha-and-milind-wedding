module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.js",
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    // When running in tests, typeface-* modules (CSS) should be mocked out
    "typeface-.+$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  resetMocks: true,
  testPathIgnorePatterns: [`node_modules`, `.cache`, `<rootDir>/cypress`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  setupFiles: [`<rootDir>/jest-setupFiles.js`],
  collectCoverage: true,
  coverageDirectory: "jest-coverage",
  testEnvironment: "jsdom",
}
