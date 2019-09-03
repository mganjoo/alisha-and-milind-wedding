const path = require("path")
const yn = require("yn")

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  if (yn(process.env.SAVE_THE_DATE, { default: false })) {
    // We deploy only a single page in the save the date environment
    if (page.path === "/") {
      // Replace index page with coming soon page
      deletePage(page)
      createPage({
        path: "/",
        component: path.resolve(`./src/pages/coming-soon.js`),
      })
    } else if (!page.path.startsWith("/coming-soon")) {
      // Delete all pages except /coming-soon
      deletePage(page)
    }
  }
}
