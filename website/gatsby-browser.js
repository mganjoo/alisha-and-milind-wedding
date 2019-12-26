import "typeface-playfair-display" // site header font
import "typeface-arizonia" // script font
import "typeface-raleway" // sans serif font
import "typeface-eb-garamond" // serif font
import "./src/styles/global.css"

export const onRouteUpdate = () => {
  const branch = process.env.GATSBY_GA_BRANCH
  typeof window !== "undefined" &&
    window.gtag &&
    branch &&
    window.gtag("event", "branch_dimension", {
      branch: branch,
    })
}
