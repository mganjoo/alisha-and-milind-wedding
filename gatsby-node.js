exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  createRedirect({
    fromPath: "/",
    toPath: "/save-the-date",
    isPermanent: false,
    redirectInBrowser: true,
    force: true,
  })
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
