const babelOptions = {
  presets: ["babel-preset-gatsby"],
  // When running in tests, the require.context() call in storybook needs to be mocked
  // https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext
  plugins: ["require-context-hook"],
}

module.exports = require("babel-jest").createTransformer(babelOptions)
