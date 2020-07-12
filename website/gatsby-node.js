require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")

const saveTheDateRedirectPages = yn(process.env.ENABLE_DEMO_PAGES)
  ? []
  : ["/savethedate", "/save-the-date"]

const fullSiteRedirectPages = yn(process.env.GATSBY_DISABLE_FULL_SITE)
  ? ["/schedule", "/travel", "/story", "/video", "/faq", "/registry", "/rsvp"]
  : []

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  saveTheDateRedirectPages.concat(fullSiteRedirectPages).forEach((page) => {
    createRedirect({
      fromPath: page,
      toPath: "/",
      redirectInBrowser: true,
    })
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
