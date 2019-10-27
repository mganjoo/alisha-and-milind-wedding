module.exports = ({ env }) => ({
  plugins: [
    require("tailwindcss"),
    require("postcss-nesting"),
    require("postcss-extend"),
    require("postcss-assets")({ loadPaths: ["src/images"] }),
    env === "production"
      ? require("postcss-custom-properties")({ preserve: false })
      : false,
    env === "production" ? require("postcss-calc")({ preserve: false }) : false,
    require("autoprefixer"),
  ],
})
