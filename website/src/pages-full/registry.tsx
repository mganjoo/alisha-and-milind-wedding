import React, { useEffect } from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import Authenticated from "../components/partials/Authenticated"
import ExternalLink from "../components/ui/ExternalLink"
import Loading from "../components/ui/Loading"
import PageHeading from "../components/ui/PageHeading"

interface ZolaWrapperArgs {
  zolaKey: string
}

const ZolaWrapper: React.FC<ZolaWrapperArgs> = ({ zolaKey }) => {
  useEffect(() => {
    let script = document.createElement("script")
    script.src = "https://widget.zola.com/js/widget.js"
    script.id = "zola-wjs"
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.parentNode && script.parentNode.removeChild(script)
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

const RegistryPage = () => {
  return (
    <NavLayout>
      <SEO
        title="Registry"
        image="/meta-faq-hero.jpg"
        description="Information about our wedding registry."
      />
      <PageHeading>Registry</PageHeading>
      <Authenticated>
        <div className="c-article">
          <p>
            We will update this page with a link to our registry soon, and will
            also keep a box for cards at the reception. We humbly request no
            boxed gifts at the event.
          </p>
        </div>
        <ZolaWrapper zolaKey="alishaandmilind" />
      </Authenticated>
    </NavLayout>
  )
}
export default RegistryPage
