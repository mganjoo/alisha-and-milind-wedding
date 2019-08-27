import { configure } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import "../gatsby-browser.js"

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// gatsby-specific mocks for using the Link API
// (see https://www.gatsbyjs.org/docs/visual-testing-with-storybook/)
// mock __PATH_PREFIX__ which Gatsby normally sets for components to use
global.__PATH_PREFIX__ = ``
// mock Gatsby loader methods to prevent console errors in storybook
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// mock Gatsby ___navigate method to observe the effect of clicking on nav links
global.___navigate = pathname => {
  action("gatsbyNavigate:")(pathname)
}

configure(loadStories, module)
