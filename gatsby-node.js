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
