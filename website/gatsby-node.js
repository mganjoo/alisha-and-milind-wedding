require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

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
