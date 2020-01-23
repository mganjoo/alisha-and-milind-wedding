exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  createRedirect({
    fromPath: "/savethedate",
    toPath: "/",
    isPermanent: true,
    redirectInBrowser: true,
  })
  createRedirect({
    fromPath: "/save-the-date",
    toPath: "/",
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
