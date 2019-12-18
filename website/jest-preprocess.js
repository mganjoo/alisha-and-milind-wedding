const babelOptions = {
  presets: ["babel-preset-gatsby", "@babel/preset-typescript"],
  plugins: ["babel-plugin-react-css-modules"],
}
module.exports = require("babel-jest").createTransformer(babelOptions)
