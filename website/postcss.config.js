module.exports = ({ env }) => ({
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting")(require("postcss-nesting")),
    require("tailwindcss"),
    require("postcss-assets")({ loadPaths: ["src/images"] }),
    env === "production"
      ? require("postcss-custom-properties")({ preserve: false })
      : false,
    env === "production" ? require("postcss-calc")({ preserve: false }) : false,
    require("autoprefixer"),
  ],
})
