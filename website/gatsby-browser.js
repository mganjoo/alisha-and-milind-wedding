import "typeface-tangerine" // script font
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

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
}
