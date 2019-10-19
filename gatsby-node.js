require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  if (!yn(process.env.ENABLE_FULL_SITE)) {
    // If full site isn't enabled, redirect index page
    createRedirect({
      fromPath: "/",
      toPath: "/save-the-date",
      isPermanent: false,
      redirectInBrowser: true,
      force: true,
    })
  }
  createRedirect({
    fromPath: "/savethedate",
    toPath: "/save-the-date",
    isPermanent: true,
    redirectInBrowser: true,
  })
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === "develop") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            enforce: "pre",
            test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
            exclude: /(node_modules|.cache|public)/,
            loader: "eslint-loader",
            options: {
              emitWarning: true, // prevent hot module replacement from failing on error
            },
          },
        ],
      },
    })
  }
}
