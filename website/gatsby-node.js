require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const yn = require("yn")

const saveTheDateRedirectPages = yn(process.env.DISABLE_DEMO_PAGES)
  ? ["/savethedate", "/save-the-date"]
  : []

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

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent)

    createNodeField({
      node,
      name: "sourceName",
      value: fileNode.sourceInstanceName,
    })
  }
}
