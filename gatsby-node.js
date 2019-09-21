exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  createRedirect({
    fromPath: "/",
    toPath: "/save-the-date",
    isPermanent: false,
    redirectInBrowser: true,
  })
}
