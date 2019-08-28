import { addParameters, configure } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import "../gatsby-browser.js"

// automatically import all files ending in *.stories.js in stories/
const req = require.context("../stories", true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

const responsiveViewports = {
  mobile_small: {
    name: "mobile small",
    styles: {
      height: "568px",
      width: "320px",
    },
    type: "mobile",
  },
  mobile_large: {
    name: "mobile large",
    styles: {
      height: "812px",
      width: "375px",
    },
    type: "mobile",
  },
  sm: {
    name: "sm",
    styles: {
      height: "1280px",
      width: "720px",
    },
    type: "mobile",
  },
  md: {
    name: "md",
    styles: {
      height: "1024px",
      width: "768px",
    },
    type: "tablet",
  },
  lg: {
    name: "lg",
    styles: {
      height: "1366px",
      width: "1024px",
    },
    type: "tablet",
  },
  xl: {
    name: "xl",
    styles: {
      height: "800px",
      width: "1280px",
    },
    type: "desktop",
  },
}
addParameters({ viewport: { viewports: responsiveViewports } })

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
