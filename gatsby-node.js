const path = require("path")
const yn = require("yn")

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  if (yn(process.env.GUARD_PAGE_ONLY, { default: false })) {
    // If we are only building a single guard page ("save the date" or "coming soon"), replace
    // index page with single guard page and delete all other pages
    if (page.path === "/") {
      deletePage(page)
      createPage({
        path: "/",
        component: path.resolve(`./src/pages/coming-soon.js`),
      })
    } else if (!page.path.startsWith("/coming-soon")) {
      deletePage(page)
    }
  }
}
