module.exports = () => ({
  plugins: [
    require("tailwindcss"),
    require("postcss-nesting"),
    require("postcss-extend"),
    require("postcss-assets")({ loadPaths: ["src/images"] }),
    require("autoprefixer"),
  ],
})
