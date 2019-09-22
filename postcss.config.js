module.exports = () => ({
  plugins: [
    require("tailwindcss"),
    require("postcss-nesting"),
    require("postcss-extend"),
    require("autoprefixer"),
  ],
})
