import { useEffect } from "react"
import ExternalLink from "../ui/ExternalLink"
import Loading from "../ui/Loading"
import Authenticated from "./Authenticated"

interface ZolaWrapperArgs {
  zolaKey: string
}

const ZolaWrapper = ({ zolaKey }: ZolaWrapperArgs) => {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://widget.zola.com/js/widget.js"
    script.id = "zola-wjs"
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.parentNode?.removeChild(script)
    }
  }, [])
  return (
    <div
      className="text-center zola-registry-embed"
      data-registry-key={zolaKey}
    >
      <div className="mb-4">
        <Loading />
      </div>
      <ExternalLink
        className="shadow-md c-button c-button-primary c-button-comfortable"
        href={`https://www.zola.com/registry/${zolaKey}`}
      >
        Visit our wedding registry on Zola
      </ExternalLink>
    </div>
  )
}

const RegistryPage = () => (
  <Authenticated>
    <div className="c-article">
      <p>
        Here&rsquo;s a link to our registry! We will also keep a box for cards
        at the reception, but we humbly request no boxed gifts at the event.
      </p>
    </div>
    <ZolaWrapper zolaKey="alishaandmilind" />
  </Authenticated>
)

export default RegistryPage
