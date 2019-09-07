const systemPath = require("path")
const yn = require("yn")

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  if (yn(process.env.GUARD_PAGE_ONLY, { default: false })) {
    const pagesToDelete = ["/our-story", "/events", "/faq", "/travel", "/rsvp"]
    // If we are only building a single guard page ("save the date" or "coming soon"), replace
    // index page with single guard page and delete all other pages
    if (
      page.path === "/" &&
      page.component === systemPath.resolve(`./src/pages/index.js`)
    ) {
      deletePage(page)
      createPage({
        path: "/",
        component: systemPath.resolve(`./src/pages/coming-soon.js`),
      })
    } else if (pagesToDelete.some(path => page.path.startsWith(path))) {
      deletePage(page)
    }
  }
}
